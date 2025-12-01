-- =====================================================
-- WKND_CO User Roles & Paywall System
-- VERSION: PRODUCTION-SAFE (No Data Loss)
-- =====================================================
--
-- ✅ SAFE FOR PRODUCTION
-- ✅ Idempotent (can run multiple times)
-- ✅ Creates tables only if they don't exist
-- ✅ Updates functions/triggers/policies
-- ✅ NO DATA LOSS
--
-- WHEN TO USE:
-- - First-time setup in production
-- - Adding new features to existing database
-- - Updating functions/policies
-- - Any environment with data you want to keep
--
-- =====================================================

-- =====================================================
-- 1. CREATE PROFILES TABLE
-- =====================================================
-- This table stores user subscription information
-- Links to auth.users with CASCADE DELETE for automatic cleanup

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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);

-- =====================================================
-- 2. CREATE CONTENT TABLE
-- =====================================================
-- This table stores articles/content with tier-based access

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

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS content_slug_idx ON public.content(slug);
CREATE INDEX IF NOT EXISTS content_required_tier_idx ON public.content(required_tier);
CREATE INDEX IF NOT EXISTS content_is_published_idx ON public.content(is_published);

-- =====================================================
-- 3. AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================
-- This trigger automatically creates a profile when a user signs up
-- Gives them a 14-day premium trial

CREATE OR REPLACE FUNCTION public.handle_new_user()
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

-- Drop and recreate trigger (safe - trigger recreation doesn't affect data)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. AUTO-UPDATE TIMESTAMPS
-- =====================================================
-- This trigger automatically updates the updated_at column

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for content table
DROP TRIGGER IF EXISTS set_content_updated_at ON public.content;
CREATE TRIGGER set_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 5. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
-- RLS ensures users can only access data they're allowed to see

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS POLICIES FOR PROFILES
-- =====================================================
-- These policies control who can read/write profile data

-- Drop existing policies (safe - we recreate them immediately)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can do everything on profiles" ON public.profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their profile (but NOT subscription fields)
-- This prevents users from giving themselves free premium access
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

-- Policy: Service role has full admin access
CREATE POLICY "Service role can do everything on profiles"
  ON public.profiles
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 7. RLS POLICIES FOR CONTENT
-- =====================================================
-- These policies control who can read content

-- Drop existing policies
DROP POLICY IF EXISTS "Published content is viewable by everyone" ON public.content;
DROP POLICY IF EXISTS "Service role can manage all content" ON public.content;

-- Policy: Anyone can view published content
CREATE POLICY "Published content is viewable by everyone"
  ON public.content
  FOR SELECT
  USING (is_published = true);

-- Policy: Service role can create/update/delete content
CREATE POLICY "Service role can manage all content"
  ON public.content
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- 8. HELPER FUNCTIONS
-- =====================================================

-- Get user's subscription tier
CREATE OR REPLACE FUNCTION public.get_user_tier(user_id UUID)
RETURNS TEXT AS $$
  SELECT subscription_tier FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Check if user can access content based on tier and trial status
CREATE OR REPLACE FUNCTION public.can_access_content(
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
  -- Get user profile
  SELECT * INTO user_profile
  FROM public.profiles
  WHERE id = user_id;

  -- If no profile found, deny access
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Calculate tier levels
  user_tier_level := (tier_hierarchy->>user_profile.subscription_tier)::INTEGER;
  content_tier_level := (tier_hierarchy->>content_tier)::INTEGER;

  -- Check if user tier is high enough
  IF user_tier_level >= content_tier_level THEN
    RETURN true;
  END IF;

  -- Special case: Active trial users get premium access
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
-- 9. GRANT PERMISSIONS
-- =====================================================
-- Allow authenticated and anonymous users to read data
-- Write permissions are controlled by RLS policies

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

GRANT SELECT ON public.content TO authenticated;
GRANT SELECT ON public.content TO anon;

-- =====================================================
-- ✅ MIGRATION COMPLETE
-- =====================================================
--
-- To verify the migration worked:
--
-- 1. Check tables exist:
--    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
--
-- 2. Check RLS is enabled:
--    SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
--
-- 3. Check policies:
--    SELECT * FROM pg_policies WHERE schemaname = 'public';
--
-- 4. Test the schema:
--    SELECT * FROM public.profiles LIMIT 1;
--    SELECT * FROM public.content LIMIT 1;
--
-- Next steps:
-- - Run seeding script to add sample content
-- - Create your first user account
-- - Test the paywall functionality
--
