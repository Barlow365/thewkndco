// app/layout.tsx
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Online Python Compiler",
  description: "Browser-based Python editor with a sandboxed execution backend.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const STORAGE_KEY = "wknd-theme";
                const stored = localStorage.getItem(STORAGE_KEY);
                const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                const theme = stored || systemPreference;
                document.documentElement.classList.toggle("theme-dark", theme === "dark");
                document.documentElement.classList.toggle("theme-light", theme === "light");
                document.documentElement.dataset.theme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors">
        <header className="border-b border-[var(--border)] bg-[var(--surface-veil)] backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-[var(--foreground)]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">
                PY
              </span>
              <span>Online Python Compiler</span>
            </div>

            <nav className="flex items-center gap-3">
              <ThemeToggle />
              <span className="text-xs font-medium text-[var(--muted)]">sandboxed execution</span>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
