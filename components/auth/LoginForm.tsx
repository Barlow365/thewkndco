'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-md px-3 py-2 bg-transparent border border-white/10 focus:border-white/30 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md px-3 py-2 bg-transparent border border-white/10 focus:border-white/30 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
