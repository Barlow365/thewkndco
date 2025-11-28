# 🔐 Paywall & User Roles System Guide

## Overview

This guide documents the complete user roles and paywall system integrated into your Next.js application. The system provides tier-based content access (Free, Premium, Enterprise) with a 14-day trial period for new users.

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYWALL SYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Database   │───▶│  Server      │───▶│   Client     │ │
│  │   (Supabase) │    │  Actions     │    │  Components  │ │
│  └──────────────┘    └──────────────┘    └──────────────┘ │
│         │                    │                    │        │
│    ┌────▼────────┐      ┌───▼────────┐      ┌───▼──────┐ │
│    │  profiles   │      │ getUserProfile │  │ PaywallBanner │
│    │  content    │      │ getContent   │    │ ContentLock  │
│    └─────────────┘      └──────────────┘    └──────────────┘
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tier Hierarchy

```
Free (0) < Premium (1) < Enterprise (2)
```

Users with higher tier numbers can access content from lower tiers.

### Trial System

- **Duration**: 14 days
- **Access Level**: Premium features during trial
- **Auto-created**: Automatically applied when user signs up
- **Post-trial**: Reverts to Free tier if no upgrade

## Database Schema

### Profiles Table

Stores user subscription information:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'trialing', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Content Table

Stores protected content:

```sql
CREATE TABLE content (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  required_tier TEXT CHECK (required_tier IN ('free', 'premium', 'enterprise')),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

### Automatic Profile Creation

A trigger automatically creates a profile when a user signs up:

```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Installation & Setup

### 1. Run Database Migration

```bash
# Copy the SQL from migrations/001_user_roles_and_content.sql
# Paste into Supabase SQL Editor
# Click "Run" to execute
```

**Verify migration:**
```sql
SELECT * FROM profiles LIMIT 1;
SELECT * FROM content LIMIT 1;
```

### 2. Seed Sample Content

```bash
npm run seed
```

This creates 8 sample articles (3 free, 3 premium, 2 enterprise).

### 3. Test the System

1. Sign up for a new account
2. Check your dashboard - should show "trialing" status
3. Browse `/content` - should see locked premium/enterprise articles
4. Trial gives you premium access - verify you can read premium content
5. Manually change tier in Supabase to test different access levels

## File Structure

```
frontend/
├── migrations/
│   └── 001_user_roles_and_content.sql    # Database schema
│
├── lib/
│   ├── types/
│   │   └── subscription.ts                # TypeScript types
│   └── subscription/
│       └── utils.ts                       # Helper functions
│
├── app/
│   ├── actions/
│   │   └── profile.ts                     # Server actions
│   ├── dashboard/
│   │   └── page.tsx                       # Enhanced dashboard
│   ├── pricing/
│   │   └── page.tsx                       # Pricing page
│   ├── content/
│   │   ├── page.tsx                       # Content listing
│   │   └── [slug]/
│   │       └── page.tsx                   # Dynamic content with paywall
│   └── ...
│
├── components/
│   └── paywall/
│       ├── PaywallBanner.tsx              # Upgrade CTA
│       ├── UpgradeCard.tsx                # Pricing card
│       ├── TrialBanner.tsx                # Trial countdown
│       └── ContentLock.tsx                # Content wrapper
│
└── scripts/
    └── seed-content.ts                    # Content seeding script
```

## Usage Guide

### Checking User Access

**Server-side (recommended):**

```typescript
import { getCurrentUserProfile } from '@/app/actions/profile'
import { canAccessContent } from '@/lib/subscription/utils'

export default async function MyPage() {
  const profile = await getCurrentUserProfile()

  if (!profile) {
    redirect('/login')
  }

  const hasAccess = canAccessContent(profile, 'premium')

  if (!hasAccess) {
    return <PaywallBanner userProfile={profile} requiredTier="premium" />
  }

  return <div>Premium content here</div>
}
```

**Client-side:**

```typescript
'use client'

import { useUser } from '@/lib/auth/context'
import { canAccessContent } from '@/lib/subscription/utils'

export function MyComponent({ userProfile }) {
  const hasAccess = canAccessContent(userProfile, 'premium')

  if (!hasAccess) {
    return <div>Upgrade to unlock</div>
  }

  return <div>Content</div>
}
```

### Protecting Content

**Wrap entire component:**

```typescript
import { ContentLock } from '@/components/paywall/ContentLock'

export default async function ArticlePage() {
  const profile = await getCurrentUserProfile()
  const content = await getContentBySlug('article-slug')

  return (
    <ContentLock
      userProfile={profile}
      requiredTier={content.required_tier}
      contentTitle={content.title}
      contentPreview={content.description}
    >
      <article>{content.content}</article>
    </ContentLock>
  )
}
```

**Manual check:**

```typescript
export default async function FeaturePage() {
  const profile = await getCurrentUserProfile()

  if (!canAccessContent(profile, 'enterprise')) {
    return (
      <PaywallBanner
        userProfile={profile}
        requiredTier="enterprise"
        contentTitle="Advanced Features"
      />
    )
  }

  return <AdvancedFeatures />
}
```

### Creating New Content

**Via Supabase Dashboard:**

1. Go to Supabase > Table Editor > content
2. Click "Insert row"
3. Fill in:
   - title: "My New Article"
   - slug: "my-new-article"
   - description: "Short description"
   - content: "Full article content"
   - required_tier: 'premium'
   - is_published: true

**Via SQL:**

```sql
INSERT INTO content (title, slug, description, content, required_tier, is_published)
VALUES (
  'My New Article',
  'my-new-article',
  'Short description',
  'Full article content here...',
  'premium',
  true
);
```

**Programmatically:**

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

await supabase.from('content').insert({
  title: 'My New Article',
  slug: 'my-new-article',
  description: 'Short description',
  content: 'Full content...',
  required_tier: 'premium',
  is_published: true,
})
```

### Adding New Tiers

To add a new tier (e.g., "pro"):

1. **Update database enum:**

```sql
ALTER TABLE profiles
  DROP CONSTRAINT profiles_subscription_tier_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'pro', 'premium', 'enterprise'));

ALTER TABLE content
  DROP CONSTRAINT content_required_tier_check;

ALTER TABLE content
  ADD CONSTRAINT content_required_tier_check
  CHECK (required_tier IN ('free', 'pro', 'premium', 'enterprise'));
```

2. **Update TypeScript types:**

```typescript
// lib/types/subscription.ts
export type SubscriptionTier = 'free' | 'pro' | 'premium' | 'enterprise'

export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  premium: 2,
  enterprise: 3,
}

export const TIER_INFO: Record<SubscriptionTier, TierInfo> = {
  // ... add pro tier info
}
```

3. **Update components** that hardcode tier references

### Manually Upgrading a User

**Via Supabase Dashboard:**

1. Go to profiles table
2. Find user by email
3. Update `subscription_tier` to 'premium'
4. Update `subscription_status` to 'active'
5. Changes reflect immediately

**Via Server Action:**

```typescript
import { upgradeToTier } from '@/app/actions/profile'

await upgradeToTier(userId, 'premium')
```

## Utility Functions Reference

### hasAccess()

Check if user tier meets requirement:

```typescript
hasAccess('premium', 'free') // true
hasAccess('free', 'premium') // false
```

### canAccessContent()

Comprehensive access check including trial:

```typescript
const profile = await getCurrentUserProfile()
const hasAccess = canAccessContent(profile, 'premium')
```

### isTrialActive()

Check if trial is still valid:

```typescript
if (isTrialActive(profile.trial_ends_at)) {
  // Show trial messaging
}
```

### getTrialDaysRemaining()

Get days left in trial:

```typescript
const days = getTrialDaysRemaining(profile.trial_ends_at)
// Returns: 7 (for 7 days remaining)
```

### getTierDisplayName()

Get formatted tier name:

```typescript
getTierDisplayName('premium') // "Premium"
```

### getTierBadgeClasses()

Get Tailwind classes for tier badge:

```typescript
const classes = getTierBadgeClasses('premium')
// "bg-blue-500/10 text-blue-400 border-blue-500/20"
```

## Component Reference

### PaywallBanner

Displays upgrade CTA when user lacks access:

```typescript
<PaywallBanner
  userProfile={userProfile}
  requiredTier="premium"
  contentTitle="Advanced Features"
/>
```

**Props:**
- `userProfile`: UserProfile object
- `requiredTier`: Tier required
- `contentTitle?`: Optional content name

### ContentLock

Wraps content and shows paywall if no access:

```typescript
<ContentLock
  userProfile={userProfile}
  requiredTier="premium"
  contentTitle="My Article"
  contentPreview="First paragraph..."
  showPreview={true}
>
  <article>Protected content</article>
</ContentLock>
```

**Props:**
- `children`: Content to protect
- `userProfile`: UserProfile | null
- `requiredTier`: Tier required
- `contentTitle?`: Optional title
- `contentPreview?`: Preview text
- `showPreview?`: Show blurred preview (default: true)

### TrialBanner

Shows trial countdown and status:

```typescript
<TrialBanner trialEndsAt={profile.trial_ends_at} />
```

**Props:**
- `trialEndsAt`: ISO timestamp or null
- `className?`: Optional CSS classes

### UpgradeCard

Displays pricing information:

```typescript
<UpgradeCard
  currentTier="free"
  targetTier="premium"
  onUpgrade={() => handleUpgrade()}
/>
```

**Props:**
- `currentTier`: User's current tier
- `targetTier`: Tier to display
- `onUpgrade?`: Optional callback (default shows "coming soon")

## Testing Checklist

### Database Setup

- [ ] Migration runs without errors
- [ ] Profiles table exists with correct schema
- [ ] Content table exists with correct schema
- [ ] Trigger creates profile on user signup
- [ ] RLS policies are enabled and working

### User Registration

- [ ] New user signup creates profile automatically
- [ ] Profile defaults to 'free' tier and 'trialing' status
- [ ] trial_ends_at is set to 14 days from now
- [ ] User can log in successfully

### Trial Period

- [ ] Trial users can access premium content
- [ ] Trial users cannot access enterprise content
- [ ] Trial banner shows correct days remaining
- [ ] Trial banner shows urgent message < 3 days
- [ ] After trial expires, user reverts to free tier

### Content Access

- [ ] Free users can access free content
- [ ] Free users see paywall on premium content
- [ ] Premium users can access free + premium content
- [ ] Enterprise users can access all content
- [ ] Paywall banner shows correct tier requirement

### Dashboard

- [ ] Dashboard shows subscription status
- [ ] Dashboard shows trial countdown if on trial
- [ ] Dashboard shows content access summary
- [ ] Upgrade button links to pricing page

### Pricing Page

- [ ] Shows all three tiers
- [ ] Current tier is highlighted
- [ ] Feature comparison table displays correctly
- [ ] FAQ section is readable
- [ ] CTA buttons work (show "coming soon" for now)

### Content Pages

- [ ] /content lists all published articles
- [ ] Locked content shows lock icon
- [ ] Tier badges display correctly
- [ ] Clicking article navigates to detail page
- [ ] Detail page shows paywall for insufficient tier
- [ ] Detail page shows content for sufficient tier

### Manual Tier Changes

- [ ] Changing tier in Supabase reflects immediately
- [ ] Changing status to 'canceled' restricts access
- [ ] Changing status to 'active' restores access

## Troubleshooting

### Issue: Profile not created on signup

**Cause**: Trigger didn't fire or RLS preventing insert

**Solution**:
```sql
-- Check trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Manually create profile
INSERT INTO profiles (id, email, subscription_tier, subscription_status, trial_ends_at)
VALUES (
  'user-uuid-here',
  'user@example.com',
  'free',
  'trialing',
  NOW() + INTERVAL '14 days'
);
```

### Issue: Content not showing

**Cause**: RLS policies or is_published = false

**Solution**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'content';

-- Ensure content is published
UPDATE content SET is_published = true WHERE slug = 'article-slug';
```

### Issue: User can't access content they should have access to

**Cause**: Subscription status is not 'active' or 'trialing'

**Solution**:
```sql
-- Check user profile
SELECT * FROM profiles WHERE email = 'user@example.com';

-- Fix status
UPDATE profiles
SET subscription_status = 'active'
WHERE email = 'user@example.com';
```

### Issue: Trial shows as expired but shouldn't be

**Cause**: trial_ends_at is in the past or null

**Solution**:
```sql
-- Extend trial
UPDATE profiles
SET trial_ends_at = NOW() + INTERVAL '14 days'
WHERE email = 'user@example.com';
```

## Integration with Stripe (Future Phase 2)

The system is architected for easy Stripe integration:

### Webhook Handlers Needed

```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(req: Request) {
  const event = await stripe.webhooks.constructEvent(...)

  switch (event.type) {
    case 'checkout.session.completed':
      // Create/update subscription
      await upgradeToTier(userId, 'premium')
      break

    case 'customer.subscription.updated':
      // Update subscription status
      await updateUserProfile(userId, { subscription_status: 'active' })
      break

    case 'customer.subscription.deleted':
      // Cancel subscription
      await cancelSubscription(userId)
      break
  }
}
```

### Integration Points

1. Replace "Coming Soon" buttons with Stripe Checkout links
2. Add webhook route to handle payment events
3. Store stripe_customer_id and stripe_subscription_id
4. Add subscription management UI in dashboard
5. Implement cancellation flow

### Environment Variables for Stripe

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Security Best Practices

### ✅ DO

- Always check access server-side before returning protected content
- Validate user tier in API routes and server actions
- Use RLS policies as an additional security layer
- Log tier changes and access attempts for auditing
- Rate limit tier upgrade attempts

### ❌ DON'T

- Don't rely solely on client-side access checks
- Don't expose admin upgrade functions to client
- Don't allow users to directly modify subscription fields
- Don't skip server-side validation
- Don't hardcode tier requirements in multiple places

## Performance Optimization

### Caching Strategies

```typescript
// Cache user profile for request duration
import { cache } from 'react'

export const getCachedUserProfile = cache(async () => {
  return await getCurrentUserProfile()
})
```

### Database Indexes

Already created in migration:
- `profiles.email` - Fast lookup by email
- `profiles.stripe_customer_id` - Stripe webhook lookups
- `content.slug` - Fast content retrieval
- `content.required_tier` - Filter by tier
- `content.is_published` - Published content queries

## Monitoring & Analytics

### Key Metrics to Track

- Trial conversion rate (trial → paid)
- Content access patterns by tier
- Popular content by tier
- Paywall encounter rate
- Upgrade click-through rate
- Trial expiration reminders opened

### Logging Events

```typescript
// Log important events
await logEvent({
  type: 'paywall_shown',
  userId: user.id,
  contentSlug: 'article-slug',
  userTier: profile.subscription_tier,
  requiredTier: 'premium',
})
```

## Maintenance

### Regular Tasks

- Monitor trial expirations
- Clean up canceled subscriptions
- Review content access patterns
- Update pricing and features
- Test paywall on new content

### Database Maintenance

```sql
-- Find expired trials
SELECT * FROM profiles
WHERE subscription_status = 'trialing'
AND trial_ends_at < NOW();

-- Update expired trials to free
UPDATE profiles
SET subscription_status = 'canceled',
    subscription_tier = 'free'
WHERE subscription_status = 'trialing'
AND trial_ends_at < NOW();
```

## Support & Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Stripe Integration Guide](https://stripe.com/docs/billing/subscriptions/build-subscriptions)

---

**Built with ❤️ for WKND_CO**

This paywall system provides a solid foundation for monetizing your content. Ready for Stripe integration when you are!
