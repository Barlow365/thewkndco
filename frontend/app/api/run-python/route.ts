import { NextRequest, NextResponse } from "next/server";

const PRINT_LITERAL_REGEX = /print\s*\(\s*["']([^"']*)["']\s*\)/;

type SimulationResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
};

function simulatePython(code: string): SimulationResult {
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      stdout: "",
      stderr: "SyntaxError: empty code block",
      exitCode: 1,
      success: false,
    };
  }

  if (/pritn\s*\(/.test(code)) {
    return {
      stdout: "",
      stderr: "NameError: name 'pritn' is not defined",
      exitCode: 1,
      success: false,
    };
  }

  const literalMatch = code.match(PRINT_LITERAL_REGEX);
  if (literalMatch) {
    return {
      stdout: literalMatch[1],
      stderr: "",
      exitCode: 0,
      success: true,
    };
  }

  if (/print\s*\(/.test(code)) {
    return {
      stdout: "",
      stderr: "SyntaxError: invalid print statement",
      exitCode: 1,
      success: false,
    };
  }

  return {
    stdout: "",
    stderr: "RuntimeError: simulated execution does not support this snippet",
    exitCode: 1,
    success: false,
  };
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        stdout: "",
        stderr: "Invalid JSON payload.",
        exitCode: 1,
        success: false,
      },
      { status: 400 }
    );
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json(
      {
        stdout: "",
        stderr: "Payload must be an object.",
        exitCode: 1,
        success: false,
      },
      { status: 400 }
    );
  }

  const body = payload as Record<string, unknown>;
  if (typeof body.code !== "string") {
    return NextResponse.json(
      {
        stdout: "",
        stderr: "'code' must be a string.",
        exitCode: 1,
        success: false,
      },
      { status: 400 }
    );
  }

  const result = simulatePython(body.code);
  return NextResponse.json(result);
}
