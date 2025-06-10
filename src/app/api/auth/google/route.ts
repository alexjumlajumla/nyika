import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const next = requestUrl.searchParams.get('next') || '/';
  
  // Create a route handler client that will handle cookies automatically
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Clear any existing session to prevent conflicts
    await supabase.auth.signOut();
    
    // Generate the redirect URL
    const redirectTo = new URL('/api/auth/callback', requestUrl.origin);
    redirectTo.searchParams.set('next', next);
    
    // Add a timestamp to prevent caching
    redirectTo.searchParams.set('_t', Date.now().toString());
    
    // Initiate OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo.toString(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error || !data?.url) {
      throw error || new Error('Failed to initiate OAuth: No URL returned');
    }
    
    // Redirect to the OAuth provider
    return NextResponse.redirect(data.url);
    
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to initiate OAuth';
    
    // Redirect to sign-in with error
    const redirectUrl = new URL('/auth/signin', requestUrl.origin);
    redirectUrl.searchParams.set('error', encodeURIComponent(errorMessage));
    
    return NextResponse.redirect(redirectUrl);
  }
}

export { GET as POST };