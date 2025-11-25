import Head from 'next/head'
import type { NextPage } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Sections from '@/components/Sections'
import Footer from '@/components/Footer'

// (font imports removed — Tailwind handles typography)

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>WKND_CO · Weekend Company</title>
        <meta
          name="description"
          content="WKND_CO is the weekend company: one concierge app that connects trips, hosts, and nightlife into a single plan."
        />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <main>
          <Hero />
          <Sections />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Home
