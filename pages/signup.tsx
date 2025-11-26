"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function SignupPage() {
  const { signUp, user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    const { data, error } = await signUp(email, password)
    setSubmitting(false)
    if (error) setMessage(error.message ?? 'Sign up failed')
    else setMessage('Sign up successful — check your email for confirmation')
    if (data) router.push('/')
  }

  useEffect(() => {
    if (!loading && user) router.push('/dashboard')
  }, [user, loading, router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-black text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-zinc-900/80 p-6">
        <h2 className="text-xl font-semibold mb-2">Create an account</h2>
        <p className="text-xs text-white/60 mb-4">Sign up with email + password — you will be redirected after confirmation.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full rounded-md px-3 py-2 bg-transparent border border-white/10" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full rounded-md px-3 py-2 bg-transparent border border-white/10" />
          {message && <div className="text-xs text-rose-400">{message}</div>}
          <button type="submit" className="rounded-full bg-brand-500 px-5 py-2 text-xs font-semibold text-white w-full">{submitting ? 'Creating...' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}
