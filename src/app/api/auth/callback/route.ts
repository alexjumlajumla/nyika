import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const next = requestUrl.searchParams.get('next') || '/';
  
  // Create a route handler client that will handle cookies automatically
  const supabase = createRouteHandlerClient<Database>({ 
    cookies: () => cookies() 
  });
  
  // Handle OAuth errors
  if (error) {
    const errorUrl = new URL('/auth/signin', requestUrl.origin);
    errorUrl.searchParams.set('error', error);
    return NextResponse.redirect(errorUrl);
  }

  // If no code is provided, redirect to sign in
  if (!code) {
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin));
  }

  try {
    // Exchange the code for a session - this will set the session cookie
    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (authError || !session?.user) {
      throw new Error(authError?.message || 'Failed to authenticate with the provider');
    }
    
    // Ensure the user has a profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();
    
    if (!profile) {
      // Create a new profile
      await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatar_url: session.user.user_metadata?.avatar_url || null,
          updated_at: new Date().toISOString(),
        });
    }
    
    // Determine where to redirect
    let redirectTo: URL;
    
    try {
      // Only allow relative URLs for security
      redirectTo = new URL(next.startsWith('/') ? next : '/dashboard', requestUrl.origin);
    } catch {
      // Default to dashboard if next is invalid
      redirectTo = new URL('/dashboard', requestUrl.origin);
    }
    
    // Create a response that will redirect the user
    const response = NextResponse.redirect(redirectTo);
    
    // The session cookie is already set by exchangeCodeForSession
    // We'll just make sure it has the right options
    const cookieStore = cookies();
    const allCookies = await cookieStore;
    const sessionCookie = allCookies.get('sb-access-token');
    
    if (sessionCookie) {
      response.cookies.set({
        name: 'sb-access-token',
        value: sessionCookie.value,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }
    
    return response;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? 
      error.message : 'An unknown error occurred during authentication';
    
    // Redirect to sign-in with error
    const errorUrl = new URL('/auth/signin', requestUrl.origin);
    errorUrl.searchParams.set('error', encodeURIComponent(errorMessage));
    return NextResponse.redirect(errorUrl);
  }
}

export { GET as POST };