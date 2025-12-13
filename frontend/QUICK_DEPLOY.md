# ⚡ QUICK DEPLOY - 15 Minutes to Live!

## 🗄️ STEP 1: DATABASE (2 minutes)

### 1.1 Get Service Role Key

**Direct Link:** https://supabase.com/dashboard/project/vfkgheowfxnwzzeifpsw/settings/api

1. Click that link ↑
2. Scroll to "Project API keys"
3. Find **service_role** key
4. Click **Reveal** then **Copy**

### 1.2 Add to .env.local

```bash
# Open: Desktop/WKND_CO/3_CODEBASE/frontend/.env.local
# Add this line:
SUPABASE_SERVICE_ROLE_KEY=paste_your_key_here
```

### 1.3 Run Migration

**Direct Link:** https://supabase.com/dashboard/project/vfkgheowfxnwzzeifpsw/editor

1. Click that link ↑
2. Click **New Query**
3. Open file: `Desktop/WKND_CO/3_CODEBASE/frontend/migrations/001_user_roles_and_content.sql`
4. Copy ALL content (Ctrl+A, Ctrl+C)
5. Paste in Supabase SQL Editor (Ctrl+V)
6. Click **RUN** or press Ctrl+Enter
7. Wait for "Success. No rows returned"

### 1.4 Seed Content

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend
npm run setup
```

Expected output:
```
✅ Database schema is set up
🌱 Seeding sample content...
✅ Content seeded successfully
```

---

## 🐙 STEP 2: GITHUB SETUP (3 minutes)

### 2.1 Initialize Git

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - WKND_CO deployment"
```

### 2.2 Create GitHub Repository

**Direct Link:** https://github.com/new

1. Repository name: `wknd-co` or `partywknd`
2. Visibility: **Private** (or Public if you want)
3. **DO NOT** initialize with README
4. Click **Create repository**

### 2.3 Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/wknd-co.git
git branch -M main
git push -u origin main
```

If prompted for credentials, use GitHub personal access token (not password).

---

## 🚀 STEP 3: VERCEL DEPLOYMENT (5 minutes)

### 3.1 Sign Up / Login to Vercel

**Direct Link:** https://vercel.com/signup

- Use **GitHub** login (easiest)
- Authorize Vercel to access your repos

### 3.2 Import Project

1. Click **Add New...** → **Project**
2. Find your repository (wknd-co)
3. Click **Import**

### 3.3 Configure Project

**Framework Preset:** Next.js ✅ (auto-detected)
**Root Directory:** `./`
**Build Command:** `npm run build` (auto-filled)
**Output Directory:** `.next` (auto-filled)

Click **Deploy** (don't add env vars yet)

⚠️ **First deployment will fail** - that's expected! We need to add environment variables.

### 3.4 Add Environment Variables

After deployment (successful or failed):

1. Go to project **Settings** → **Environment Variables**
2. Add these 3 variables:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://vfkgheowfxnwzzeifpsw.supabase.co
Environment: Production, Preview, Development (check all)
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_T6z9q0yQE5HGCAux6ShktQ_T5s3Qf4A
Environment: Production, Preview, Development (check all)
```

**Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Your service role key from Step 1.1]
Environment: Production, Preview, Development (check all)
```

Click **Save** after each one.

### 3.5 Redeploy

1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait ~60 seconds

You should see "Deployment successful!" 🎉

Your site is now live at: `your-project.vercel.app`

---

## 🌐 STEP 4: CUSTOM DOMAIN (5 minutes)

### 4.1 Add Domain in Vercel

1. Go to project **Settings** → **Domains**
2. Click **Add**
3. Enter: `partywknd.com`
4. Click **Add**

### 4.2 Add www Subdomain

1. Still in Domains section
2. Click **Add** again
3. Enter: `www.partywknd.com`
4. Click **Add**

Vercel will show you DNS configuration needed.

### 4.3 Configure GoDaddy DNS

**Direct Link:** https://dcc.godaddy.com/manage/PARTYWKND.COM/dns

#### Update A Record:

1. Find existing A record (@ → Parked)
2. Click **Edit** (pencil icon)
3. Change:
   - **Type:** A
   - **Name:** @
   - **Value:** `76.76.21.21` ← Vercel's IP
   - **TTL:** 600 seconds
4. Click **Save**

#### Update/Add CNAME Record:

1. Find existing CNAME (www → partywknd.com)
2. Click **Edit**
3. Change to:
   - **Type:** CNAME
   - **Name:** www
   - **Value:** `cname.vercel-dns.com` ← Important!
   - **TTL:** 1 Hour
4. Click **Save**

### 4.4 Verify Domain in Vercel

1. Back in Vercel → Settings → Domains
2. Click **Refresh** next to partywknd.com
3. Wait for "Valid Configuration" ✅
4. This can take 5-60 minutes (usually 5-10)

### 4.5 Set Primary Domain

1. Click **⋯** next to `www.partywknd.com`
2. Select **Set as Primary Domain**
3. This makes www canonical and redirects non-www

---

## ✅ STEP 5: VERIFICATION (2 minutes)

### Check Your Live Site

Visit: **https://www.partywknd.com**

Verify:
- [ ] Site loads (might take 5-10 min for DNS)
- [ ] HTTPS works (padlock icon)
- [ ] Home page displays correctly
- [ ] Click "Sign Up"
- [ ] Create an account
- [ ] Redirects to dashboard
- [ ] Trial banner shows "14 days"
- [ ] Visit /content
- [ ] See 8 articles
- [ ] Premium articles show lock icon
- [ ] Visit /pricing
- [ ] Three tiers display

### Check Deployment Logs

If issues:
1. Vercel → Your Project → **Deployments**
2. Click latest deployment
3. Click **View Function Logs**
4. Check for errors

---

## 🔧 TROUBLESHOOTING

### "Domain not propagating"

**Wait time:** 5-60 minutes
**Check:** https://dnschecker.org (enter partywknd.com)
**Fix:** Clear browser cache, try incognito

### "Internal Server Error"

**Cause:** Environment variables missing
**Fix:**
1. Verify all 3 env vars in Vercel
2. Redeploy

### "Can't create account"

**Cause:** Supabase auth not configured
**Fix:**
1. Supabase → Authentication → URL Configuration
2. Site URL: `https://www.partywknd.com`
3. Redirect URLs: Add `https://www.partywknd.com/auth/callback`

---

## 🎉 SUCCESS!

When everything works:
- ✅ https://www.partywknd.com is live
- ✅ HTTPS enabled
- ✅ Sign up creates accounts
- ✅ 14-day trial works
- ✅ Paywall shows on premium content
- ✅ Database connected

**Your site is LIVE! 🚀**

---

## ⏱️ TIMELINE

- **Minute 0-2:** Database setup ✅
- **Minute 2-5:** GitHub setup ✅
- **Minute 5-10:** Vercel deployment ✅
- **Minute 10-15:** Domain configuration ✅
- **Minute 15+:** DNS propagation (automatic)

**Total active time: ~15 minutes**
**Total wait time: ~5-60 min (DNS)**

You're done! 🎊
