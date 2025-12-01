'use client'

import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import type { SubscriptionTier } from '@/lib/types/subscription'

interface ContentFilterProps {
  onSearchChange: (search: string) => void
  onTierFilter: (tier: SubscriptionTier | 'all') => void
  currentTier: SubscriptionTier | 'all'
}

export function ContentFilter({ onSearchChange, onTierFilter, currentTier }: ContentFilterProps) {
  const [search, setSearch] = useState('')

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onSearchChange(value)
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border border-white/10 rounded-lg p-4 bg-white/5">
      {/* Search */}
      <div className="relative flex-1 w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500/50 transition-colors"
        />
      </div>

      {/* Filter by Tier */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-white/60" />
        <div className="flex gap-2">
          <button
            onClick={() => onTierFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentTier === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => onTierFilter('free')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentTier === 'free'
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Free
          </button>
          <button
            onClick={() => onTierFilter('premium')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentTier === 'premium'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Premium
          </button>
          <button
            onClick={() => onTierFilter('enterprise')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              currentTier === 'enterprise'
                ? 'bg-orange-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Enterprise
          </button>
        </div>
      </div>
    </div>
  )
}
