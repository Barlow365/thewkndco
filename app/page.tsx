import { useState } from "react";
import { DEFAULT_SNIPPET, Editor } from "@/components/Editor";
import { OutputPanel } from "@/components/OutputPanel";

type ResultState = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  success: boolean | null;
};

export default function HomePage() {
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Idle");
  const [result, setResult] = useState<ResultState>({
    stdout: "Awaiting execution...",
    stderr: "",
    exitCode: null,
    success: null,
  });
  const [networkError, setNetworkError] = useState("");

  const handleRunClick = async () => {
    setIsRunning(true);
    setStatusMessage("Running code...");
    setResult((prev) => ({
      ...prev,
      stdout: "Sending code to execution service...",
      stderr: "",
      exitCode: null,
      success: null,
    }));
    setNetworkError("");

    try {
      const response = await fetch("/api/run-python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      const apiResult: ResultState = {
        stdout:
          typeof data.stdout === "string"
            ? data.stdout
            : "Execution succeeded with no stdout.",
        stderr: typeof data.stderr === "string" ? data.stderr : "",
        exitCode: typeof data.exitCode === "number" ? data.exitCode : null,
        success: typeof data.success === "boolean" ? data.success : null,
      };

      if (response.ok) {
        setStatusMessage("Execution complete");
      } else {
        setStatusMessage("Execution failed");
        if (!apiResult.stderr) {
          apiResult.stderr = `Execution service returned ${response.status} ${response.statusText}`;
        }
      }

      setResult(apiResult);
    } catch (error) {
      console.error("Run request failed", error);
      setStatusMessage("Network error");
      setResult({ stdout: "", stderr: "", exitCode: null, success: false });
      setNetworkError(
        "Unable to reach the execution service. Check your connection and try again."
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[var(--muted)]">
            Online Python Compiler
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--foreground)]">
            Run Python code in your browser with a sandboxed backend
          </h1>
          <p className="text-lg text-[var(--muted)]">
            A minimal environment to write Python snippets, execute them safely, and
            see the results at a glance.
          </p>
        </header>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-lg shadow-slate-200/60">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Editor area</h2>
                <span className="text-sm text-[var(--muted)]">Python</span>
              </div>
              <Editor value={code} onCodeChange={setCode} />
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted)]">{statusMessage}</p>
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleRunClick}
                  className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRunning ? "Running..." : "Run"}
                </button>
              </div>
            </div>

            <div className="flex-1">
              <OutputPanel
                stdout={result.stdout}
                stderr={result.stderr}
                exitCode={result.exitCode}
                success={result.success}
                statusMessage={statusMessage}
                isRunning={isRunning}
                networkError={networkError}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
