'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Content, UserProfile, SubscriptionTier } from '@/lib/types/subscription'
import { canAccessContent, getTierDisplayName, getTierBadgeClasses } from '@/lib/subscription/utils'
import { ContentFilter } from './ContentFilter'

interface ContentListProps {
  content: Content[]
  userProfile: UserProfile | null
}

export function ContentList({ content, userProfile }: ContentListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<SubscriptionTier | 'all'>('all')

  // Filter and search content
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Tier filter
      const matchesTier = tierFilter === 'all' || item.required_tier === tierFilter

      return matchesSearch && matchesTier
    })
  }, [content, searchQuery, tierFilter])

  return (
    <div className="space-y-6">
      {/* Filter Component */}
      <ContentFilter
        onSearchChange={setSearchQuery}
        onTierFilter={setTierFilter}
        currentTier={tierFilter}
      />

      {/* Results Count */}
      <div className="text-sm text-white/60">
        Showing {filteredContent.length} of {content.length} articles
        {searchQuery && ` matching "${searchQuery}"`}
        {tierFilter !== 'all' && ` in ${getTierDisplayName(tierFilter)} tier`}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.length === 0 ? (
          <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-lg">
            <p className="text-white/60">
              {searchQuery || tierFilter !== 'all'
                ? 'No articles match your search criteria.'
                : 'No content available yet.'}
            </p>
            {(searchQuery || tierFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setTierFilter('all')
                }}
                className="inline-block mt-4 text-sm text-blue-400 hover:text-blue-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredContent.map((item) => {
            const hasAccess = userProfile
              ? canAccessContent(userProfile, item.required_tier)
              : item.required_tier === 'free'

            return (
              <Link
                key={item.id}
                href={`/content/${item.slug}`}
                className="group border border-white/10 rounded-lg p-6 bg-white/5 hover:bg-white/10 transition-all duration-200 relative hover:scale-[1.02]"
              >
                {/* Tier Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getTierBadgeClasses(
                      item.required_tier
                    )}`}
                  >
                    {getTierDisplayName(item.required_tier)}
                  </span>
                </div>

                {/* Lock Icon */}
                {!hasAccess && (
                  <div className="absolute top-4 left-4 text-2xl">🔒</div>
                )}

                <div className={hasAccess ? 'pt-0' : 'pt-6'}>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors pr-16">
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
                      <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                        Read →
                      </span>
                    ) : (
                      <span className="text-orange-400">Upgrade to unlock</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
