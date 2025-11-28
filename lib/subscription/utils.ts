/**
 * Subscription Utilities
 *
 * Helper functions for checking subscription access, trial status, and tier comparisons
 */

import {
  SubscriptionTier,
  SubscriptionStatus,
  UserProfile,
  TIER_HIERARCHY,
  AccessCheckResult,
} from '@/lib/types/subscription'

/**
 * Check if a user's tier meets or exceeds the required tier
 *
 * @param userTier - The user's current subscription tier
 * @param requiredTier - The tier required to access content
 * @returns true if user's tier is sufficient
 *
 * @example
 * hasAccess('premium', 'free') // true
 * hasAccess('free', 'premium') // false
 * hasAccess('enterprise', 'premium') // true
 */
export function hasAccess(
  userTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return TIER_HIERARCHY[userTier] >= TIER_HIERARCHY[requiredTier]
}

/**
 * Check if a trial period is still active
 *
 * @param trialEndsAt - ISO timestamp string of when trial ends (nullable)
 * @returns true if trial is active and not expired
 *
 * @example
 * isTrialActive('2024-12-31T23:59:59Z') // true if before this date
 * isTrialActive(null) // false
 */
export function isTrialActive(trialEndsAt: string | null): boolean {
  if (!trialEndsAt) return false

  const trialEndDate = new Date(trialEndsAt)
  const now = new Date()

  return trialEndDate > now
}

/**
 * Calculate the number of days remaining in a trial period
 *
 * @param trialEndsAt - ISO timestamp string of when trial ends (nullable)
 * @returns number of days remaining (rounded down), or 0 if expired/null
 *
 * @example
 * getTrialDaysRemaining('2024-12-31T23:59:59Z')
 * // Returns days until Dec 31, 2024
 */
export function getTrialDaysRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0

  const trialEndDate = new Date(trialEndsAt)
  const now = new Date()

  const diffMs = trialEndDate.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return Math.max(0, diffDays)
}

/**
 * Calculate hours remaining in trial (useful for urgent messaging)
 *
 * @param trialEndsAt - ISO timestamp string of when trial ends (nullable)
 * @returns number of hours remaining (rounded down), or 0 if expired/null
 */
export function getTrialHoursRemaining(trialEndsAt: string | null): number {
  if (!trialEndsAt) return 0

  const trialEndDate = new Date(trialEndsAt)
  const now = new Date()

  const diffMs = trialEndDate.getTime() - now.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  return Math.max(0, diffHours)
}

/**
 * Check if a user's subscription is active (including trial)
 *
 * @param status - The user's subscription status
 * @param trialEndsAt - ISO timestamp of trial end (nullable)
 * @returns true if subscription is active or trial is active
 */
export function isSubscriptionActive(
  status: SubscriptionStatus,
  trialEndsAt: string | null
): boolean {
  if (status === 'active') return true
  if (status === 'trialing' && isTrialActive(trialEndsAt)) return true
  return false
}

/**
 * Comprehensive check if user can access content with specific tier requirement
 *
 * Takes into account:
 * - User's subscription tier
 * - Subscription status (active, canceled, etc.)
 * - Trial status and expiration
 * - Required tier for content
 *
 * @param userProfile - The user's profile with subscription info
 * @param contentRequiredTier - The tier required to access the content
 * @returns true if user can access the content
 *
 * @example
 * const profile: UserProfile = {
 *   subscription_tier: 'free',
 *   subscription_status: 'trialing',
 *   trial_ends_at: '2024-12-31T23:59:59Z',
 *   ...
 * }
 * canAccessContent(profile, 'premium') // true (trial gives premium access)
 * canAccessContent(profile, 'enterprise') // false
 */
export function canAccessContent(
  userProfile: UserProfile,
  contentRequiredTier: SubscriptionTier
): boolean {
  // Check if user's paid tier is sufficient
  if (hasAccess(userProfile.subscription_tier, contentRequiredTier)) {
    // Check if subscription is active
    if (userProfile.subscription_status === 'active') {
      return true
    }
  }

  // Check trial access - trials give premium access
  if (
    userProfile.subscription_status === 'trialing' &&
    isTrialActive(userProfile.trial_ends_at)
  ) {
    // During trial, user has premium access
    return hasAccess('premium', contentRequiredTier)
  }

  return false
}

/**
 * Get detailed access check result with reason
 *
 * @param userProfile - The user's profile
 * @param contentRequiredTier - Required tier for content
 * @returns AccessCheckResult with hasAccess and reason
 */
export function getAccessCheckResult(
  userProfile: UserProfile,
  contentRequiredTier: SubscriptionTier
): AccessCheckResult {
  // Check paid tier access
  if (hasAccess(userProfile.subscription_tier, contentRequiredTier)) {
    if (userProfile.subscription_status === 'active') {
      return { hasAccess: true }
    }

    return {
      hasAccess: false,
      reason: 'subscription_inactive',
      currentTier: userProfile.subscription_tier,
      requiredTier: contentRequiredTier,
    }
  }

  // Check trial access
  if (userProfile.subscription_status === 'trialing') {
    if (isTrialActive(userProfile.trial_ends_at)) {
      // Trial gives premium access
      if (hasAccess('premium', contentRequiredTier)) {
        return { hasAccess: true }
      }
    } else {
      return {
        hasAccess: false,
        reason: 'trial_expired',
        currentTier: userProfile.subscription_tier,
        requiredTier: contentRequiredTier,
      }
    }
  }

  return {
    hasAccess: false,
    reason: 'tier_insufficient',
    currentTier: userProfile.subscription_tier,
    requiredTier: contentRequiredTier,
  }
}

/**
 * Get user-friendly tier display name
 *
 * @param tier - Subscription tier
 * @returns Formatted tier name for display
 */
export function getTierDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: 'Free',
    premium: 'Premium',
    enterprise: 'Enterprise',
  }
  return names[tier]
}

/**
 * Get tier badge color classes for Tailwind
 *
 * @param tier - Subscription tier
 * @returns Tailwind CSS classes for tier badge
 */
export function getTierBadgeClasses(tier: SubscriptionTier): string {
  const classes: Record<SubscriptionTier, string> = {
    free: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    premium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    enterprise: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  }
  return classes[tier]
}

/**
 * Format trial end date for display
 *
 * @param trialEndsAt - ISO timestamp of trial end
 * @returns Formatted date string
 */
export function formatTrialEndDate(trialEndsAt: string | null): string {
  if (!trialEndsAt) return 'No trial'

  const date = new Date(trialEndsAt)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Check if trial is ending soon (less than 3 days)
 *
 * @param trialEndsAt - ISO timestamp of trial end
 * @returns true if trial ends in less than 3 days
 */
export function isTrialEndingSoon(trialEndsAt: string | null): boolean {
  const daysRemaining = getTrialDaysRemaining(trialEndsAt)
  return daysRemaining > 0 && daysRemaining <= 3
}

/**
 * Get next available upgrade tier
 *
 * @param currentTier - User's current tier
 * @returns Next tier to upgrade to, or null if already at max
 */
export function getNextUpgradeTier(
  currentTier: SubscriptionTier
): SubscriptionTier | null {
  if (currentTier === 'free') return 'premium'
  if (currentTier === 'premium') return 'enterprise'
  return null
}

/**
 * Calculate savings for annual billing (if implemented later)
 *
 * @param monthlyPrice - Monthly price
 * @returns Annual price with discount
 */
export function calculateAnnualPrice(monthlyPrice: number): number {
  // 20% discount for annual billing
  return Math.floor(monthlyPrice * 12 * 0.8)
}
