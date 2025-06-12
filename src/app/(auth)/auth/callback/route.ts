import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  if (code) {
    try {
      // Exchange the code for a session
      const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);
      
      if (session) {
        // Determine the redirect URL based on user role
        let redirectPath = '/';
        const userEmail = session.user.email;
        const isAdmin = userEmail?.endsWith('@nyika.co.tz') || userEmail?.endsWith('@shadows-of-africa.com');
        
        if (next) {
          // If there's a next parameter, use it
          redirectPath = next.startsWith('/') ? next : `/${next}`;
        } else {
          // Otherwise, redirect based on user role
          redirectPath = isAdmin ? '/admin/dashboard' : '/account/dashboard';
        }
        
        // Ensure the redirect URL has the correct locale
        const locale = requestUrl.pathname.split('/')[1] || 'en';
        if (!redirectPath.startsWith(`/${locale}/`)) {
          redirectPath = `/${locale}${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`;
        }
        
        return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Error during OAuth callback:', error);
      }
      // Redirect to sign-in with error message
      const signInUrl = new URL('/auth/signin', requestUrl.origin);
      signInUrl.searchParams.set('error', 'OAuth sign in failed');
      return NextResponse.redirect(signInUrl);
    }
  }

  // Default redirect if no code or error occurred
  return NextResponse.redirect(new URL(next || '/', requestUrl.origin));
}
