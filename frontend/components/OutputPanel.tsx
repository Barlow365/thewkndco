type OutputPanelProps = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  success: boolean | null;
  statusMessage: string;
  isRunning: boolean;
  networkError: string;
};

function statusLabel(
  statusMessage: string,
  isRunning: boolean,
  success: boolean | null,
  exitCode: number | null,
  networkError: string
) {
  if (networkError) return "Network error";
  if (isRunning) return "Running...";
  if (success) return `Success (exit code ${exitCode ?? 0})`;
  if (exitCode !== null) return `Error (exit code ${exitCode})`;
  return statusMessage || "Idle";
}

export function OutputPanel({
  stdout,
  stderr,
  exitCode,
  success,
  statusMessage,
  isRunning,
  networkError,
}: OutputPanelProps) {
  return (
    <div
      role="region"
      aria-labelledby="output-panel-heading"
      aria-live="polite"
      className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-inner"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 id="output-panel-heading" className="text-lg font-semibold text-[var(--foreground)]">Output panel</h3>
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">stdout / stderr</p>
        </div>
        <span className="text-xs font-semibold text-[var(--muted)]">
          Status: {statusLabel(statusMessage, isRunning, success, exitCode, networkError)}
        </span>
      </div>

      <div className="space-y-2">
        <div
          aria-label="Standard output"
          className="rounded-2xl border border-dashed border-[var(--border)] bg-white/40 p-4 text-sm text-[var(--foreground)]"
        >
          <p className="font-mono text-xs leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
            {stdout || "No stdout produced yet."}
          </p>
        </div>

        <div
          aria-label="Standard error"
          className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            stderr || networkError
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-[var(--border)] bg-[var(--surface-alt)] text-[var(--muted)]"
          }`}
        >
          <p className="font-semibold text-xs uppercase tracking-[0.25em]">stderr</p>
          <p className="mt-1 font-mono text-xs leading-relaxed text-current">
            {stderr || networkError || "No errors detected."}
          </p>
        </div>
      </div>
    </div>
  );
}
