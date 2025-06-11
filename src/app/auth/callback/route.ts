import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  
  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?error=${encodeURIComponent(error)}`
    );
  }
  
  if (!code) {
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/signin?error=No authentication code provided`
    );
  }
  
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Exchange the code for a session
    const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (authError || !session) {
      const errorMessage = authError?.message || 'Failed to create session';
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }
    
    // Get the redirect URL from cookie or use default
    const redirectUrl = new URL(
      requestUrl.searchParams.get('redirectedFrom') || 
      `/${requestUrl.pathname.split('/')[1] || 'en'}/dashboard`,
      request.url
    );
    
    // Create response with redirect
    const response = NextResponse.redirect(redirectUrl);
    
    // Ensure session is set in cookies
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(
        new URL(`/auth/signin?error=${encodeURIComponent('User not found')}`, request.url)
      );
    }
    
    // Set auth state in cookie for client-side
    response.cookies.set('sb-auth-token', session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'lax',
    });
    
    return response;
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
    const errorUrl = new URL('/auth/signin', request.url);
    errorUrl.searchParams.set('error', errorMessage);
    return NextResponse.redirect(errorUrl);
  }
}
