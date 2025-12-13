# ⚡ EXACT STEPS - Copy & Paste Ready

## 🗄️ DATABASE SQL (Copy This Entire Block)

**Go to:** https://supabase.com/dashboard/project/vfkgheowfxnwzzeifpsw/editor

**Click:** New Query

**Paste this entire SQL:**

```sql
-- Copy from here ↓

-- =====================================================
-- WKND_CO User Roles & Paywall System
-- =====================================================

-- 1. CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'trialing' CHECK (subscription_status IN ('active', 'canceled', 'trialing', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);

-- 2. CREATE CONTENT TABLE
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  required_tier TEXT NOT NULL DEFAULT 'free' CHECK (required_tier IN ('free', 'premium', 'enterprise')),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_slug_idx ON public.content(slug);
CREATE INDEX IF NOT EXISTS content_required_tier_idx ON public.content(required_tier);
CREATE INDEX IF NOT EXISTS content_is_published_idx ON public.content(is_published);

-- 3. CREATE TRIGGER FOR AUTO-CREATING PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, subscription_status, trial_ends_at)
  VALUES (NEW.id, NEW.email, 'free', 'trialing', NOW() + INTERVAL '14 days');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. CREATE UPDATED_AT TRIGGERS
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_content_updated_at ON public.content;
CREATE TRIGGER set_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- 6. CREATE RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do everything on profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND subscription_tier = (SELECT subscription_tier FROM public.profiles WHERE id = auth.uid())
    AND subscription_status = (SELECT subscription_status FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Service role can do everything on profiles"
  ON public.profiles FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- 7. CREATE RLS POLICIES FOR CONTENT
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON public.content;
DROP POLICY IF EXISTS "Service role can manage all content" ON public.content;

CREATE POLICY "Published content is viewable by everyone"
  ON public.content FOR SELECT
  USING (is_published = true);

CREATE POLICY "Service role can manage all content"
  ON public.content FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- 8. GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.content TO authenticated;
GRANT SELECT ON public.content TO anon;

-- ↑ Copy to here
```

**Click:** RUN or press Ctrl+Enter

**Expected:** "Success. No rows returned"

---

## 🌐 EXACT DNS CHANGES IN GODADDY

**Go to:** https://dcc.godaddy.com/manage/PARTYWKND.COM/dns

### Change #1: A Record

**Find:** A record with @ → Parked
**Click:** Edit (pencil icon)
**Change to:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds
```
**Click:** Save

### Change #2: CNAME Record

**Find:** CNAME with www → partywknd.com
**Click:** Edit
**Change to:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 1 Hour
```
**Click:** Save

**That's it!** Only 2 changes needed.

---

## 💻 EXACT COMMANDS TO RUN

Open PowerShell in project folder and run these in order:

### 1. Setup Database
```powershell
cd Desktop\WKND_CO\3_CODEBASE\frontend
npm run setup
```

### 2. Initialize Git
```powershell
git init
git add .
git commit -m "Initial commit"
```

### 3. Create GitHub Repo
Go to: https://github.com/new
- Name: `wknd-co`
- Private
- Don't initialize
- Create

### 4. Push to GitHub
```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/wknd-co.git
git branch -M main
git push -u origin main
```

### 5. Deploy to Vercel

**Option A - Using Website:**
1. Go to: https://vercel.com/new
2. Import your repository
3. Click Deploy

**Option B - Using CLI:**
```powershell
npm install -g vercel
vercel login
vercel --prod
```

### 6. Add Environment Variables in Vercel

Go to: Your Project → Settings → Environment Variables

Add these 3:

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://vfkgheowfxnwzzeifpsw.supabase.co
```

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_T6z9q0yQE5HGCAux6ShktQ_T5s3Qf4A
```

**Variable 3:**
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Get from Supabase → Settings → API → service_role]
```

---

## ✅ VERIFICATION COMMANDS

### Check if database is set up:
```sql
-- Run in Supabase SQL Editor
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM content;
```

Expected:
- profiles: 0 (users create them when signing up)
- content: 8 (seeded articles)

### Check if DNS propagated:
```powershell
nslookup partywknd.com
nslookup www.partywknd.com
```

### Check if site is live:
```powershell
curl https://www.partywknd.com
```

Or just visit: https://www.partywknd.com in browser

---

## 🚨 TROUBLESHOOTING

### "npm run setup" fails
```powershell
# Make sure .env.local has all 3 variables:
type .env.local
```

### "git push" asks for password
Use GitHub Personal Access Token instead:
1. GitHub → Settings → Developer Settings
2. Personal Access Tokens → Generate new
3. Use token as password

### "vercel command not found"
```powershell
npm install -g vercel
```

### "DNS not propagating"
- Wait 10-30 minutes
- Check: https://dnschecker.org
- Clear browser cache

---

## 🎯 QUICK COPY-PASTE CHECKLIST

- [ ] SQL copied and run in Supabase
- [ ] Service role key added to .env.local
- [ ] `npm run setup` executed successfully
- [ ] Git initialized and code committed
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables added in Vercel
- [ ] A record updated in GoDaddy
- [ ] CNAME record updated in GoDaddy
- [ ] Site loads at www.partywknd.com
- [ ] HTTPS works
- [ ] Signup creates account
- [ ] Dashboard shows trial

**When all checked, you're LIVE!** 🎉
