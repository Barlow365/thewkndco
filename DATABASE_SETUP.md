# 🗄️ DATABASE SETUP INSTRUCTIONS

## STEP 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: **vfkgheowfxnwzzeifpsw**
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

## STEP 2: Run the Migration

1. Open the file: `migrations/001_user_roles_and_content.sql`
2. Copy the ENTIRE contents (all 242 lines)
3. Paste into the Supabase SQL Editor
4. Click "Run" button (or press Ctrl/Cmd + Enter)

## STEP 3: Verify Migration Success

Run this verification query in the SQL Editor:

```sql
-- Check if tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'content');

-- Check if trigger function exists
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';
```

**Expected Result:**
- Should show 2 tables: `profiles` and `content`
- Should show function: `handle_new_user`

## STEP 4: Test Profile Creation

Create a test user or check existing users:

```sql
-- View all profiles (should auto-create when users sign up)
SELECT id, email, subscription_tier, subscription_status, trial_ends_at
FROM public.profiles;
```

## ✅ MIGRATION COMPLETE!

After running the migration, your database will have:

1. ✓ `profiles` table - stores user subscription data
2. ✓ `content` table - stores articles and content
3. ✓ Automatic profile creation trigger
4. ✓ Row Level Security (RLS) policies
5. ✓ Helper functions for access control

## 🚨 IMPORTANT NOTES:

- The migration is **idempotent** - safe to run multiple times
- Uses `CREATE TABLE IF NOT EXISTS` and `DROP TRIGGER IF EXISTS`
- Auto-creates user profiles when they sign up
- Sets 14-day trial for all new users
- RLS ensures users can only access their own data

## 🆘 IF MIGRATION FAILS:

If you get any errors:

1. **Check permissions**: Ensure you're project owner
2. **Try again**: The migration handles existing objects
3. **Manual cleanup**: If needed, drop tables first:
   ```sql
   DROP TABLE IF EXISTS public.content CASCADE;
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```

## STEP 5: Add Service Role Key (For Seeding)

To seed content, you need the Supabase Service Role Key:

1. In Supabase Dashboard, go to **Settings** > **API**
2. Find "service_role" key under "Project API keys"
3. Copy the key (starts with `eyJ...`)
4. Add to your `.env.local` file:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

## STEP 6: Seed Content

After adding the service role key, seed sample articles:

```bash
cd Desktop/WKND_CO/3_CODEBASE/frontend
npm run seed
```

This will create 8 sample articles:
- 3 Free articles
- 3 Premium articles
- 2 Enterprise articles

✅ You're now ready to test the application!
