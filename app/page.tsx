import Link from 'next/link'
import { AuthButton } from '@/components/auth/AuthButton'
import { Zap, Shield, Code2, Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-black/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              WKND_CO
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            Production-Ready SaaS Starter
          </div>

          {/* Headline */}
          <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
              Welcome to
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              WKND_CO
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            A production-ready Next.js authentication system with{' '}
            <span className="text-blue-400 font-semibold">Supabase</span>,{' '}
            <span className="text-purple-400 font-semibold">TypeScript</span>, and a powerful{' '}
            <span className="text-pink-400 font-semibold">paywall system</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-base font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/content"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/20 px-8 py-4 text-base font-semibold transition-all border border-white/20 hover:border-white/30"
            >
              Browse Content
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative border border-white/10 rounded-xl p-8 bg-gradient-to-br from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute -top-4 left-8">
              <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 mt-6">Next.js App Router</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Built with Next.js 14+ App Router for optimal performance and modern React patterns. Server and client components working together seamlessly.
            </p>
          </div>

          <div className="group relative border border-white/10 rounded-xl p-8 bg-gradient-to-br from-purple-500/10 to-transparent hover:from-purple-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute -top-4 left-8">
              <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 mt-6">Supabase Auth</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Secure authentication with Supabase using modern SSR patterns, cookie-based sessions, and Row Level Security for data protection.
            </p>
          </div>

          <div className="group relative border border-white/10 rounded-xl p-8 bg-gradient-to-br from-pink-500/10 to-transparent hover:from-pink-500/20 transition-all duration-300 hover:scale-105">
            <div className="absolute -top-4 left-8">
              <div className="p-3 rounded-lg bg-pink-500/20 border border-pink-500/30">
                <Code2 className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 mt-6">TypeScript</h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Fully typed with TypeScript for better developer experience, code reliability, and catch errors before they reach production.
            </p>
          </div>
        </div>

        {/* Social Proof / CTA Section */}
        <div className="mt-24 text-center max-w-3xl mx-auto">
          <div className="border border-blue-500/20 rounded-2xl p-10 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent">
            <h2 className="text-3xl font-bold mb-4">
              Start Building Today
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Complete authentication, paywall system, and user management. Everything you need to launch your SaaS.
            </p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-base font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Get 14 Days Free Premium
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
