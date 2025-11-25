"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user, router])

  if (!user) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-black text-white">
      <div className="max-w-2xl w-full rounded-2xl border border-white/5 bg-zinc-900/80 p-6">
        <h1 className="text-xl font-semibold">Welcome, {user.email}</h1>
        <p className="mt-2 text-sm text-white/60">This is your dashboard — a protected route.</p>
      </div>
    </div>
  )
}
