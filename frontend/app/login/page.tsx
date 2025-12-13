import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from '@/components/auth/LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-2xl font-bold">
            WKND_CO
          </Link>
          <h2 className="mt-6 text-3xl font-bold">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Or{' '}
            <Link href="/signup" className="font-medium hover:underline">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="border border-white/10 rounded-lg p-8 bg-white/5">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
