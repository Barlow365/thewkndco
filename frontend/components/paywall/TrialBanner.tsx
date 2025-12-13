'use client'

/**
 * TrialBanner Component
 *
 * Shows trial expiration countdown
 * Displays urgent messaging when trial is ending soon
 */

import Link from 'next/link'
import {
  getTrialDaysRemaining,
  getTrialHoursRemaining,
  isTrialEndingSoon,
  isTrialActive,
} from '@/lib/subscription/utils'
import { Clock, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react'

interface TrialBannerProps {
  trialEndsAt: string | null
  className?: string
}

export function TrialBanner({ trialEndsAt, className = '' }: TrialBannerProps) {
  // Don't show if no trial or trial expired
  if (!trialEndsAt || !isTrialActive(trialEndsAt)) {
    return null
  }

  const daysRemaining = getTrialDaysRemaining(trialEndsAt)
  const hoursRemaining = getTrialHoursRemaining(trialEndsAt)
  const isEndingSoon = isTrialEndingSoon(trialEndsAt)

  // Less than 24 hours remaining - show hours
  if (hoursRemaining < 24) {
    return (
      <div
        className={`group relative overflow-hidden border border-red-500/40 rounded-xl p-6 bg-gradient-to-br from-red-500/15 via-red-500/10 to-transparent shadow-lg shadow-red-500/20 animate-pulse ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-red-400">
                Trial ending very soon!
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 text-xs font-bold">
                URGENT
              </span>
            </div>
            <p className="text-sm text-white/90 mb-4 leading-relaxed">
              Your premium trial expires in{' '}
              <span className="font-bold text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                {hoursRemaining} hour{hoursRemaining !== 1 ? 's' : ''}
              </span>
              . Upgrade now to keep access to all premium features.
            </p>
            <Link
              href="/pricing"
              className="group/btn inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 text-sm font-bold transition-all hover:shadow-lg hover:shadow-red-500/40 hover:-translate-y-0.5"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 animate-pulse" />
        </div>
      </div>
    )
  }

  // Ending soon (< 3 days)
  if (isEndingSoon) {
    return (
      <div
        className={`relative overflow-hidden border border-orange-500/40 rounded-xl p-6 bg-gradient-to-br from-orange-500/15 via-orange-500/10 to-transparent shadow-lg ${className}`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-full bg-orange-500/20 border border-orange-500/30">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-orange-400 mb-2">
              Trial ending soon
            </h3>
            <p className="text-sm text-white/90 mb-4 leading-relaxed">
              Your premium trial expires in{' '}
              <span className="font-bold text-orange-300 bg-orange-500/20 px-2 py-0.5 rounded">
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </span>
              . Upgrade to continue enjoying premium features.
            </p>
            <Link
              href="/pricing"
              className="group/btn inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold transition-all hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              View Pricing
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Regular trial status
  return (
    <div
      className={`relative overflow-hidden border border-blue-500/30 rounded-xl p-6 bg-gradient-to-br from-blue-500/15 via-blue-500/10 to-transparent shadow-md ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="p-3 rounded-full bg-blue-500/20 border border-blue-500/30">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold text-blue-400">
              Premium trial active
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              {daysRemaining} days left
            </span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">
            You're exploring all premium features! Enjoying it?{' '}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
            >
              View pricing
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
      {/* Subtle shine effect */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </div>
  )
}
