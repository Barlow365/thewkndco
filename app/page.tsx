import { Editor } from "@/components/Editor";

export default function HomePage() {
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
              <Editor />
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted)]">Ready to run</p>
                <button
                  type="button"
                  className="rounded-full bg-[var(--accent)] px-6 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Run code
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-inner">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Output panel</h3>
                <span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">stdout</span>
              </div>
              <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white/40 p-4 text-sm text-[var(--muted)]">
                <p>Standard output appears here along with errors or warnings.</p>
              </div>
              <div className="text-xs text-[var(--muted)]">
                Execution status, runtime, and exit code will be shown after each run.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
