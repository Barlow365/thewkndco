'use client'

/**
 * ContentLock Component
 *
 * Wraps protected content and shows paywall if user doesn't have access
 * Displays content if user has sufficient tier
 */

import { ReactNode } from 'react'
import { UserProfile, SubscriptionTier } from '@/lib/types/subscription'
import { canAccessContent, getTierDisplayName } from '@/lib/subscription/utils'
import { PaywallBanner } from './PaywallBanner'

interface ContentLockProps {
  children: ReactNode
  userProfile: UserProfile | null
  requiredTier: SubscriptionTier
  contentTitle?: string
  contentPreview?: string
  showPreview?: boolean
}

export function ContentLock({
  children,
  userProfile,
  requiredTier,
  contentTitle,
  contentPreview,
  showPreview = true,
}: ContentLockProps) {
  // If no user profile, show login prompt
  if (!userProfile) {
    return (
      <div className="space-y-6">
        {showPreview && contentPreview && (
          <div className="relative">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80">{contentPreview}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
          </div>
        )}

        <div className="border border-blue-500/20 rounded-lg p-6 bg-blue-500/5">
          <div className="text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Sign in to continue</h3>
            <p className="text-white/60 mb-4">
              Create a free account to access this content.
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="/login"
                className="rounded-md bg-white/10 hover:bg-white/20 px-6 py-2 text-sm font-semibold transition-colors"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="rounded-md bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-semibold transition-colors"
              >
                Sign up free
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if user has access
  const hasAccess = canAccessContent(userProfile, requiredTier)

  // User has access - show content
  if (hasAccess) {
    return <>{children}</>
  }

  // User doesn't have access - show paywall
  return (
    <div className="space-y-6">
      {showPreview && contentPreview && (
        <div className="relative">
          <div className="prose prose-invert max-w-none">
            <p className="text-white/80">{contentPreview}</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
        </div>
      )}

      <PaywallBanner
        userProfile={userProfile}
        requiredTier={requiredTier}
        contentTitle={contentTitle}
      />

      {showPreview && (
        <div className="relative rounded-lg overflow-hidden border border-white/10">
          <div className="absolute inset-0 backdrop-blur-md bg-black/80 flex items-center justify-center z-10">
            <div className="text-center space-y-2">
              <div className="text-5xl mb-2">🔒</div>
              <p className="text-lg font-semibold">
                {getTierDisplayName(requiredTier)} Content
              </p>
              <p className="text-sm text-white/60">
                Upgrade to unlock this content
              </p>
            </div>
          </div>
          <div className="p-8 blur-sm select-none pointer-events-none">
            <div className="space-y-4">
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-5/6" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
