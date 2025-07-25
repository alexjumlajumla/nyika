'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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
      
      // Get the current locale from the URL
      const currentLocale = window.location.pathname.split('/')[1] || 'en';
      let redirectTo = `/${currentLocale}/dashboard`;
      
      // Store the redirect URL in session storage
      sessionStorage.setItem('auth_redirect', redirectTo);
      
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
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | undefined;

    const initializeAuth = async () => {
      try {
        if (!isMounted) return;
        
        setIsLoading(true);
        
        // First check if we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          if (isMounted) {
            setUser(session.user);
            
            // Get profile
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError) throw profileError;
              
              if (isMounted) {
                setProfile(profile);
                
                // If user is on sign-in page but already authenticated, redirect to dashboard
                if (window.location.pathname.includes('/auth/signin')) {
                  const redirectTo = sessionStorage.getItem('auth_redirect') || `/${window.location.pathname.split('/')[1] || 'en'}/dashboard`;
                  sessionStorage.removeItem('auth_redirect');
                  window.location.href = redirectTo;
                }
              }
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
              if (isMounted) {
                setError('Failed to load user profile');
              }
            }
          }
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to initialize authentication';
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (isMounted) {
              if (profile) {
                setProfile(profile);
              }
              
              // Redirect after successful sign in
              const redirectTo = sessionStorage.getItem('auth_redirect') || 
                               `/${window.location.pathname.split('/')[1] || 'en'}/dashboard`;
              sessionStorage.removeItem('auth_redirect');
              
              // Only redirect if not already on the target page to prevent loops
              if (!window.location.pathname.endsWith(redirectTo)) {
                window.location.href = redirectTo;
              }
            }
          } catch (error) {
            console.error('Error updating profile after sign in:', error);
            if (isMounted) {
              setError('Failed to update user profile');
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            // Force a full page reload to clear any client-side state
            window.location.href = '/';
          }
        } else if (event === 'USER_UPDATED' && session?.user) {
          if (isMounted) {
            setUser(session.user);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          // Handle token refresh if needed
          console.log('Token was refreshed');
        }
      }
    );
    
    authSubscription = subscription;
    
    // Initialize auth after setting up the listener
    initializeAuth();
    
    return () => {
      isMounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
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
