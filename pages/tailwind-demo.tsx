import Head from 'next/head'
import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'

export default function TailwindDemo() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // toggle class on root so Tailwind `dark:` variants apply
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [dark])

  return (
    <>
      <Head>
        <title>Tailwind Demo</title>
      </Head>

      <Hero title="Tailwind demo page" subtitle="Examples of utilities and dark mode" ctaLabel="Explore" />

      <main className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between my-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Live examples</h2>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-600 dark:text-slate-300">Dark mode</label>
            <button
              onClick={() => setDark((d) => !d)}
              className="rounded-full w-12 h-6 p-1 bg-slate-200 dark:bg-slate-700 flex items-center transition"
              aria-label="Toggle dark mode"
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow transform transition ${
                  dark ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-lg border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Buttons</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Primary/secondary button styles</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition">Primary</button>
              <button className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition">Outline</button>
            </div>
          </div>

          <div className="rounded-lg border p-6 bg-gradient-to-r from-rose-50 via-white to-yellow-50 dark:from-rose-900 dark:to-yellow-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Color & gradients</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Tailwind gradients and responsive utilities</p>
            <div className="mt-4 flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow" />
              <div className="w-12 h-12 rounded-full bg-yellow-400 shadow" />
              <div className="w-12 h-12 rounded-full bg-green-400 shadow" />
            </div>
          </div>

          <div className="rounded-lg border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Typography</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Responsive headings and text utilities</p>
            <div className="mt-4">
              <h4 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Heading example</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Body copy showing contrast in light and dark modes.</p>
            </div>
          </div>

          <div className="rounded-lg border p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Layout</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Utility-driven layout: grid, gap, container sizes</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="h-12 bg-indigo-50 dark:bg-indigo-800 rounded" />
              <div className="h-12 bg-indigo-100 dark:bg-indigo-700 rounded" />
              <div className="h-12 bg-indigo-200 dark:bg-indigo-600 rounded" />
            </div>
          </div>
        </section>

        <footer className="mt-12 text-xs text-center text-slate-500 dark:text-slate-400">Small demo created for verifying Tailwind utilities</footer>
      </main>
    </>
  )
}
