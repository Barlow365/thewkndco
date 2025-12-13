# 🚀 DEPLOYMENT GUIDE - Get Live in 30 Minutes

## 📋 Overview

This guide will get **www.partywknd.com** live with your complete paywall system.

**Platform:** Vercel (Recommended ⭐)
**Time Required:** 20-30 minutes
**Difficulty:** Easy (Step-by-step)

---

## 🎯 PART 1: DATABASE SETUP (5 minutes)

### Step 1: Get Your Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. Under "Project API keys", find **service_role** key
5. Click "Copy" (starts with `eyJ...`)
6. Add to `.env.local`:

```bash
# In .env.local, add this line:
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 2: Run the Migration

**Option A: Automatic (Recommended)**

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend
npm run setup
```

If you see "DATABASE MIGRATION REQUIRED", proceed to Option B.

**Option B: Manual (Required First Time)**

1. Open Supabase Dashboard → **SQL Editor**
2. Click **New Query**
3. Open file: `migrations/001_user_roles_and_content.sql`
4. Copy **ALL** content (Ctrl+A, Ctrl+C)
5. Paste into Supabase SQL Editor
6. Click **Run** or press Ctrl+Enter
7. Wait for "Success. No rows returned" message

### Step 3: Seed Content

After migration succeeds, run:

```bash
npm run setup
```

You should see:
```
✅ Database schema is set up
🌱 Seeding sample content...
✅ Content seeded successfully
   - Free articles: 3
   - Premium articles: 3
   - Enterprise articles: 2
🎉 DATABASE SETUP COMPLETE!
```

### Step 4: Verify Database

Quick verification in Supabase:

```sql
-- Run in SQL Editor to verify
SELECT COUNT(*) as profile_count FROM profiles;
SELECT COUNT(*) as content_count FROM content;
```

Expected:
- `profiles`: 0 (profiles are created when users sign up)
- `content`: 8

---

## 🎯 PART 2: PREPARE FOR PRODUCTION (5 minutes)

### Step 1: Test Local Build

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend

# Build for production
npm run build

# Test production build locally
npm run start
```

Visit http://localhost:3000 and verify:
- ✅ Home page loads
- ✅ Login/Signup work
- ✅ No console errors
- ✅ Styling looks good

### Step 2: Create .gitignore (if not exists)

Ensure these are in `.gitignore`:

```
node_modules/
.next/
.env.local
.env*.local
.DS_Store
*.log
```

---

## 🎯 PART 3: DEPLOY TO VERCEL (10 minutes)

### Step 1: Install Vercel CLI (Optional but Recommended)

```bash
npm install -g vercel
```

### Step 2: Deploy with Vercel

**Method A: Using Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/signup
2. Sign up/Login (use GitHub for easiest setup)
3. Click **Add New** → **Project**
4. Click **Import Git Repository**
5. If not connected to GitHub:
   - Initialize git in your project:
   ```bash
   cd Desktop/WKND_CO/3_CODEBASE/frontend
   git init
   git add .
   git commit -m "Initial commit"
   ```
   - Create GitHub repo
   - Push code:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```
6. Select your repository in Vercel
7. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (or `frontend` if your repo has multiple folders)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)

**Method B: Using Vercel CLI**

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `wknd-co` or `partywknd`
- Directory? `./`
- Override settings? **N**

### Step 3: Add Environment Variables in Vercel

1. In Vercel Dashboard, go to your project
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Variable Name | Value | Where to Find |
|--------------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon/public key | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Supabase → Settings → API |

For each variable:
- Paste **Name**
- Paste **Value**
- Select **Production**, **Preview**, **Development** (all three)
- Click **Save**

### Step 4: Redeploy with Environment Variables

After adding variables:
1. Go to **Deployments** tab
2. Click ⋯ (three dots) on latest deployment
3. Click **Redeploy**
4. Or push a new commit to auto-deploy

---

## 🎯 PART 4: CUSTOM DOMAIN SETUP (10 minutes)

### Step 1: Add Domain in Vercel

1. In Vercel project → **Settings** → **Domains**
2. Click **Add**
3. Enter: `partywknd.com`
4. Click **Add**
5. Also add: `www.partywknd.com`

Vercel will show you DNS records to add.

### Step 2: Configure DNS in GoDaddy

#### For partywknd.com (root domain):

1. Go to GoDaddy → My Products → Domains
2. Click **DNS** next to partywknd.com
3. Click **Add** under DNS Records

**Add A Record:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel's IP)
- TTL: `600 seconds`

#### For www.partywknd.com:

**Add CNAME Record:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`
- TTL: `1 Hour`

### Step 3: Verify DNS Propagation

1. In Vercel, click **Refresh** next to your domain
2. Wait for "Valid Configuration" (can take 5-60 minutes)
3. Check propagation: https://dnschecker.org

### Step 4: Set Primary Domain

In Vercel → Settings → Domains:
1. Click ⋯ next to `www.partywknd.com`
2. Select **Set as Primary Domain**

This makes www the canonical URL and redirects non-www.

---

## 🎯 PART 5: POST-DEPLOYMENT VERIFICATION (5 minutes)

### Checklist:

Visit your live site at **https://www.partywknd.com** and verify:

- [ ] **Home Page**
  - [ ] Loads without errors
  - [ ] Gradient headline displays
  - [ ] Feature cards visible
  - [ ] CTAs work

- [ ] **Authentication**
  - [ ] Sign up form works
  - [ ] Email validation
  - [ ] Creates account successfully
  - [ ] Redirects to dashboard

- [ ] **Dashboard**
  - [ ] Shows subscription tier
  - [ ] Trial banner appears (14 days)
  - [ ] Content stats display
  - [ ] No errors in console

- [ ] **Pricing Page**
  - [ ] Three tiers display
  - [ ] Feature comparison table
  - [ ] FAQ section loads
  - [ ] Mobile responsive

- [ ] **Content Pages**
  - [ ] /content lists all articles
  - [ ] Free articles accessible
  - [ ] Premium articles show lock icon
  - [ ] Paywall appears for locked content

- [ ] **Performance**
  - [ ] Page load < 3 seconds
  - [ ] Images load
  - [ ] No console errors
  - [ ] Mobile responsive

### Check Vercel Logs

If issues occur:
1. Vercel Dashboard → Your Project → **Deployments**
2. Click latest deployment
3. Click **View Function Logs**
4. Check for errors

---

## 🎯 PART 6: FINAL TOUCHES

### Add Favicon

1. Create or download a favicon.ico
2. Place in `public/favicon.ico`
3. Redeploy

### SEO Optimization

Update `app/layout.tsx` metadata:

```typescript
export const metadata: Metadata = {
  title: 'WKND_CO - Premium Content Platform',
  description: 'Access premium articles and resources with our paywall system',
  keywords: ['content', 'paywall', 'subscription', 'premium'],
  openGraph: {
    title: 'WKND_CO',
    description: 'Premium content platform',
    url: 'https://www.partywknd.com',
    siteName: 'WKND_CO',
  },
}
```

### Analytics (Optional)

Add Vercel Analytics:
1. Vercel Dashboard → Your Project → **Analytics**
2. Click **Enable**
3. Follow instructions

---

## 🔧 TROUBLESHOOTING

### Issue: "Internal Server Error"

**Cause:** Database not set up or env vars missing

**Fix:**
1. Check Vercel environment variables are set
2. Verify migration ran successfully in Supabase
3. Check Vercel function logs

### Issue: "Database connection failed"

**Cause:** Wrong Supabase credentials

**Fix:**
1. Double-check environment variables in Vercel
2. Ensure you're using Production Supabase project
3. Test credentials locally first

### Issue: "Domain not propagating"

**Cause:** DNS not updated yet

**Fix:**
1. Wait 5-60 minutes for DNS propagation
2. Check https://dnschecker.org
3. Clear browser cache
4. Try incognito/private browsing

### Issue: "Styles not loading"

**Cause:** Build cache issue

**Fix:**
1. Vercel Dashboard → Deployments
2. Click ⋯ → Redeploy
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: "Can't create account"

**Cause:** Supabase auth not configured

**Fix:**
1. Supabase → Authentication → Settings
2. Enable Email auth
3. Set Site URL to: `https://www.partywknd.com`
4. Add Redirect URLs:
   - `https://www.partywknd.com/auth/callback`
   - `https://partywknd.com/auth/callback`

---

## 📊 MONITORING & MAINTENANCE

### Check Site Health

**Daily:**
- Visit site and test key flows
- Check Vercel deployment status

**Weekly:**
- Review Vercel analytics
- Check error logs
- Test new signups

### Rollback Procedure

If deployment breaks:

1. Vercel Dashboard → **Deployments**
2. Find last working deployment
3. Click ⋯ → **Promote to Production**

### Update Process

For future updates:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel auto-deploys from main branch
```

---

## 🎉 SUCCESS CHECKLIST

You're live when all these are ✅:

- [ ] Database migration ran successfully
- [ ] Sample content seeded (8 articles)
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Custom domain (www.partywknd.com) working
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Home page loads beautifully
- [ ] Sign up creates accounts
- [ ] Trial system works (14 days)
- [ ] Paywall shows for premium content
- [ ] Pricing page displays correctly
- [ ] Dashboard shows user info
- [ ] No console errors
- [ ] Mobile responsive works

---

## 🚀 NEXT STEPS

Now that you're live:

### Phase 1 (Immediate):
- [ ] Test all user flows
- [ ] Share link with friends for feedback
- [ ] Monitor Vercel analytics

### Phase 2 (This Week):
- [ ] Integrate Stripe for payments
- [ ] Set up email notifications
- [ ] Add more content

### Phase 3 (This Month):
- [ ] Custom branding
- [ ] Advanced analytics
- [ ] Marketing automation

---

## 📞 SUPPORT RESOURCES

### Vercel Support:
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord
- Email: support@vercel.com

### Supabase Support:
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Email: support@supabase.io

### Quick Reference:

**Vercel Dashboard:** https://vercel.com/dashboard
**Supabase Dashboard:** https://supabase.com/dashboard
**Your Live Site:** https://www.partywknd.com
**Your Repo:** (Your GitHub URL)

---

## ⏱️ TIMELINE RECAP

- ✅ **Minutes 0-5:** Database setup
- ✅ **Minutes 5-10:** Local build test
- ✅ **Minutes 10-20:** Vercel deployment
- ✅ **Minutes 20-30:** Domain configuration
- ✅ **Minutes 30+:** Verification & testing

**Total Time: ~30 minutes** 🎉

---

**You're now LIVE at www.partywknd.com!** 🚀

Start attracting users, gathering feedback, and building your business!
