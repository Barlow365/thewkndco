'use server'

/**
 * Server Actions for Profile Management
 *
 * These actions handle user profile CRUD operations and subscription management
 * All operations are server-side and validated for security
 */

import { createClient } from '@/lib/supabase/server'
import {
  UserProfile,
  ProfileUpdate,
  SubscriptionTier,
  Content,
} from '@/lib/types/subscription'

/**
 * Get user profile by user ID
 *
 * @param userId - The user's UUID
 * @returns UserProfile or null if not found
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Unexpected error fetching user profile:', error)
    return null
  }
}

/**
 * Get current authenticated user's profile
 *
 * @returns UserProfile or null if not authenticated
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    return await getUserProfile(user.id)
  } catch (error) {
    console.error('Error getting current user profile:', error)
    return null
  }
}

/**
 * Update user profile (excluding subscription fields)
 *
 * Users can only update non-subscription fields like email
 * Subscription fields require server-side validation
 *
 * @param userId - The user's UUID
 * @param updates - Partial profile updates
 * @returns Updated UserProfile or null on error
 */
export async function updateUserProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    // Ensure user can only update their own profile
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      console.error('Unauthorized profile update attempt')
      return null
    }

    // Remove subscription fields from updates (users can't update these directly)
    const {
      subscription_tier,
      subscription_status,
      stripe_customer_id,
      stripe_subscription_id,
      trial_ends_at,
      ...safeUpdates
    } = updates

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Unexpected error updating user profile:', error)
    return null
  }
}

/**
 * Upgrade user to a new subscription tier
 *
 * For now, this directly updates the database (no Stripe integration)
 * Later, this will be called after successful Stripe payment
 *
 * @param userId - The user's UUID
 * @param tier - New subscription tier
 * @returns Updated UserProfile or null on error
 */
export async function upgradeToTier(
  userId: string,
  tier: SubscriptionTier
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    // For now, we'll allow this operation
    // Later, this should only be called after Stripe payment succeeds

    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_status: 'active',
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error upgrading user tier:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Unexpected error upgrading user tier:', error)
    return null
  }
}

/**
 * Cancel user subscription
 *
 * Sets subscription status to 'canceled'
 * User retains access until end of billing period
 *
 * @param userId - The user's UUID
 * @returns Updated UserProfile or null on error
 */
export async function cancelSubscription(
  userId: string
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled',
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error canceling subscription:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Unexpected error canceling subscription:', error)
    return null
  }
}

/**
 * Reactivate a canceled subscription
 *
 * @param userId - The user's UUID
 * @returns Updated UserProfile or null on error
 */
export async function reactivateSubscription(
  userId: string
): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error reactivating subscription:', error)
      return null
    }

    return data as UserProfile
  } catch (error) {
    console.error('Unexpected error reactivating subscription:', error)
    return null
  }
}

/**
 * Get all published content
 *
 * @returns Array of published content items
 */
export async function getPublishedContent(): Promise<Content[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching published content:', error)
      return []
    }

    return data as Content[]
  } catch (error) {
    console.error('Unexpected error fetching published content:', error)
    return []
  }
}

/**
 * Get content by slug
 *
 * @param slug - Content slug
 * @returns Content item or null if not found
 */
export async function getContentBySlug(slug: string): Promise<Content | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching content by slug:', error)
      return null
    }

    return data as Content
  } catch (error) {
    console.error('Unexpected error fetching content by slug:', error)
    return null
  }
}

/**
 * Get content filtered by tier
 *
 * @param tier - Subscription tier to filter by
 * @returns Array of content items for that tier
 */
export async function getContentByTier(
  tier: SubscriptionTier
): Promise<Content[]> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('required_tier', tier)
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching content by tier:', error)
      return []
    }

    return data as Content[]
  } catch (error) {
    console.error('Unexpected error fetching content by tier:', error)
    return []
  }
}

/**
 * Count accessible content for a user profile
 *
 * @param userProfile - User's profile with subscription info
 * @returns Object with counts by tier
 */
export async function getAccessibleContentCount(userProfile: UserProfile): Promise<{
  free: number
  premium: number
  enterprise: number
  total: number
}> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('content')
      .select('required_tier')
      .eq('is_published', true)

    if (error) {
      console.error('Error counting accessible content:', error)
      return { free: 0, premium: 0, enterprise: 0, total: 0 }
    }

    const counts = {
      free: data.filter((c) => c.required_tier === 'free').length,
      premium: data.filter((c) => c.required_tier === 'premium').length,
      enterprise: data.filter((c) => c.required_tier === 'enterprise').length,
      total: data.length,
    }

    return counts
  } catch (error) {
    console.error('Unexpected error counting accessible content:', error)
    return { free: 0, premium: 0, enterprise: 0, total: 0 }
  }
}
