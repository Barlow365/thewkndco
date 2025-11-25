import React from 'react'

type HeroProps = {
  title?: string
  subtitle?: string
  ctaLabel?: string
}

export default function Hero({
  title = 'Welcome to WKND_CO',
  subtitle = 'A tiny demo showing Tailwind + Next.js integration',
  ctaLabel = 'Get started',
}: HeroProps) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-slate-600 dark:text-slate-300">
          {subtitle}
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <a
            className="inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition"
            href="#"
          >
            {ctaLabel}
          </a>
          <a
            className="inline-block rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition dark:border-slate-700 dark:text-slate-200"
            href="#"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  )
}
