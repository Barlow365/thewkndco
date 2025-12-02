// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-[#f6f3ff] to-white">
      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pb-20 pt-16 text-center">
        <span className="mb-4 inline-flex items-center rounded-full bg-slate-900 text-slate-50 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em]">
          Production-Ready SaaS Starter
        </span>

        <h1 className="bg-gradient-to-r from-[#7b5cff] via-[#c55bff] to-[#ff5fb3] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
          WKND_CO
        </h1>

        <p className="mt-2 text-lg font-semibold text-sky-700">
          Supabase • Next.js • TypeScript
        </p>

        <p className="mt-6 max-w-2xl text-base text-slate-700 sm:text-lg">
          A production-ready authentication and paywall system built on Next.js
          App Router and Supabase. Launch your product faster with a real user
          system, trials, and protected content already wired up.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-50 shadow-lg shadow-slate-900/30 transition hover:translate-y-0.5 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            Get Started Free
            <span className="ml-2 text-base">↗</span>
          </Link>

          <Link
            href="/content"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
          >
            Browse Content
          </Link>
        </div>

        <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          14-day premium trial • cancel anytime
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto mb-20 max-w-5xl px-4">
        <h2 className="text-center text-2xl font-semibold text-slate-900">
          Start building today
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Complete authentication, paywall system, and user management already
          wired to Supabase.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {/* Next.js App Router */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur">
            <h3 className="text-sm font-semibold text-slate-900">
              Next.js App Router
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Built with the latest Next.js 14+ App Router patterns for fast,
              modern, and SEO-friendly apps.
            </p>
          </div>

          {/* Supabase Auth */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur">
            <h3 className="text-sm font-semibold text-slate-900">
              Supabase Auth &amp; Paywall
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Secure email/password auth, protected routes, and content tiers
              (free, premium, enterprise) are ready out of the box.
            </p>
          </div>

          {/* TypeScript */}
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-900/5 backdrop-blur">
            <h3 className="text-sm font-semibold text-slate-900">
              Fully Typed with TypeScript
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Strong typing across the stack for safer refactors, better DX, and
              fewer runtime surprises.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
