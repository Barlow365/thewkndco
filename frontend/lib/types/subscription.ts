/**
 * Subscription Types
 *
 * Type definitions for user subscriptions, tiers, and content management
 */

// Subscription tier levels (ordered by access level)
export type SubscriptionTier = 'free' | 'premium' | 'enterprise'

// Subscription status
export type SubscriptionStatus = 'active' | 'canceled' | 'trialing' | 'past_due'

// User profile with subscription data
export interface UserProfile {
  id: string
  email: string
  subscription_tier: SubscriptionTier
  subscription_status: SubscriptionStatus
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

// Content item with tier requirements
export interface Content {
  id: string
  title: string
  slug: string
  description: string
  content: string
  required_tier: SubscriptionTier
  is_published: boolean
  created_at: string
  updated_at: string
}

// Tier information for display
export interface TierInfo {
  name: SubscriptionTier
  displayName: string
  price: number
  priceLabel: string
  description: string
  features: string[]
  popular?: boolean
}

// Access check result
export interface AccessCheckResult {
  hasAccess: boolean
  reason?: 'tier_insufficient' | 'trial_expired' | 'subscription_inactive'
  requiredTier?: SubscriptionTier
  currentTier?: SubscriptionTier
}

// Database insert/update types
export type ProfileInsert = Omit<UserProfile, 'created_at' | 'updated_at'>
export type ProfileUpdate = Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>

export type ContentInsert = Omit<Content, 'id' | 'created_at' | 'updated_at'>
export type ContentUpdate = Partial<Omit<Content, 'id' | 'created_at' | 'updated_at'>>

// Tier hierarchy for comparison
export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  premium: 1,
  enterprise: 2,
} as const

// Tier display information
export const TIER_INFO: Record<SubscriptionTier, TierInfo> = {
  free: {
    name: 'free',
    displayName: 'Free',
    price: 0,
    priceLabel: 'Free forever',
    description: 'Perfect for getting started',
    features: [
      'Access to free content',
      'Community support',
      'Basic features',
      '14-day premium trial',
    ],
  },
  premium: {
    name: 'premium',
    displayName: 'Premium',
    price: 29,
    priceLabel: '$29/month',
    description: 'Everything you need to succeed',
    features: [
      'All free features',
      'Access to premium content',
      'Priority email support',
      'Advanced features',
      'Remove watermarks',
      'Export capabilities',
    ],
    popular: true,
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    price: 99,
    priceLabel: '$99/month',
    description: 'For teams and organizations',
    features: [
      'All premium features',
      'Access to enterprise content',
      'Dedicated support',
      'Custom integrations',
      'Team collaboration',
      'SLA guarantees',
      'Custom branding',
    ],
  },
} as const
