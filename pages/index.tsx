import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>The WKND Co</title>
      </Head>

      <main className="min-h-screen bg-brand-50 text-gray-900">
        <div className="mx-auto max-w-5xl px-6 py-12">
          {/* Top bar */}
          <header className="flex items-center justify-between">
            <div className="text-xl font-semibold tracking-tight">
              <span className="rounded-lg bg-brand-500 px-3 py-1 text-white">WKND</span>
              <span className="ml-2">Co.</span>
            </div>

            <nav className="space-x-6 text-sm font-medium">
              <a href="#how-it-works" className="hover:text-brand-500">How it works</a>
              <a href="#founders" className="hover:text-brand-500">For founders</a>
              <a href="#contact" className="hover:text-brand-500">Contact</a>
            </nav>
          </header>

          {/* Hero */}
          <section className="mt-16 grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Weekend experiences,
                <span className="block text-brand-700">built like a tech company.</span>
              </h1>
              <p className="mt-6 text-base text-gray-700">
                The WKND Co connects high-energy hosts, curated guests, and concierge-style support so every weekend feels like a well-produced experience — not last-minute chaos.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button className="rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700">Start a WKND project</button>
                <button className="rounded-full border border-brand-500 px-6 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100">View example weekends</button>
              </div>
            </div>

            {/* Placeholder “card” for now */}
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">Next up</p>
              <h2 className="mt-2 text-lg font-semibold">Content & Conversation • Dec 2</h2>
              <p className="mt-3 text-sm text-gray-600">Panel + mixer + creator lab. Built end-to-end using the WKND Co playbook: guests, sponsors, media, and follow-up funnel.</p>

              <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-brand-50 p-3">
                  <p className="font-semibold text-brand-700">Guests</p>
                  <p className="mt-1 text-gray-600">Curated 60–120</p>
                </div>
                <div className="rounded-2xl bg-brand-50 p-3">
                  <p className="font-semibold text-brand-700">Revenue</p>
                  <p className="mt-1 text-gray-600">Tickets + partners</p>
                </div>
                <div className="rounded-2xl bg-brand-50 p-3">
                  <p className="font-semibold text-brand-700">Assets</p>
                  <p className="mt-1 text-gray-600">Photo + clips + leads</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
