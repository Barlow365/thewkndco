// app/layout.tsx
import type { Metadata } from "next";
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: "WKND_CO — Supabase SaaS Starter",
  description:
    "Production-ready authentication, paywall system, and content platform built with Next.js, Supabase, and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {/* Simple top nav */}
        <header className="border-b border-slate-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-semibold">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs text-slate-50">
                WK
              </span>
              <span>WKND_CO</span>
            </div>

            <nav className="flex items-center gap-4">
              <a
                href="/login"
                className="text-xs font-medium text-slate-700 hover:text-slate-900"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-50 hover:bg-slate-800"
              >
                Sign up
              </a>
            </nav>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
