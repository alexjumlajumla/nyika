'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
};

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
};

type AuthResult = {
  error: Error | null;
  user: User | null;
  session: any | null;
};

type AuthContextType = AuthState & {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<AuthResult>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<{ user: User | null; profile: UserProfile | null } | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    error: null,
  });

  // Refresh user data
  const refresh = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setState(prev => ({
      ...prev,
      user,
      profile,
    }));
    
    return { user, profile };
  }, []);

  // Sign in with email and password
  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) throw profileError;
        
        setState(prev => ({
          ...prev,
          user: data.user,
          profile: profileData,
          isLoading: false,
          error: null,
        }));
        
        return { 
          user: data.user, 
          session: data.session, 
          error: null 
        };
      }
      
      const noUserError = new Error('No user data');
      setState(prev => ({ ...prev, isLoading: false, error: noUserError.message }));
      return { 
        user: null, 
        session: null, 
        error: noUserError 
      };
      
    } catch (error) {
      console.error('Sign in error:', error);
      const authError = error instanceof Error ? error : new Error('Failed to sign in');
      setState(prev => ({ ...prev, isLoading: false, error: authError.message }));
      return { 
        user: null, 
        session: null, 
        error: authError 
      };
    }
  }, []);

  // Sign up with email and password
  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata: Record<string, any> = {}
  ): Promise<AuthResult> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...metadata,
            email_verified: false,
            is_active: true,
          },
        },
      });

      if (error) throw error;
      
      if (data?.user) {
        setState(prev => ({
          ...prev,
          user: data.user,
          isLoading: false,
          error: null,
        }));
      }

      return { 
        user: data.user ?? null, 
        session: data.session ?? null, 
        error: null 
      };
    } catch (error) {
      const authError = error instanceof Error ? error : new Error('Failed to sign up');
      setState(prev => ({ ...prev, isLoading: false, error: authError.message }));
      return { 
        user: null, 
        session: null, 
        error: authError 
      };
    }
  }, []);

  // Sign in with OAuth provider
  const signInWithOAuth = useCallback(async (provider: 'google' | 'github'): Promise<AuthResult> => {
    if (provider !== 'google') {
      const error = new Error('Only Google OAuth is supported');
      setState(prev => ({ ...prev, error: error.message }));
      return { user: null, session: null, error };
    }
    
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Generate a random state parameter for CSRF protection
      const state = Math.random().toString(36).substring(2);
      localStorage.setItem('oauth_state', state);
      
      // Set up the redirect URL with a next parameter
      const redirectTo = `${window.location.origin}/dashboard`;
      
      // Initiate the OAuth sign-in
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile',
        },
      });

      if (signInError) {
        throw new Error(signInError.message || `Failed to initiate ${provider} sign in`);
      }
      
      // If we have a URL, we're in the browser and should redirect
      if (data.url) {
        window.location.href = data.url;
        return { 
          user: null, 
          session: null, 
          error: null 
        };
      }
      
      // If we don't have a URL but also no error, something went wrong
      throw new Error(`No redirect URL received from ${provider} OAuth`);
      
    } catch (error) {
      const authError = error instanceof Error 
        ? error 
        : new Error(`Failed to sign in with ${provider}`);
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: authError.message 
      }));
      
      return { 
        user: null, 
        session: null, 
        error: authError 
      };
    }
  }, []);

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error?.message || null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to reset password' };
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setState(prev => ({
      ...prev,
      user: null,
      profile: null,
    }));
  }, []);

  // Create the context value
  const contextValue = useMemo<AuthContextType>(
    () => ({
      ...state,
      signIn,
      signUp,
      signInWithOAuth,
      resetPassword,
      signOut,
      refresh,
    }),
    [state, signIn, signUp, signInWithOAuth, resetPassword, signOut, refresh]
  );

  // Initial fetch and auth state listener
  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (isMounted) {
            if (profileError) {
              setState(prev => ({
                ...prev,
                user: session.user,
                isLoading: false,
                error: profileError.message,
              }));
            } else {
              setState({
                user: session.user,
                profile,
                isLoading: false,
                error: null,
              });
            }
          }
        } else if (isMounted) {
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            isLoading: false,
            error: null,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch user',
          }));
        }
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (isMounted) {
            if (profileError) {
              setState(prev => ({
                ...prev,
                user: session.user,
                isLoading: false,
                error: profileError.message,
              }));
            } else {
              setState({
                user: session.user,
                profile,
                isLoading: false,
                error: null,
              });
            }
          }
        } else if (event === 'SIGNED_OUT' && isMounted) {
          setState({
            user: null,
            profile: null,
            isLoading: false,
            error: null,
          });
        } else if (event === 'USER_UPDATED' && session?.user && isMounted) {
          setState(prev => ({
            ...prev,
            user: session.user,
          }));
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={contextValue}>
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
