import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

declare global {
  interface Window {
    ENV: {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    };
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 
  (typeof window !== 'undefined' ? window.ENV?.NEXT_PUBLIC_SUPABASE_URL : '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  (typeof window !== 'undefined' ? window.ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY : '');

// Environment variables are validated at runtime by the Supabase client

// Create a single supabase client for client-side use
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
  }
);

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any, context = 'operation') {
  // Handle specific error cases
  if (error?.message?.includes('Email not confirmed')) {
    throw new Error('Please verify your email before signing in. Check your inbox for a confirmation link.');
  }
  
  if (error?.message?.includes('Invalid login credentials')) {
    throw new Error('Invalid email or password');
  }
  
  if (error?.message?.includes('User already registered')) {
    throw new Error('This email is already registered. Please sign in instead.');
  }
  
  if (error?.message?.includes('Email rate limit exceeded')) {
    throw new Error('Too many attempts. Please try again later.');
  }
  
  // Default error message
  throw new Error(
    error?.message || `An error occurred during ${context}. Please try again.`
  );
}

/**
 * Auth methods
 */

// Magic link sign in
export const signInWithMagicLink = async (email: string, redirectTo: string = '/auth/callback') => {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectTo}`,
      },
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: handleSupabaseError(error, 'magic link sign in') };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, metadata: Record<string, any> = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata.fullName || '',
          ...metadata,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error, 'email sign up') };
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error, 'email sign in') };
  }
};

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: handleSupabaseError(error, 'sign out') };
  }
};

// Get current user
export const getUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    return { user: null, error: handleSupabaseError(error, 'get current user') };
  }
};

// Get session
export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { session, error: null };
  } catch (error) {
    return { session: null, error: handleSupabaseError(error, 'get session') };
  }
};

// Reset password for email
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: handleSupabaseError(error, 'reset password') };
  }
};

// Update user profile
export const updateProfile = async (updates: any) => {
  try {
    const { data, error } = await supabase.auth.updateUser(updates);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error, 'update profile') };
  }
};

// Re-export types for convenience
export type { Session, User } from '@supabase/supabase-js';

// Re-export all the auth methods
export const auth = {
  getSession,
  getUser,
  signInWithEmail,
  signInWithMagicLink,
  signUpWithEmail,
  signOut,
  resetPassword,
  updateProfile,
};

export default supabase;
