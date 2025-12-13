import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SignupForm } from '@/components/auth/SignupForm'

export default async function SignupPage() {
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Form */}
        <div className="border border-white/10 rounded-lg p-8 bg-white/5">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
