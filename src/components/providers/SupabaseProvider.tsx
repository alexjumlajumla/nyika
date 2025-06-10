'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const refreshSession = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setIsLoading(true);
      const { data: { session: newSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        throw error;
      }
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
    } catch (error) {
      console.error('Error in refreshSession:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    setMounted(true);
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Refresh session data when auth state changes
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          await refreshSession();
        }
      }
    );

    // Initial session load
    refreshSession();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Don't render children until we've mounted on the client
  if (!mounted) {
    return null;
  }

  return (
    <SupabaseContext.Provider value={{ session, user, isLoading, refreshSession }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
