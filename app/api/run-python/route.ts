import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

const EXECUTION_TIMEOUT_MS = 4000;

type ExecutionResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

function runPython(interpreter: string, code: string): Promise<ExecutionResult> {
  return new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    let settled = false;

    const child = spawn(interpreter, ["-c", code], {
      env: process.env,
    });

    const onComplete = (result: ExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(result);
    };

    const onFailure = (error: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(error);
    };

    const timeout = setTimeout(() => {
      if (settled) return;
      stderr += stderr ? "\n" : "";
      stderr += "Execution timed out.";
      child.kill("SIGTERM");
      onComplete({ stdout, stderr, exitCode: 1 });
    }, EXECUTION_TIMEOUT_MS);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", onFailure);
    child.on("close", (code) => {
      onComplete({ stdout, stderr, exitCode: typeof code === "number" ? code : 0 });
    });
  });
}

async function tryInterpreters(code: string[]): Promise<ExecutionResult> {
  const interpreters = Array.from(new Set([
    process.env.PYTHON_BIN,
    "python3",
    "python",
  ].filter(Boolean))) as string[];

  let lastError: Error | null = null;
  for (const interpreter of interpreters) {
    try {
      return await runPython(interpreter, code.join("\n"));
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown interpreter error");
    }
  }
  return Promise.reject(lastError ?? new Error("No Python interpreter available"));
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { stdout: "", stderr: "Invalid JSON payload.", exitCode: 1 },
      { status: 400 }
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      { stdout: "", stderr: "Payload must be an object.", exitCode: 1 },
      { status: 400 }
    );
  }

  const body = payload as Record<string, unknown>;
  const code = typeof body.code === "string" ? body.code : "";

  if (!code.trim()) {
    return NextResponse.json(
      { stdout: "", stderr: "Code snapshot is empty.", exitCode: 1 },
      { status: 400 }
    );
  }

  try {
    const result = await tryInterpreters(code.split("\n"));
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to execute Python code.";
    return NextResponse.json(
      { stdout: "", stderr: message, exitCode: 1 },
      { status: 500 }
    );
  }
}
