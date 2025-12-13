import React from 'react'

const Sections: React.FC = () => {
  return (
    <section className="border-t border-white/10 bg-black py-12" id="trips">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Trips */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Trips</p>
            <h3 className="mt-2 text-sm font-semibold text-white">One itinerary for the whole group</h3>
            <p className="mt-2 text-xs text-white/65">Lock in flights, stays, and nights — then share one live link instead of 40 screenshots.</p>
          </div>

          {/* Concierge */}
          <div id="concierge" className="rounded-3xl border border-brand-500/40 bg-gradient-to-b from-brand-500/15 to-zinc-950 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">Concierge</p>
            <h3 className="mt-2 text-sm font-semibold text-white">AI speed, human judgment</h3>
            <p className="mt-2 text-xs text-white/70">Start with a simple prompt: city, dates, budget, vibe. WKND_CO drafts the run and a human host refines it.</p>
          </div>

          {/* Hosts */}
          <div id="hosts" className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Hosts</p>
            <h3 className="mt-2 text-sm font-semibold text-white">Tap in trusted local operators</h3>
            <p className="mt-2 text-xs text-white/65">Curated partners for villas, drivers, tables, and experiences — local operators vetted for quality.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sections
