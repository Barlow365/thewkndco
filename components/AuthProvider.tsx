// Read as we saw: top
"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

import type { User as SupabaseUser } from '@supabase/supabase-js'
type User = SupabaseUser | null

type AuthResult = { data?: unknown; error?: { message?: string } | null }

type AuthContextType = {
  user: User
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    if (!supabase) return

    // Fetch initial session
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const res = await supabase.auth.signInWithPassword({ email, password })
    // normalize to { data?, error? }
    return { data: res.data ?? undefined, error: res.error ?? null }
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } }
    const res = await supabase.auth.signUp({ email, password })
    return { data: res.data ?? undefined, error: res.error ?? null }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
