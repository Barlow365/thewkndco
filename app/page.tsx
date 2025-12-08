import { useState } from "react";
import { DEFAULT_SNIPPET, Editor } from "@/components/Editor";

export default function HomePage() {
  const [code, setCode] = useState(DEFAULT_SNIPPET);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Idle");
  const [stdout, setStdout] = useState("Awaiting execution...");
  const [stderr, setStderr] = useState("");

  const handleRunClick = async () => {
    setIsRunning(true);
    setStatusMessage("Running code...");
    setStdout("Sending code to execution service...");
    setStderr("");

    try {
      const response = await fetch("/api/run-python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setStatusMessage("Execution failed");
        setStdout(data.stdout ?? "");
        setStderr(
          data.stderr ??
            `Execution service returned ${response.status} ${response.statusText}`
        );
      } else {
        setStatusMessage("Execution complete");
        setStdout(data.stdout ?? "Execution succeeded with no stdout.");
        setStderr(data.stderr ?? "");
      }
    } catch (error) {
      console.error("Run request failed", error);
      setStatusMessage("Network error");
      setStdout("");
      setStderr("Unable to reach the execution service.");
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
            A minimal environment to write Python snippets, execute them safely, and see the
            results at a glance.
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
                  {isRunning ? "Running..." : "Run code"}
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-inner">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Output panel</h3>
                <span
                  className="rounded-full border border-[var(--border)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[var(--muted)]"
                >
                  stdout / stderr
                </span>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/40 p-4 text-sm text-[var(--foreground)]">
                  <p className="font-mono text-xs leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
                    {stdout || "No stdout yet."}
                  </p>
                </div>
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    stderr
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-[var(--border)] bg-[var(--surface-alt)] text-[var(--muted)]"
                  }`}
                >
                  <span className="font-semibold">stderr</span>
                  <p className="mt-1 font-mono text-xs">
                    {stderr || "No errors detected."}
                  </p>
                </div>
              </div>
              <div className="text-xs text-[var(--muted)]">
                Execution status: <span className="font-semibold">{statusMessage}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
