import { supabase } from '@/lib/supabase/client';

export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  created_at: string;
  updated_at: string;
  // Add other profile fields as needed
}

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  
  return user;
}

/**
 * Get the current user's profile data
 * @returns The user's profile data or null if not found
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    if (error.message && !error.message.includes('No rows found')) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  }
  
  return data;
}

/**
 * Check if the current user has a specific role
 * @param role The role to check for
 * @returns Boolean indicating if the user has the role
 */
export async function userHasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', role)
    .single();
    
  if (error) {
    console.error('Error checking user role:', error);
    return false;
  }
  
  return !!data;
}

/**
 * Sign out the current user
 * @param redirectTo Optional URL to redirect to after sign out
 */
export async function signOut(redirectTo: string = '/') {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
  
  // If we're in the browser, redirect after sign out
  if (typeof window !== 'undefined') {
    window.location.href = redirectTo;
  }
}

/**
 * Require authentication for a page or API route
 * @param context The Next.js context
 * @returns The authenticated user or redirects to sign in
 */
export async function requireAuth(context: { resolvedUrl: string }) {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin?redirectedFrom=${encodeURIComponent(context.resolvedUrl)}`,
        permanent: false,
      },
    };
  }
  
  return { props: { user: session.user } };
}

/**
 * Redirect authenticated users away from auth pages
 * @returns A redirect if the user is already authenticated
 */
export async function redirectIfAuthenticated() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
  
  return { props: {} };
}

/**
 * Update the user's profile
 * @param userId The user's ID
 * @param updates The fields to update
 * @returns The updated profile or null if there was an error
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    full_name: string;
    avatar_url: string;
    phone: string;
    // Add other profile fields as needed
  }>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  
  return data;
}
