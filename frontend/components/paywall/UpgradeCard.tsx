'use client'

/**
 * UpgradeCard Component
 *
 * Displays pricing information and upgrade options
 * Shows feature comparison between tiers
 */

import { SubscriptionTier, TIER_INFO, TierInfo } from '@/lib/types/subscription'
import { getTierBadgeClasses } from '@/lib/subscription/utils'
import { Check, Sparkles, Zap, Building2, ArrowRight } from 'lucide-react'

interface UpgradeCardProps {
  currentTier: SubscriptionTier
  targetTier: SubscriptionTier
  onUpgrade?: () => void
}

export function UpgradeCard({
  currentTier,
  targetTier,
  onUpgrade,
}: UpgradeCardProps) {
  const targetInfo = TIER_INFO[targetTier]
  const isCurrent = currentTier === targetTier

  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade()
    } else {
      // Show coming soon message
      alert('Payment integration coming soon! For now, contact support to upgrade.')
    }
  }

  // Icon for each tier
  const TierIcon =
    targetTier === 'free' ? Sparkles :
    targetTier === 'premium' ? Zap :
    Building2

  return (
    <div
      className={`group border rounded-xl p-8 relative transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        targetInfo.popular
          ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent shadow-lg shadow-blue-500/20'
          : isCurrent
          ? 'border-green-500/50 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent'
          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
      }`}
    >
      {/* Popular Badge */}
      {targetInfo.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrent && !targetInfo.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
            <Check className="w-3 h-3" />
            Current Plan
          </span>
        </div>
      )}

      {/* Tier Icon */}
      <div className="flex justify-center mb-4">
        <div className={`p-3 rounded-full ${
          targetTier === 'free' ? 'bg-gray-500/20' :
          targetTier === 'premium' ? 'bg-blue-500/20' :
          'bg-purple-500/20'
        }`}>
          <TierIcon className={`w-8 h-8 ${
            targetTier === 'free' ? 'text-gray-400' :
            targetTier === 'premium' ? 'text-blue-400' :
            'text-purple-400'
          }`} />
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{targetInfo.displayName}</h3>
        <div className="mb-3">
          <span className="text-5xl font-extrabold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
            ${targetInfo.price}
          </span>
          {targetInfo.price > 0 && (
            <span className="text-white/50 text-base">/month</span>
          )}
        </div>
        <p className="text-sm text-white/70">{targetInfo.description}</p>
      </div>

      {/* Features List */}
      <ul className="space-y-3 mb-8">
        {targetInfo.features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start text-sm group/item"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-shrink-0 mt-0.5 mr-3">
              <div className="rounded-full bg-green-500/20 p-1">
                <Check className="w-3.5 h-3.5 text-green-400" />
              </div>
            </div>
            <span className="text-white/90 group-hover/item:text-white transition-colors">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={handleUpgradeClick}
        disabled={isCurrent}
        className={`group/btn w-full rounded-lg px-6 py-3.5 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
          isCurrent
            ? 'bg-white/10 text-white/40 cursor-not-allowed'
            : targetInfo.popular
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5'
            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30'
        }`}
      >
        {isCurrent ? (
          <>
            <Check className="w-4 h-4" />
            Current Plan
          </>
        ) : (
          <>
            {targetInfo.popular ? 'Get Started' : `Choose ${targetInfo.displayName}`}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </>
        )}
      </button>

      {/* Recommended for free tier */}
      {targetTier === 'free' && !isCurrent && (
        <p className="text-xs text-white/50 text-center mt-3">
          Perfect for trying out
        </p>
      )}

      {/* Value message for premium */}
      {targetTier === 'premium' && !isCurrent && (
        <p className="text-xs text-blue-400/80 text-center mt-3">
          Best value for most users
        </p>
      )}

      {/* Enterprise message */}
      {targetTier === 'enterprise' && !isCurrent && (
        <p className="text-xs text-purple-400/80 text-center mt-3">
          Full access to everything
        </p>
      )}
    </div>
  )
}
