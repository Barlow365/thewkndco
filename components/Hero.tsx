import React from 'react'

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Glow background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-20 md:flex-row md:items-center md:px-6 md:pb-24 md:pt-24">
        {/* Left: copy */}
        <div className="flex-1 space-y-6">
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/60">
            Weekend company · private beta
          </p>

          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your <span className="text-brand-400">whole weekend</span>,
            handled by one concierge app.
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            WKND_CO connects trips, tables, transport, and trusted hosts in one
            place. No group chats, no guesswork — just a clean plan from
            touchdown to takeoff.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a href="/signup" className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-black shadow-lg hover:bg-zinc-100">Build my next trip</a>
            <a href="/tailwind-demo" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white">Preview concierge flow</a>
            <p className="text-xs text-white/50">No public launch yet. Invite-only for now.</p>
          </div>
        </div>

        {/* Right: placeholder “screens” */}
        <div className="flex-1">
          <div className="mx-auto grid max-w-md gap-4">
            {/* Main app card */}
            <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-4 shadow-xl shadow-black/60">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-2 w-16 rounded-full bg-white/10" />
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                  <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                </div>
              </div>

              {/* Fake itinerary list as placeholder */}
              <div className="space-y-3 text-xs">
                <div className="rounded-2xl bg-gradient-to-r from-brand-500/80 to-brand-700/80 p-3 text-white">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">Trip · Miami</p>
                  <p className="mt-1 text-sm font-semibold">3 days • 6 guests • 12 stops</p>
                  <p className="mt-1 text-[11px] text-white/80">Flights, villa, dinners, nightlife — locked in and synced to everyone’s phone.</p>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 rounded-2xl bg-zinc-900/90 p-3">
                    <p className="text-[10px] font-medium uppercase text-white/50">Tonight</p>
                    <p className="mt-1 text-[13px] font-semibold text-white">Dinner + rooftop lineup</p>
                    <ul className="mt-2 space-y-1 text-[11px] text-white/65">
                      <li>7:30p · Table confirmed</li>
                      <li>9:45p · SUV pickup</li>
                      <li>11:00p · Hosted entry</li>
                    </ul>
                  </div>
                  <div className="flex-1 rounded-2xl bg-zinc-900/90 p-3">
                    <p className="text-[10px] font-medium uppercase text-white/50">Concierge</p>
                    <p className="mt-1 text-[13px] font-semibold text-white">“Make it a birthday run.”</p>
                    <p className="mt-2 text-[11px] text-emerald-400">AI drafted, human-approved. Status: building plan.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Two small placeholder image cards */}
            <div className="grid grid-cols-2 gap-3 text-[10px] text-white/70">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-3">
                <p className="font-medium text-white">City preview</p>
                <p className="mt-1 text-[10px] text-white/60">This block will become a real photo later.</p>
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-3">
                <p className="font-medium text-white">Villa layout</p>
                <p className="mt-1 text-[10px] text-white/60">Another placeholder for the final WKND visuals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
