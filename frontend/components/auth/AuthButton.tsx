'use client'

import Link from 'next/link'
import { useUser } from '@/lib/auth/context'
import { LogoutButton } from './LogoutButton'

export function AuthButton() {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="text-sm text-white/40">
        Loading...
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-white/60">{user.email}</span>
        <LogoutButton />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-md px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/signup"
        className="rounded-md bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors"
      >
        Sign up
      </Link>
    </div>
  )
}
