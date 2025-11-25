import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Read from NEXT_PUBLIC_ environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
	supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
	// If env vars are not provided (local dev without keys), export a minimal stub
	// so imports won't crash during SSR or build. Methods used by the app return
	// a harmless default shape.
	// We'll cast to SupabaseClient to keep TypeScript happy.
	const stub = {
		auth: {
			getSession: async (): Promise<{ data: { session: null } }> => ({ data: { session: null } }),
			onAuthStateChange: (_event: unknown, _callback: (...args: unknown[]) => void) => ({ data: { subscription: { unsubscribe(): void {} } } }),
			signInWithPassword: async (): Promise<{ data: null; error: { message: string } | null }> => ({ data: null, error: { message: 'Supabase not configured' } }),
			signUp: async (): Promise<{ data: null; error: { message: string } | null }> => ({ data: null, error: { message: 'Supabase not configured' } }),
			signOut: async (): Promise<{ data: null; error: null }> => ({ error: null, data: null }),
		},
	}
	supabase = stub as unknown as SupabaseClient
}

export { supabase }
