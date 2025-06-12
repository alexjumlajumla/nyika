import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// List of public paths that don't require authentication (without locale prefix)
const publicPaths = [
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/destinations',
  '/tours',
  '/attractions',
  '/accommodations',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/unauthorized',
  '/error',
  '/500',
  '/404',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/callback'
];

// Paths that should be excluded from locale prefixing and authentication
const excludedPaths = [
  '/api',
  '/_next',
  '/static',
  '/images',
  '/fonts',
  '/favicon.ico',
  '/auth/callback'
];

// Check if the current path is public
function isPublicPath(path: string): boolean {
  // Handle root path
  if (path === '/') return true;
  
  // Remove leading slash and split into segments
  const segments = path.replace(/^\//, '').split('/');
  const hasLocale = segments.length > 0 && ['en', 'sw'].includes(segments[0]);
  const pathWithoutLocale = hasLocale ? '/' + segments.slice(1).join('/') : path;
  
  // Check exact matches (with or without locale)
  if (publicPaths.includes(path) || publicPaths.includes(pathWithoutLocale)) {
    return true;
  }

  // Check dynamic public routes (with or without locale)
  const publicRoutePatterns = [
    /^(\/[a-z]{2})?\/tours\/.*/,
    /^(\/[a-z]{2})?\/blog\/.*/,
    /^(\/[a-z]{2})?\/destinations\/.*/,
    /^(\/[a-z]{2})?\/attractions\/.*/,
    /^(\/[a-z]{2})?\/accommodations\/.*/,
    /^\/api\/.*/,
    /^\/_next\/.*/,
    /^\/static\/.*/,
    /\.(ico|png|jpg|jpeg|gif|svg|css|js|json|webmanifest)$/i
  ];

  return publicRoutePatterns.some(pattern => 
    pattern.test(path) || pattern.test(pathWithoutLocale)
  );
}

// Check if path should be excluded from locale handling
function isExcludedPath(path: string): boolean {
  return excludedPaths.some(excluded => 
    path === excluded || path.startsWith(`${excluded}/`)
  );
}

// Function to ensure a path has a valid locale prefix
function ensureLocalePath(path: string, defaultLocale: string = 'en'): string {
  const segments = path.split('/').filter(Boolean);
  
  // If the path is empty or already has a valid locale, return as is
  if (path === '/' || path === '') {
    return `/${defaultLocale}`;
  }
  
  // Check if first segment is a valid locale
  if (segments.length > 0 && ['en', 'sw'].includes(segments[0])) {
    return path;
  }
  
  // Add default locale if needed
  return `/${defaultLocale}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const path = pathname.split('?')[0];
  const segments = pathname.split('/').filter(Boolean);
  const hasValidLocale = segments.length > 0 && ['en', 'sw'].includes(segments[0]);
  const defaultLocale = 'en';
  const currentLocale = hasValidLocale ? segments[0] : defaultLocale;
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const code = searchParams.get('code');

  // Skip middleware for excluded paths (API, _next, static files, etc.)
  if (isExcludedPath(path)) {
    return NextResponse.next();
  }

  // Handle root path - redirect to default locale with trailing slash
  if (path === '/') {
    const newUrl = new URL(request.url);
    newUrl.pathname = `/${defaultLocale}/`;
    return NextResponse.redirect(newUrl);
  }

  // Handle OAuth callback
  if (path.includes('/auth/callback')) {
    return NextResponse.next();
  }

  // Handle auth paths (signin, signup, forgot-password, reset-password, verify-email)
  if (path.startsWith('/auth/') || path === '/auth') {
    // If already authenticated and trying to access auth pages, redirect to home or callbackUrl
    try {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: any) {
              request.cookies.set({ name, value, ...options });
            },
            remove(name: string) {
              request.cookies.delete(name);
            },
          },
        }
      );

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If user is already authenticated, redirect to home or callbackUrl
        const redirectTo = new URL(callbackUrl || '/', request.url);
        return NextResponse.redirect(redirectTo);
      }
    } catch (error) {
      console.error('Error checking auth status in middleware:', error);
    }
    
    // Ensure auth paths have a locale
    if (!hasValidLocale) {
      const newUrl = new URL(request.url);
      newUrl.pathname = ensureLocalePath(path, defaultLocale);
      return NextResponse.redirect(newUrl);
    }
    
    return NextResponse.next();
  }

  // Check if this is a public path
  if (isPublicPath(path)) {
    // If it's a public path but doesn't have a locale, add it
    if (!hasValidLocale) {
      const newUrl = new URL(request.url);
      newUrl.pathname = ensureLocalePath(path, defaultLocale);
      return NextResponse.redirect(newUrl);
    }
    return NextResponse.next();
  }

  try {
    const response = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string) {
            request.cookies.delete(name);
            response.cookies.delete(name);
          },
        },
      }
    );

    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // If there's an error or no session, redirect to sign-in with locale
    if (error || !session) {
      // Extract locale from the URL or default to 'en'
      const locale = pathname.split('/')[1] || 'en';
      const signInPath = `/${locale}/auth/signin`;
      
      const redirectUrl = new URL(signInPath, request.url);
      
      // Only set redirectedFrom if it's not already a sign-in path to prevent loops
      if (!path.includes('/auth/')) {
        redirectUrl.searchParams.set('callbackUrl', pathname + search);
      }
      
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin access for admin routes
    if (path.startsWith('/admin') && !session.user.email?.endsWith('@nyika.co.tz')) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // If user is authenticated, update the session to prevent timeout
    if (session) {
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.getSession();
      
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        throw refreshError;
      }
      
      if (refreshedSession) {
        // Update the session in the response
        response.cookies.set({
          name: 'sb-access-token',
          value: refreshedSession.access_token,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
        
        response.cookies.set({
          name: 'sb-refresh-token',
          value: refreshedSession.refresh_token,
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
        });
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    const redirectUrl = new URL('/error', request.url);
    redirectUrl.searchParams.set('error', 'auth_error');
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js|json|ico$)).*)',
  ],
};
