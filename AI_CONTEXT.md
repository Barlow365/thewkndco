# 🤖 AI Assistant Context - WKND_CO Project

## 📋 Project Overview

**Name:** WKND_CO
**Domain:** www.partywknd.com
**Platform:** Next.js 16 (App Router) + Supabase
**Deployment:** Vercel
**Status:** Production-ready ✅

---

## 🎯 Project Purpose

A complete SaaS starter with:
- User authentication (Supabase)
- Subscription tiers (Free, Premium, Enterprise)
- Paywall system for content
- 14-day trial for new users
- Payment integration ready (Stripe - Phase 2)

---

## 🏗️ Architecture

### Tech Stack:
- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, lucide-react icons
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Deployment:** Vercel
- **DNS:** GoDaddy

### Key Features:
1. ✅ User authentication (signup, login, logout)
2. ✅ Profile management with subscription tiers
3. ✅ Content management system
4. ✅ Paywall components (ContentLock, PaywallBanner, etc.)
5. ✅ Trial system (14 days premium access)
6. ✅ Pricing page with 3 tiers
7. ✅ Dashboard with subscription info
8. ✅ Server actions for data fetching
9. ✅ Row Level Security (RLS) in database

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── actions/
│   │   └── profile.ts          # Server actions for profiles
│   ├── auth/
│   │   └── callback/route.ts   # Auth callback handler
│   ├── content/
│   │   ├── page.tsx            # Content listing
│   │   └── [slug]/page.tsx     # Individual article
│   ├── dashboard/page.tsx      # User dashboard
│   ├── login/page.tsx          # Login page
│   ├── pricing/page.tsx        # Pricing tiers
│   ├── signup/page.tsx         # Registration
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── auth/                   # Auth components
│   └── paywall/                # Paywall components
│       ├── ContentLock.tsx     # Protects content
│       ├── PaywallBanner.tsx   # Upgrade CTA
│       ├── TrialBanner.tsx     # Trial countdown
│       └── UpgradeCard.tsx     # Pricing cards
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   └── middleware.ts       # Session management
│   ├── types/
│   │   └── subscription.ts     # TypeScript types
│   └── subscription/
│       └── utils.ts            # Access control logic
├── migrations/
│   └── 001_user_roles_and_content.sql  # Database schema
├── scripts/
│   ├── setup-database.ts       # Auto setup script
│   └── seed-content.ts         # Content seeder
└── middleware.ts               # Route protection
```

---

## 🗄️ Database Schema

### Tables:

**profiles**
- id (uuid, references auth.users)
- email (text)
- subscription_tier (free | premium | enterprise)
- subscription_status (active | canceled | trialing | past_due)
- stripe_customer_id (text, nullable)
- stripe_subscription_id (text, nullable)
- trial_ends_at (timestamp)
- created_at, updated_at

**content**
- id (uuid)
- title (text)
- slug (text, unique)
- description (text)
- content (text)
- required_tier (free | premium | enterprise)
- is_published (boolean)
- created_at, updated_at

### Key Functions:
- `handle_new_user()` - Auto-creates profile on signup
- `can_access_content()` - Check user access rights

---

## 🔐 Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://vfkgheowfxnwzzeifpsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_T6z9q0yQE5HGCAux6ShktQ_T5s3Qf4A
SUPABASE_SERVICE_ROLE_KEY=[Get from Supabase Dashboard]
```

In Vercel, add all three to Environment Variables section.

---

## 🚀 Deployment

### Commands:
```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run setup        # Setup database + seed
npm run seed         # Seed content only
vercel               # Deploy to Vercel preview
vercel --prod        # Deploy to production
```

### Deployment Flow:
1. Push to GitHub
2. Vercel auto-deploys
3. Environment variables in Vercel dashboard
4. Custom domain: www.partywknd.com

---

## 🎨 UI Design System

### Colors:
- Primary: Blue (500/400) - Trust, CTAs
- Secondary: Purple (500/400) - Premium feel
- Accent: Pink (400) - Energy
- Success: Green (400/500) - Confirmation
- Warning: Orange (400/500) - Urgency
- Danger: Red (400/500) - Critical

### Components:
- All use Tailwind CSS
- Icons from lucide-react
- Gradient backgrounds
- Hover animations (scale, translate, shadow)
- Smooth transitions (duration-200, ease-in-out)

---

## 🔄 User Flow

1. **New User:**
   - Signs up → Profile created (trigger)
   - Gets 14-day trial (premium access)
   - Trial banner shows countdown
   - Can access all premium content during trial

2. **Trial Ends:**
   - Drops to free tier
   - Paywall appears on premium content
   - Shown upgrade prompts

3. **Upgrade:**
   - Click upgrade → Pricing page
   - (Future: Stripe checkout)
   - Tier updated in database
   - Access granted immediately

---

## 🛠️ Common Tasks

### Add New Content:
1. Insert into `content` table via Supabase
2. Set `required_tier` and `is_published`
3. Content automatically appears on /content

### Change User Tier (Manual):
```sql
-- In Supabase SQL Editor
UPDATE profiles
SET subscription_tier = 'premium',
    subscription_status = 'active'
WHERE email = 'user@example.com';
```

### Protect New Page:
```tsx
import { ContentLock } from '@/components/paywall/ContentLock'
import { getCurrentUserProfile } from '@/app/actions/profile'

export default async function MyPage() {
  const userProfile = await getCurrentUserProfile()

  return (
    <ContentLock
      userProfile={userProfile}
      requiredTier="premium"
      contentTitle="My Protected Page"
    >
      {/* Protected content here */}
    </ContentLock>
  )
}
```

---

## 🐛 Troubleshooting

### "Internal Server Error"
**Cause:** Database tables don't exist or env vars missing
**Fix:** Run `npm run setup` or check environment variables

### "Can't create account"
**Cause:** Supabase auth not configured
**Fix:** Supabase → Authentication → URL Configuration
- Site URL: https://www.partywknd.com
- Redirect URLs: https://www.partywknd.com/auth/callback

### "Styles not loading"
**Cause:** Build cache issue
**Fix:** `npm run build` then hard refresh (Ctrl+Shift+R)

### "TypeScript errors"
**Cause:** Types not in sync
**Fix:** `npm install` then restart TypeScript server in VSCode

---

## 📝 Code Conventions

### File Naming:
- Components: PascalCase (MyComponent.tsx)
- Utilities: camelCase (myUtil.ts)
- Pages: lowercase (page.tsx)
- Server Actions: 'use server' directive at top

### TypeScript:
- Strict mode enabled
- No 'any' types
- Proper error handling
- Return types defined

### Components:
- Server components by default
- 'use client' only when needed
- Props interfaces defined
- Error boundaries on pages

---

## 🔮 Next Steps (Future Development)

### Phase 2 - Payments:
- [ ] Integrate Stripe
- [ ] Checkout flow
- [ ] Webhook handlers
- [ ] Invoice management

### Phase 3 - Features:
- [ ] Email notifications
- [ ] User profile editing
- [ ] Admin panel
- [ ] Analytics dashboard

### Phase 4 - Growth:
- [ ] SEO optimization
- [ ] Blog/marketing site
- [ ] Referral system
- [ ] API for third-party integrations

---

## 🤝 AI Assistant Instructions

**When continuing work on this project:**

1. **Always check:**
   - Is database set up? (`npm run setup`)
   - Are env vars configured?
   - Is TypeScript happy? (`npx tsc --noEmit`)

2. **Before deploying:**
   - Run `npm run build`
   - Check for errors
   - Test critical flows

3. **When adding features:**
   - Follow existing patterns
   - Use TypeScript strictly
   - Add to this context doc

4. **When debugging:**
   - Check Vercel logs
   - Check Supabase logs
   - Check browser console

5. **File locations:**
   - Migration: `migrations/001_user_roles_and_content.sql`
   - Types: `lib/types/subscription.ts`
   - Utils: `lib/subscription/utils.ts`
   - Actions: `app/actions/profile.ts`
   - Components: `components/paywall/*.tsx`

---

## 📚 Documentation Files

- `README.md` - Project overview
- `DATABASE_SETUP.md` - Database setup guide
- `DEPLOYMENT_GUIDE.md` - Complete deployment walkthrough
- `QUICK_DEPLOY.md` - 15-minute quick start
- `CHANGES_REPORT.md` - Technical documentation
- `PAYWALL_GUIDE.md` - Paywall system guide
- `AI_CONTEXT.md` - This file (for AI assistants)

---

## 🎯 Current Status

✅ **Completed:**
- User authentication system
- Profile management
- Subscription tiers
- Paywall components
- Content management
- Trial system
- Pricing page
- Dashboard
- Database schema
- Deployment ready

🚧 **In Progress:**
- DNS propagation (waiting)
- Live deployment verification

📋 **Next:**
- Stripe integration
- Email notifications
- Admin panel

---

## 💡 Tips for AI Assistants

1. **This project uses:**
   - Next.js 16 App Router (not Pages Router)
   - Server Components by default
   - Supabase SSR (not client-only)
   - TypeScript strict mode

2. **Don't suggest:**
   - Using Pages Router patterns
   - Client-side only auth
   - Local storage for sensitive data
   - Non-TypeScript code

3. **Do suggest:**
   - Server Actions for mutations
   - RLS policies for security
   - Proper error handling
   - Type-safe database queries

4. **When stuck:**
   - Check the guides in root directory
   - Look at existing similar components
   - Verify environment variables
   - Check Supabase dashboard

---

**Last Updated:** November 26, 2025
**Version:** 1.0.0
**Status:** Production Ready ✅
