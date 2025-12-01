# 🏗️ SUPABASE MIGRATION INSTRUCTIONS

## 📋 **TABLE OF CONTENTS**

1. [Which Script Should I Run?](#which-script-should-i-run)
2. [Production Deployment Steps](#production-deployment-steps)
3. [Development/Reset Steps](#developmentreset-steps)
4. [Verification Steps](#verification-steps)
5. [Troubleshooting](#troubleshooting)
6. [Schema Reference](#schema-reference)

---

## **🎯 WHICH SCRIPT SHOULD I RUN?**

### **Use `001_PRODUCTION_SAFE.sql` if:**
- ✅ This is your FIRST time setting up the database
- ✅ You have EXISTING DATA you want to keep
- ✅ You're deploying to PRODUCTION
- ✅ You want to UPDATE functions/policies without losing data
- ✅ You want an IDEMPOTENT migration (safe to run multiple times)

### **Use `001_DEV_RESET.sql` if:**
- ⚠️ You want to COMPLETELY RESET your database
- ⚠️ You're in DEVELOPMENT/TESTING only
- ⚠️ You want to DELETE ALL EXISTING DATA
- ⚠️ You're debugging schema issues
- ❌ NEVER use this in production!

---

## **🚀 PRODUCTION DEPLOYMENT STEPS**

### **Prerequisites:**
- [ ] You have access to Supabase Dashboard
- [ ] You have the `service_role` key
- [ ] You've backed up any existing data (if applicable)

### **Step 1: Open Supabase SQL Editor**

1. Go to: https://supabase.com/dashboard/project/vfkgheowfxnwzzeifpsw/sql/new
2. You should see an empty SQL editor

### **Step 2: Load the Production Script**

**Option A - Copy from file:**
1. Open: `migrations/001_PRODUCTION_SAFE.sql`
2. Select ALL (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste into Supabase SQL Editor (Ctrl+V)

**Option B - Already in clipboard:**
1. Just paste into Supabase SQL Editor (Ctrl+V)

### **Step 3: Review the Script (IMPORTANT!)**

Before running, scroll through and verify:

- ✅ Line 10-20: Creates `profiles` table
- ✅ Line 30-40: Creates `content` table
- ✅ Line 50-72: Sets up auto-profile creation trigger
- ✅ Line 78-98: Sets up timestamp triggers
- ✅ Line 104-105: Enables RLS
- ✅ Line 112-140: Creates profile policies
- ✅ Line 147-161: Creates content policies
- ✅ Line 168-217: Creates helper functions
- ✅ Line 224-233: Grants permissions

**Look for these safe patterns:**
- `CREATE TABLE IF NOT EXISTS` ✅
- `CREATE INDEX IF NOT EXISTS` ✅
- `CREATE OR REPLACE FUNCTION` ✅
- `DROP TRIGGER IF EXISTS` ✅ (immediately recreated)
- `DROP POLICY IF EXISTS` ✅ (immediately recreated)

**What you should NOT see:**
- `DROP TABLE` ❌
- `TRUNCATE` ❌
- `DELETE FROM` ❌

### **Step 4: Execute the Migration**

1. Click **RUN** button (bottom right)
   - Or press: **Ctrl + Enter** (Windows/Linux)
   - Or press: **Cmd + Enter** (Mac)

2. Wait for execution (usually 1-3 seconds)

### **Step 5: Verify Success**

You should see:
```
Success. No rows returned
```

This is CORRECT! The migration creates structure, not data.

### **Step 6: Verify Tables Created**

Run this verification query in a NEW SQL Editor tab:

```sql
-- Check tables exist
SELECT tablename, schemaname
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected output:**
```
tablename | schemaname
----------|----------
content   | public
profiles  | public
```

### **Step 7: Verify RLS Enabled**

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

**Expected output:**
```
tablename | rowsecurity
----------|------------
content   | true
profiles  | true
```

### **Step 8: Verify Policies Exist**

```sql
-- Check policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

**Expected output (5 policies):**
```
Users can view their own profile
Users can update their own profile
Service role can do everything on profiles
Published content is viewable by everyone
Service role can manage all content
```

### **Step 9: Verify Functions Exist**

```sql
-- Check functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'handle_new_user',
  'handle_updated_at',
  'get_user_tier',
  'can_access_content'
);
```

**Expected output (4 functions):**
```
handle_new_user
handle_updated_at
get_user_tier
can_access_content
```

### **Step 10: Test the Trigger**

The trigger should auto-create profiles on user signup. To test:

1. Create a test user in your app
2. Run this query:

```sql
SELECT id, email, subscription_tier, subscription_status, trial_ends_at
FROM public.profiles
WHERE email = 'your-test-email@example.com';
```

**Expected:**
- Subscription tier: `free`
- Subscription status: `trialing`
- Trial ends at: 14 days from signup

---

## **⚠️ DEVELOPMENT/RESET STEPS**

### **⚠️ WARNING: THIS WILL DELETE ALL DATA!**

Only proceed if:
- ✅ You're in a development/test environment
- ✅ You want to completely reset your database
- ✅ You have no data you need to keep
- ❌ You are NOT in production

### **Step 1: Open Supabase SQL Editor**

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new
2. **DOUBLE-CHECK** you're in the correct project!

### **Step 2: Load the Reset Script**

1. Open: `migrations/001_DEV_RESET.sql`
2. Select ALL (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste into Supabase SQL Editor (Ctrl+V)

### **Step 3: Final Confirmation**

**STOP AND READ THIS:**

This script will:
- ❌ **DELETE** all data in `profiles` table
- ❌ **DELETE** all data in `content` table
- ❌ **DROP** both tables completely
- ✅ Recreate everything from scratch

**Are you ABSOLUTELY SURE?**

### **Step 4: Execute**

1. Take a deep breath
2. Click **RUN**
3. Wait for "Success. No rows returned"

### **Step 5: Verify Reset**

```sql
-- Check tables are empty
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'content', COUNT(*) FROM public.content;
```

**Expected output:**
```
table_name | row_count
-----------|----------
profiles   | 0
content    | 0
```

### **Step 6: Seed Data**

Now that you have a clean database, seed it with test data:

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend
npm run setup
```

---

## **✅ VERIFICATION STEPS**

### **Quick Health Check**

Run this single query to check everything:

```sql
-- Comprehensive health check
SELECT
  'Tables' as check_type,
  COUNT(*) as count
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'content')

UNION ALL

SELECT
  'RLS Enabled',
  COUNT(*)
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'content')
  AND rowsecurity = true

UNION ALL

SELECT
  'Policies',
  COUNT(*)
FROM pg_policies
WHERE schemaname = 'public'

UNION ALL

SELECT
  'Functions',
  COUNT(*)
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'handle_new_user',
    'handle_updated_at',
    'get_user_tier',
    'can_access_content'
  );
```

**Expected output:**
```
check_type   | count
-------------|------
Tables       | 2
RLS Enabled  | 2
Policies     | 5
Functions    | 4
```

**If all numbers match: ✅ Migration successful!**

---

## **🐛 TROUBLESHOOTING**

### **Error: "permission denied for schema public"**

**Cause:** User doesn't have permissions

**Fix:**
```sql
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
```

---

### **Error: "relation already exists"**

**Cause:** Table already exists, but script doesn't use `IF NOT EXISTS`

**Fix:** Use `001_PRODUCTION_SAFE.sql` instead, which has proper guards

---

### **Error: "trigger already exists"**

**Cause:** You're running a script without `DROP TRIGGER IF EXISTS`

**Fix:** The production script handles this correctly. Run:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_content_updated_at ON public.content;
```

Then rerun the migration.

---

### **Error: "policy already exists"**

**Cause:** Policies from previous run still exist

**Fix:**
```sql
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON public.content;
DROP POLICY IF EXISTS "Service role can manage all content" ON public.content;
```

Then rerun the migration.

---

### **Profiles not auto-creating on signup**

**Check trigger exists:**
```sql
SELECT * FROM pg_trigger
WHERE tgname = 'on_auth_user_created';
```

**If not found, recreate:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, subscription_status, trial_ends_at)
  VALUES (NEW.id, NEW.email, 'free', 'trialing', NOW() + INTERVAL '14 days');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

---

### **RLS blocking legitimate access**

**Temporarily disable RLS for debugging:**
```sql
-- DISABLE RLS (debugging only!)
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.content DISABLE ROW LEVEL SECURITY;

-- Test your queries...

-- RE-ENABLE RLS (important!)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
```

**Check policies allow your use case:**
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## **📊 SCHEMA REFERENCE**

### **profiles Table**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, REFERENCES auth.users(id) | User ID (matches Supabase Auth) |
| email | TEXT | NOT NULL | User email |
| subscription_tier | TEXT | NOT NULL, DEFAULT 'free' | 'free', 'premium', or 'enterprise' |
| subscription_status | TEXT | NOT NULL, DEFAULT 'trialing' | 'active', 'canceled', 'trialing', 'past_due' |
| stripe_customer_id | TEXT | NULL | Stripe customer reference |
| stripe_subscription_id | TEXT | NULL | Stripe subscription reference |
| trial_ends_at | TIMESTAMPTZ | DEFAULT NOW() + 14 days | When trial expires |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

### **content Table**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique content ID |
| title | TEXT | NOT NULL | Article title |
| slug | TEXT | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | NOT NULL | Short description/excerpt |
| content | TEXT | NOT NULL | Full article content |
| required_tier | TEXT | NOT NULL, DEFAULT 'free' | Minimum tier to access |
| is_published | BOOLEAN | DEFAULT false | Published status |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | Record creation time |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | Last update time |

---

## **🎯 NEXT STEPS AFTER MIGRATION**

### **1. Seed Sample Content**

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend
npm run setup
```

This will:
- Check if migration ran
- Seed 8 sample articles
- Verify everything works

### **2. Configure Supabase Auth Settings**

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Set:
- **Site URL:** `https://www.partywknd.com`
- **Redirect URLs:**
  - `https://www.partywknd.com/auth/callback`
  - `http://localhost:3000/auth/callback` (for dev)

### **3. Test User Signup**

1. Go to your app
2. Sign up with a test email
3. Check profile was created:

```sql
SELECT * FROM public.profiles ORDER BY created_at DESC LIMIT 5;
```

### **4. Test Paywall**

1. Create articles with different tiers
2. Test access control works correctly
3. Verify trial users get premium access

---

## **📞 SUPPORT**

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all [Verification Steps](#verification-steps) pass
3. Check Supabase logs: Dashboard → Logs
4. Review this guide completely

---

## **✅ FINAL CHECKLIST**

Before considering the migration complete:

- [ ] Tables `profiles` and `content` exist
- [ ] RLS is enabled on both tables
- [ ] 5 RLS policies are active
- [ ] 4 helper functions exist
- [ ] 3 triggers are active
- [ ] Indexes are created
- [ ] Permissions are granted
- [ ] Sample data seeded
- [ ] Test user can sign up
- [ ] Profile auto-creates with 14-day trial
- [ ] Paywall blocks premium content for free users
- [ ] Trial users can access premium content

**When all checked: 🎉 Migration Complete!**

---

**Created by:** Principal Supabase Architect
**Last Updated:** 2025-11-28
**Version:** 1.0.0
