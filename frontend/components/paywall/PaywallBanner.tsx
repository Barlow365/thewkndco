'use client'

/**
 * PaywallBanner Component
 *
 * Displays an upgrade CTA when user doesn't have access to content
 * Shows trial status and tier-specific messaging
 */

import Link from 'next/link'
import { UserProfile, SubscriptionTier, TIER_INFO } from '@/lib/types/subscription'
import {
  getTierDisplayName,
  isTrialActive,
  getTrialDaysRemaining,
} from '@/lib/subscription/utils'
import { Lock, AlertCircle, Check, ArrowRight } from 'lucide-react'

interface PaywallBannerProps {
  userProfile: UserProfile
  requiredTier: SubscriptionTier
  contentTitle?: string
}

export function PaywallBanner({
  userProfile,
  requiredTier,
  contentTitle,
}: PaywallBannerProps) {
  const requiredTierInfo = TIER_INFO[requiredTier]
  const currentTierName = getTierDisplayName(userProfile.subscription_tier)
  const requiredTierName = getTierDisplayName(requiredTier)
  const trialActive = isTrialActive(userProfile.trial_ends_at)
  const trialDays = getTrialDaysRemaining(userProfile.trial_ends_at)

  // Trial expired message
  if (userProfile.subscription_status === 'trialing' && !trialActive) {
    return (
      <div className="border border-orange-500/20 rounded-lg p-6 bg-orange-500/5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 text-3xl">⏰</div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-orange-400 mb-2">
              Your trial has ended
            </h3>
            <p className="text-white/60 mb-4">
              Your 14-day premium trial has expired. Upgrade to{' '}
              {requiredTierName} to continue accessing{' '}
              {contentTitle ? `"${contentTitle}"` : 'premium content'}.
            </p>
            <Link
              href="/pricing"
              className="inline-block rounded-md bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm font-semibold transition-colors"
            >
              Upgrade to {requiredTierName}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Default upgrade message
  return (
    <div className="relative overflow-hidden border border-blue-500/30 rounded-xl p-8 bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent shadow-xl">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          <div className="p-4 rounded-full bg-blue-500/20 border-2 border-blue-500/40">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold text-blue-400">
              {requiredTierName} Content
            </h3>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              LOCKED
            </span>
          </div>
          <p className="text-white/80 mb-6 text-base leading-relaxed">
            {contentTitle ? `"${contentTitle}" requires` : 'This content requires'} a{' '}
            <span className="font-semibold text-blue-300">{requiredTierName}</span>{' '}
            subscription. You're currently on the{' '}
            <span className="font-semibold text-white/60">{currentTierName}</span> plan.
          </p>

          {trialActive && requiredTier === 'premium' && (
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-sm text-yellow-200/90 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Good news! Your trial gives you premium access for{' '}
                  <span className="font-bold">
                    {trialDays} more day{trialDays !== 1 ? 's' : ''}
                  </span>
                  . This shouldn't be showing - please refresh the page.
                </span>
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-white/90 mb-3">
                Unlock with {requiredTierName}:
              </p>
              <ul className="grid gap-2">
                {requiredTierInfo.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="text-sm text-white/80 flex items-start gap-2">
                    <div className="mt-0.5">
                      <div className="rounded-full bg-green-500/20 p-0.5">
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      </div>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/pricing"
              className="group/btn inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-7 py-3.5 text-sm font-bold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Upgrade to {requiredTierName} - {requiredTierInfo.priceLabel}
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
    </div>
  )
}
