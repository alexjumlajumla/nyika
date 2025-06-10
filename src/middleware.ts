import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from './lib/supabase/server';

// Define locale types
const locales = ['en', 'sw'] as const;
type Locale = 'en' | 'sw';
const defaultLocale: Locale = 'en';

// Check if a locale is valid
const isValidLocale = (locale: string): locale is Locale => {
  return (locales as readonly string[]).includes(locale);
};

// List of public paths that don't require authentication
const publicPaths = [
  '/',
  '/signin',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/destinations',
  '/tours',
  '/attractions',
  '/accommodations',
  '/blog',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/api',
  '/_next',
  '/static',
  '/favicon.ico',
  '/images',
  '/fonts',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/unauthorized',
  '/error',
  '/500',
  '/404'
];

// Check if the current path is public
const isPublicPath = (path: string): boolean => {
  // Exact match
  if (publicPaths.includes(path)) return true;
  
  // Dynamic routes match
  if (
    path.startsWith('/tours/') || 
    path.startsWith('/blog/') ||
    path.startsWith('/destinations/') ||
    path.startsWith('/attractions/') ||
    path.startsWith('/accommodations/') ||
    path.startsWith('/api/') ||
    path.startsWith('/_next/') ||
    path.startsWith('/static/') ||
    path.endsWith('.ico') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.gif') ||
    path.endsWith('.svg') ||
    path.endsWith('.css') ||
    path.endsWith('.js') ||
    path.endsWith('.json') ||
    path.endsWith('.webmanifest')
  ) {
    return true;
  }
  
  // Check for locale paths (e.g., /en, /es, etc.)
  const segments = path.split('/').filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const pathWithoutLocale = '/' + segments.slice(1).join('/');
    return (
      publicPaths.includes(pathWithoutLocale) || 
      pathWithoutLocale === '' || 
      pathWithoutLocale === '/' ||
      pathWithoutLocale.startsWith('/tours/') ||
      pathWithoutLocale.startsWith('/blog/')
    );
  }
  
  return false;
};

// Handle locale detection and redirection
const handleLocaleRedirection = (req: NextRequest, path: string) => {
  // Check if path already has a valid locale
  const pathnameHasLocale = locales.some(
    (locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`
  );

  if (pathnameHasLocale) {
    return null;
  }

  // Extract the first segment as the potential locale
  const segments = path.split('/').filter(Boolean);
  const potentialLocale = segments[0];

  // If the first segment is a valid locale, no redirection needed
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return null;
  }

  // Get the preferred locale from cookie or Accept-Language header
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  let preferredLocale: Locale = 'en'; // Default to 'en'
  
  // Try to use the locale from cookie first
  if (cookieLocale === 'en' || cookieLocale === 'sw') {
    preferredLocale = cookieLocale;
  } else {
    // Fall back to Accept-Language header
    const acceptLanguage = req.headers.get('accept-language');
    
    if (acceptLanguage) {
      const preferred = acceptLanguage
        .split(',')
        .map((lang) => {
          const [locale] = lang.trim().split(';');
          return locale.split('-')[0];
        })
        .find((locale): locale is Locale => 
          locale === 'en' || locale === 'sw'
        );
      
      if (preferred) {
        preferredLocale = preferred;
      }
    }
  }
  
  // Create the new URL with the preferred locale
  const newUrl = new URL(`/${preferredLocale}${path}`, req.url);
  newUrl.search = req.nextUrl.search;
  
  return NextResponse.redirect(newUrl);
};

// Main middleware function
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (
    !pathname ||
    pathname.startsWith('/api/') || 
    pathname.startsWith('/_next/') || 
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/site.webmanifest'
  ) {
    return NextResponse.next();
  }
  
  // Handle root path
  if (pathname === '/' || pathname === '') {
    // Get the preferred locale from the cookie or Accept-Language header
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const acceptLanguage = request.headers.get('accept-language');
    let locale: Locale = defaultLocale;
    
    // Try to get locale from cookie first
    if (cookieLocale === 'en' || cookieLocale === 'sw') {
      locale = cookieLocale;
    } 
    // Fall back to Accept-Language header
    else if (acceptLanguage) {
      const preferred = acceptLanguage
        .split(',')
        .map((lang) => {
          const [loc] = lang.trim().split(';');
          return loc.split('-')[0];
        })
        .find((loc): loc is Locale => 
          loc === 'en' || loc === 'sw'
        );
      
      if (preferred) {
        locale = preferred;
      }
    }
    
    // Redirect to the localized home page
    const url = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(url);
  }
  
  // Handle locale redirection for the current request
  const localeRedirect = handleLocaleRedirection(request, pathname);
  if (localeRedirect) {
    return localeRedirect;
  }
  
  // Skip files that don't need authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  try {
    // Create a Supabase client
    const supabase = await createServerClient();
    
    // Get the session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // If there's an error getting the session, log it but don't block the request
    if (sessionError) {
      // Log the error in development only
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error getting session:', sessionError);
      }
      // Continue to the next middleware instead of blocking
      return NextResponse.next();
    }
    
    // If no session, redirect to sign in
    if (!session) {
      // Don't redirect if we're already on the signin page to avoid loops
      if (pathname === '/auth/signin' || pathname === '/auth/signup') {
        return NextResponse.next();
      }
      
      const url = new URL('/auth/signin', request.url);
      // Only set redirectedFrom if it's not already a signin/signup page
      if (!pathname.startsWith('/auth/')) {
        url.searchParams.set('redirectedFrom', pathname);
      }
      return NextResponse.redirect(url);
    }
    
    // If the path is an admin path, check if the user is an admin
    if (pathname.startsWith('/dashboard/admin')) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profileError) {
          // Log the error in development only
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('Error fetching profile:', profileError);
          }
          throw profileError;
        }
          
        if (profile?.role !== 'admin') {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      } catch (error) {
        // Log the error in development only
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Admin check error:', error);
        }
        // If there's an error checking admin status, redirect to home
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
    
    // If we get here, the user is authenticated and has the correct role
    return NextResponse.next();
  } catch (error) {
    // Log the error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Authentication error:', error);
    }
    // In case of error, redirect to sign in as a fallback
    const url = new URL('/auth/signin', request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - API routes
    // - Static files
    // - _next/static
    // - _next/image
    // - favicon.ico
    '/((?!api|_next/static|_next/image|favicon.ico|site.webmanifest|.*\.(?:ico|png|jpg|jpeg|gif|svg|css|js|json|webmanifest)$).*)',
  ],
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
  }
}

