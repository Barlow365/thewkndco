import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { TrialBanner } from '@/components/paywall/TrialBanner'
import { getCurrentUserProfile, getAccessibleContentCount } from '@/app/actions/profile'
import {
  getTierDisplayName,
  getTierBadgeClasses,
  getTrialDaysRemaining,
  isTrialActive,
  getNextUpgradeTier,
} from '@/lib/subscription/utils'
import { TIER_INFO } from '@/lib/types/subscription'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not logged in, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Get user profile with subscription info
  const userProfile = await getCurrentUserProfile()

  if (!userProfile) {
    redirect('/login')
  }

  // Get content access stats
  const contentCounts = await getAccessibleContentCount(userProfile)
  const nextTier = getNextUpgradeTier(userProfile.subscription_tier)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold">
              WKND_CO
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="border border-white/10 rounded-lg p-8 bg-white/5">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-white/60">
              Manage your subscription and access your content.
            </p>
          </div>

          {/* Trial Banner */}
          {userProfile.subscription_status === 'trialing' && (
            <TrialBanner trialEndsAt={userProfile.trial_ends_at} />
          )}

          {/* Subscription Status Card */}
          <div className="border border-white/10 rounded-lg p-8 bg-white/5">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Your subscription</h2>
                <p className="text-sm text-white/60">
                  Current plan and billing information
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTierBadgeClasses(userProfile.subscription_tier)}`}>
                {getTierDisplayName(userProfile.subscription_tier)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Plan</span>
                  <span className="font-medium">
                    {getTierDisplayName(userProfile.subscription_tier)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Status</span>
                  <span className="font-medium capitalize">
                    {userProfile.subscription_status}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Price</span>
                  <span className="font-medium">
                    {TIER_INFO[userProfile.subscription_tier].priceLabel}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {userProfile.subscription_status === 'trialing' && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/60">Trial ends</span>
                    <span className="font-medium">
                      {getTrialDaysRemaining(userProfile.trial_ends_at)} days
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Member since</span>
                  <span className="font-medium">
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {nextTier && (
              <div className="pt-4 border-t border-white/10">
                <Link
                  href="/pricing"
                  className="inline-block rounded-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-semibold transition-colors"
                >
                  Upgrade to {getTierDisplayName(nextTier)}
                </Link>
              </div>
            )}
          </div>

          {/* Access Summary */}
          <div className="border border-white/10 rounded-lg p-8 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Content access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {contentCounts.free}
                </div>
                <div className="text-sm text-white/60">Free articles</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {contentCounts.premium}
                </div>
                <div className="text-sm text-white/60">Premium articles</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl font-bold text-orange-400 mb-1">
                  {contentCounts.enterprise}
                </div>
                <div className="text-sm text-white/60">Enterprise articles</div>
              </div>
            </div>
            <p className="text-sm text-white/60">
              {userProfile.subscription_tier === 'free' && isTrialActive(userProfile.trial_ends_at)
                ? `Your trial gives you access to ${contentCounts.free + contentCounts.premium} articles.`
                : userProfile.subscription_tier === 'free'
                ? `You have access to ${contentCounts.free} free articles. Upgrade to unlock ${contentCounts.premium + contentCounts.enterprise} more.`
                : userProfile.subscription_tier === 'premium'
                ? `You have access to ${contentCounts.free + contentCounts.premium} articles. Upgrade to Enterprise to unlock ${contentCounts.enterprise} more.`
                : `You have full access to all ${contentCounts.total} articles.`}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="border border-white/10 rounded-lg p-8 bg-white/5">
            <h2 className="text-xl font-semibold mb-4">Quick actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/content"
                className="rounded-md bg-white text-black hover:bg-white/90 px-4 py-2 text-sm font-medium transition-colors"
              >
                Browse content
              </Link>
              <Link
                href="/pricing"
                className="rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors"
              >
                View pricing
              </Link>
              <Link
                href="/"
                className="rounded-md bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
