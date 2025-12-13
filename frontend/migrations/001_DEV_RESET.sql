-- =====================================================
-- WKND_CO User Roles & Paywall System
-- VERSION: DEV-RESET (⚠️ DESTRUCTIVE - DELETES ALL DATA)
-- =====================================================
--
-- ⚠️⚠️⚠️ WARNING: THIS SCRIPT WILL DELETE ALL DATA ⚠️⚠️⚠️
--
-- ❌ DO NOT RUN IN PRODUCTION
-- ❌ DO NOT RUN IF YOU HAVE DATA YOU WANT TO KEEP
-- ✅ USE ONLY IN DEVELOPMENT/TESTING
-- ✅ USE WHEN YOU WANT TO START COMPLETELY FRESH
--
-- WHAT THIS SCRIPT DOES:
-- 1. Drops all existing tables (DATA LOSS!)
-- 2. Drops all functions
-- 3. Drops all policies
-- 4. Recreates everything from scratch
--
-- WHEN TO USE:
-- - Setting up a fresh development database
-- - Resetting your test environment
-- - Debugging schema issues
-- - NEVER IN PRODUCTION
--
-- =====================================================

-- =====================================================
-- STEP 1: DROP EVERYTHING (⚠️ DESTRUCTIVE)
-- =====================================================

-- Drop existing policies first (required before dropping tables)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do everything on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON public.content;
DROP POLICY IF EXISTS "Service role can manage all content" ON public.content;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS set_content_updated_at ON public.content;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.get_user_tier(UUID);
DROP FUNCTION IF EXISTS public.can_access_content(UUID, TEXT);

-- Drop existing tables (⚠️ THIS DELETES ALL DATA!)
DROP TABLE IF EXISTS public.content CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- STEP 2: RECREATE EVERYTHING FROM SCRATCH
-- =====================================================

-- =====================================================
-- 2.1 CREATE PROFILES TABLE
-- =====================================================

CREATE TABLE public.profiles (
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

CREATE INDEX profiles_email_idx ON public.profiles(email);
CREATE INDEX profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);

-- =====================================================
-- 2.2 CREATE CONTENT TABLE
-- =====================================================

CREATE TABLE public.content (
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

CREATE INDEX content_slug_idx ON public.content(slug);
CREATE INDEX content_required_tier_idx ON public.content(required_tier);
CREATE INDEX content_is_published_idx ON public.content(is_published);

-- =====================================================
-- 2.3 CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Auto-create profile on user signup
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, subscription_status, trial_ends_at)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    'trialing',
    NOW() + INTERVAL '14 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update timestamps
CREATE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 2.4 ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2.5 CREATE RLS POLICIES FOR PROFILES
-- =====================================================

CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND subscription_tier = (SELECT subscription_tier FROM public.profiles WHERE id = auth.uid())
    AND subscription_status = (SELECT subscription_status FROM public.profiles WHERE id = auth.uid())
    AND stripe_customer_id = (SELECT stripe_customer_id FROM public.profiles WHERE id = auth.uid())
    AND stripe_subscription_id = (SELECT stripe_subscription_id FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Service role can do everything on profiles"
  ON public.profiles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 2.6 CREATE RLS POLICIES FOR CONTENT
-- =====================================================

CREATE POLICY "Published content is viewable by everyone"
  ON public.content
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Service role can manage all content"
  ON public.content
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 2.7 CREATE HELPER FUNCTIONS
-- =====================================================

CREATE FUNCTION public.get_user_tier(user_id UUID)
RETURNS TEXT AS $$
  SELECT subscription_tier FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

CREATE FUNCTION public.can_access_content(
  user_id UUID,
  content_tier TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_profile RECORD;
  tier_hierarchy JSONB := '{"free": 0, "premium": 1, "enterprise": 2}'::jsonb;
  user_tier_level INTEGER;
  content_tier_level INTEGER;
BEGIN
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = user_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  user_tier_level := (tier_hierarchy->>user_profile.subscription_tier)::INTEGER;
  content_tier_level := (tier_hierarchy->>content_tier)::INTEGER;

  IF user_tier_level >= content_tier_level THEN
    RETURN true;
  END IF;

  IF user_profile.subscription_status = 'trialing'
     AND user_profile.trial_ends_at > NOW() THEN
    IF (tier_hierarchy->>'premium')::INTEGER >= content_tier_level THEN
      RETURN true;
    END IF;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2.8 GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

GRANT SELECT ON public.content TO authenticated;
GRANT SELECT ON public.content TO anon;

-- =====================================================
-- ✅ RESET COMPLETE
-- =====================================================
--
-- Your database has been completely reset.
-- All previous data has been deleted.
--
-- Next steps:
-- 1. Run seeding script to add sample content
-- 2. Create test user accounts
-- 3. Test functionality
--
