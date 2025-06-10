'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase/browser';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to manage the current user's authentication state
 * @returns An object containing the current user, loading state, error, and refresh function
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Create a memoized Supabase client instance
  const supabase = createBrowserClient();

  /**
   * Fetches the current session and updates the user state
   */
  const refresh = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      setUser(session?.user ?? null);
    } catch (err) {
      console.error('Error refreshing user session:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh session'));
    } finally {
      setLoading(false);
    }
  }, [supabase.auth]);

  // Set up auth state change listener
  useEffect(() => {
    // Initial session fetch
    refresh().catch(console.error);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: Session | null) => {
        console.log('Auth state changed:', event);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [refresh, supabase.auth]);

  return { user, loading, error, refresh };
}
