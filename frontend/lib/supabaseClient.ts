import { createClient } from '@supabase/supabase-js'

// Use the publishable NEXT_PUBLIC_ environment variables created in `.env.local`.
// These are safe to expose to the browser for frontend use.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Export a ready-to-use Supabase client. The `!` non-null assertions are used
// because `.env.local` will be created with these values in local development.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
