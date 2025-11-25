"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message)
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-zinc-900/80 p-6">
        <h2 className="text-xl font-semibold mb-2">Log in to WKND_CO</h2>
        <p className="text-xs text-white/60 mb-4">Use your email + password to sign in.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-md px-3 py-2 bg-transparent border border-white/10" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-md px-3 py-2 bg-transparent border border-white/10" />
          {error && <div className="text-xs text-rose-400">{error}</div>}
          <button type="submit" className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white w-full">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}
