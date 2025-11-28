import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile, getPublishedContent } from '@/app/actions/profile'
import { canAccessContent, getTierDisplayName, getTierBadgeClasses } from '@/lib/subscription/utils'

export default async function ContentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile if logged in
  const userProfile = user ? await getCurrentUserProfile() : null

  // Get all published content
  const content = await getPublishedContent()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">
              WKND_CO
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span className="text-white/60">|</span>
                  <span className="text-sm text-white/60">{user.email}</span>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-md bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-white/90 transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Content library
            </h1>
            <p className="text-lg text-white/60">
              Browse our collection of articles and resources.
              {!user && ' Sign in to unlock premium content.'}
            </p>
          </div>

          {/* Filter Info */}
          {userProfile && (
            <div className="border border-white/10 rounded-lg p-4 bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80">
                    Viewing as:{' '}
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getTierBadgeClasses(userProfile.subscription_tier)}`}>
                      {getTierDisplayName(userProfile.subscription_tier)}
                    </span>
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Upgrade plan →
                </Link>
              </div>
            </div>
          )}

          {/* Content List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-white/60">No content available yet.</p>
                <Link
                  href="/"
                  className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  Back to home
                </Link>
              </div>
            ) : (
              content.map((item) => {
                const hasAccess = userProfile
                  ? canAccessContent(userProfile, item.required_tier)
                  : item.required_tier === 'free'

                return (
                  <Link
                    key={item.id}
                    href={`/content/${item.slug}`}
                    className="group border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-colors relative"
                  >
                    {/* Tier Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getTierBadgeClasses(item.required_tier)}`}>
                        {getTierDisplayName(item.required_tier)}
                      </span>
                    </div>

                    {/* Lock Icon */}
                    {!hasAccess && (
                      <div className="absolute top-4 left-4 text-2xl">
                        🔒
                      </div>
                    )}

                    <div className={hasAccess ? 'pt-0' : 'pt-6'}>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-3">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between text-xs text-white/40">
                        <span>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        {hasAccess ? (
                          <span className="text-blue-400">Read →</span>
                        ) : (
                          <span className="text-orange-400">
                            Upgrade to unlock
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>

          {/* CTA for non-users */}
          {!user && (
            <div className="text-center max-w-2xl mx-auto border border-blue-500/20 rounded-lg p-8 bg-blue-500/5">
              <h2 className="text-2xl font-bold mb-4">
                Unlock all content
              </h2>
              <p className="text-white/60 mb-6">
                Sign up for a free account and get 14 days of premium access.
              </p>
              <Link
                href="/signup"
                className="inline-block rounded-md bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-sm font-semibold transition-colors"
              >
                Start your free trial
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
