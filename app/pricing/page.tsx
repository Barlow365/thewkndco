import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUserProfile } from '@/app/actions/profile'
import { UpgradeCard } from '@/components/paywall/UpgradeCard'
import { SubscriptionTier } from '@/lib/types/subscription'

export default async function PricingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user profile if logged in
  const userProfile = user ? await getCurrentUserProfile() : null
  const currentTier: SubscriptionTier = userProfile?.subscription_tier || 'free'

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
        <div className="space-y-12">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Choose your plan
            </h1>
            <p className="text-lg text-white/60">
              Get access to premium content and features. Start with a 14-day free trial.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <UpgradeCard currentTier={currentTier} targetTier="free" />
            <UpgradeCard currentTier={currentTier} targetTier="premium" />
            <UpgradeCard currentTier={currentTier} targetTier="enterprise" />
          </div>

          {/* Feature Comparison Table */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Feature comparison
            </h2>
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left p-4 text-sm font-semibold">Feature</th>
                    <th className="text-center p-4 text-sm font-semibold">Free</th>
                    <th className="text-center p-4 text-sm font-semibold">Premium</th>
                    <th className="text-center p-4 text-sm font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-sm text-white/80">Access to free content</td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-sm text-white/80">14-day premium trial</td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-sm text-white/80">Community support</td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-sm text-white/80">Access to premium content</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-sm text-white/80">Priority email support</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-sm text-white/80">Advanced features</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-sm text-white/80">Export capabilities</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-sm text-white/80">Access to enterprise content</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4 text-sm text-white/80">Dedicated support</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 bg-white/5">
                    <td className="p-4 text-sm text-white/80">Custom integrations</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                  <tr className="bg-white/5">
                    <td className="p-4 text-sm text-white/80">SLA guarantees</td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-white/20 text-xl">–</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="text-green-400 text-xl">✓</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-6">
              <div className="border border-white/10 rounded-lg p-6 bg-white/5">
                <h3 className="font-semibold mb-2">
                  How does the 14-day trial work?
                </h3>
                <p className="text-sm text-white/60">
                  When you sign up, you automatically get a 14-day trial with premium access.
                  No credit card required. After the trial, you'll be on the free plan unless
                  you upgrade.
                </p>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-white/5">
                <h3 className="font-semibold mb-2">
                  Can I change plans later?
                </h3>
                <p className="text-sm text-white/60">
                  Yes! You can upgrade or downgrade your plan at any time from your dashboard.
                  Changes take effect immediately.
                </p>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-white/5">
                <h3 className="font-semibold mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-sm text-white/60">
                  We accept all major credit cards through Stripe. Payment integration coming
                  soon!
                </p>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-white/5">
                <h3 className="font-semibold mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-sm text-white/60">
                  Absolutely. Cancel anytime from your dashboard. You'll retain access until
                  the end of your billing period.
                </p>
              </div>

              <div className="border border-white/10 rounded-lg p-6 bg-white/5">
                <h3 className="font-semibold mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-sm text-white/60">
                  We offer a 30-day money-back guarantee. If you're not satisfied, contact
                  support for a full refund.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center max-w-2xl mx-auto border border-blue-500/20 rounded-lg p-8 bg-blue-500/5">
            <h2 className="text-2xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-white/60 mb-6">
              Join thousands of users who trust WKND_CO for their content needs.
            </p>
            {!user && (
              <Link
                href="/signup"
                className="inline-block rounded-md bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-sm font-semibold transition-colors"
              >
                Start your free trial
              </Link>
            )}
            {user && (
              <Link
                href="/dashboard"
                className="inline-block rounded-md bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-sm font-semibold transition-colors"
              >
                Go to dashboard
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
