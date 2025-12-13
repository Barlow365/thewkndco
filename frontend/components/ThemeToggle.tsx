// components/ThemeToggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "wknd-theme";

const getSystemPreference = (): ThemeMode =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle("theme-dark", mode === "dark");
  root.classList.toggle("theme-light", mode === "light");
  root.dataset.theme = mode;
  localStorage.setItem(STORAGE_KEY, mode);
};

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? undefined;
    const initial = stored ?? getSystemPreference();
    setMode(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  const handleToggle = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={!mounted}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--surface-alt)] active:translate-y-px disabled:opacity-60"
    >
      {mode === "dark" ? (
        <Sun className="h-4 w-4 text-amber-500" />
      ) : (
        <Moon className="h-4 w-4 text-[var(--muted)]" />
      )}
      <span>{mode === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
