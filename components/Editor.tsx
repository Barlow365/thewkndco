"use client";

import { ChangeEvent, useState } from "react";

const DEFAULT_SNIPPET = `print("Hello, world!")`;

export function Editor() {
  const [code, setCode] = useState(DEFAULT_SNIPPET);

  return (
    <textarea
      aria-label="Python code editor"
      value={code}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setCode(event.target.value)}
      rows={14}
      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-mono text-sm text-[var(--foreground)] shadow-inner focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
    />
  );
}
