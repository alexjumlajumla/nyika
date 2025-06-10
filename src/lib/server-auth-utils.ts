'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// This version is for server components only
export async function requireAuth(requiredRole?: string) {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { session }, error } = await supabase.auth.getSession();

    if (!session || error) {
      redirect('/auth/signin');
    }

    if (requiredRole) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile || profile.role !== requiredRole) {
        redirect('/unauthorized');
      }
    }
    
    return { user: session.user };
  } catch (error) {
    // In production, just redirect without logging
    if (process.env.NODE_ENV !== 'production') {
      // Logging for development only
      // eslint-disable-next-line no-console
      console.error('Auth error:', error);
    }
    redirect('/auth/signin');
  }
}

// Server-side only - for use in Server Components
export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }

    // Fetch additional user data from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return {
      ...session.user,
      role: profile?.role || 'user',
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || ''
    };
  } catch (error) {
    // In production, just return null without logging
    if (process.env.NODE_ENV !== 'production') {
      // Logging for development only
      // eslint-disable-next-line no-console
      console.error('Error getting user:', error);
    }
    return null;
  }
}

// For client-side components, use the useAuth hook from AuthProvider instead
