"use client";

import { ChangeEvent, useState } from "react";

export const DEFAULT_SNIPPET = `print("Hello, world!")`;

type EditorProps = {
  value?: string;
  onCodeChange?: (nextValue: string) => void;
};

export function Editor({ value, onCodeChange }: EditorProps) {
  const [internalCode, setInternalCode] = useState(DEFAULT_SNIPPET);
  const displayedCode = value ?? internalCode;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    if (value === undefined) {
      setInternalCode(nextValue);
    }
    onCodeChange?.(nextValue);
  };

  return (
    <textarea
      aria-label="Python code editor"
      value={displayedCode}
      onChange={handleChange}
      rows={14}
      className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 font-mono text-sm text-[var(--foreground)] shadow-inner focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
    />
  );
}
