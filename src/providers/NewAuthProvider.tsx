'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign in');
      setError(authError.message);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign up');
      setError(authError.message);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  // Handle OAuth sign in
  const signInWithOAuth = useCallback(async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Store the current path for redirect after OAuth
      const redirectTo = window.location.pathname + window.location.search;
      sessionStorage.setItem('oauth_redirect', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error(`Failed to sign in with ${provider}`);
      setError(authError.message);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      router.push('/');
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign out');
      setError(authError.message);
    } finally {
      setIsLoading(false);
    }
  }, [router, supabase.auth]);

  // Reset password
  const resetPassword = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) throw error;
      
      return { error: null };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to reset password');
      setError(authError.message);
      return { error: authError };
    } finally {
      setIsLoading(false);
    }
  }, [supabase.auth]);

  // Initialize auth state and set up listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          
          // Get profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setProfile(profile);
          }
          
          // Handle OAuth redirect if it exists
          const redirectUrl = sessionStorage.getItem('oauth_redirect');
          if (redirectUrl) {
            sessionStorage.removeItem('oauth_redirect');
            router.push(redirectUrl);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize authentication';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user);
          
          // Get profile after sign in
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            setProfile(profile);
          }
          
          // Handle OAuth redirect
          const redirectUrl = sessionStorage.getItem('oauth_redirect');
          if (redirectUrl) {
            sessionStorage.removeItem('oauth_redirect');
            router.push(redirectUrl);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  const value = useMemo(() => ({
    user,
    profile,
    isLoading,
    error,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
  }), [
    user, 
    profile, 
    isLoading, 
    error, 
    signIn, 
    signUp, 
    signInWithOAuth, 
    signOut, 
    resetPassword
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
