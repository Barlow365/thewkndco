import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">
            Authentication Error
          </h1>
          <p className="text-white/60 mb-6">
            There was an error confirming your email. The link may have expired or been used already.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="rounded-md bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Back to login
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-white/10 hover:bg-white/20 px-6 py-3 text-sm font-semibold transition-colors"
            >
              Sign up again
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
