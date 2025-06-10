import { createBrowserClient as createBrowserClientBase } from '@supabase/ssr';
import { Database } from '@/lib/supabase/database.types';

/**
 * Creates a Supabase client for client-side usage
 * @returns A Supabase client instance
 * @throws {Error} If required environment variables are missing
 */
export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Validate environment variables
  if (!supabaseUrl) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!supabaseAnonKey) {
    throw new Error('Missing required environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Create and return the Supabase client
  return createBrowserClientBase<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
}
