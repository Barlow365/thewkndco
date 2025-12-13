-- 002_add_avatar_to_profiles.sql
-- Adds avatar support for user profiles and creates a public storage bucket.

-- 1) Add avatar_url column if it does not exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2) Create a public storage bucket for avatars (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3) Basic RLS for the avatars bucket: users can manage their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Avatar owners can manage their files'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Avatar owners can manage their files"
    ON storage.objects
    FOR ALL
    USING (
      bucket_id = 'avatars'
      AND (owner = auth.uid() OR owner IS NULL)
    )
    WITH CHECK (
      bucket_id = 'avatars'
      AND (owner = auth.uid() OR owner IS NULL)
    );
  END IF;
END $$;

-- 4) Ensure anonymous read access for avatars (public avatars)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'Public read for avatars'
      AND tablename = 'objects'
      AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Public read for avatars"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'avatars');
  END IF;
END $$;

