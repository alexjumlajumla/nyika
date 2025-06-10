import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration
const DEFAULT_LOCALE = 'en';
const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;
  
  // Skip middleware for:
  // 1. API routes
  // 2. Static files
  // 3. Favicon
  // 4. Any path that has a file extension (e.g., /_next/static/...)
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }
  
  // Only handle the root path
  if (pathname === '/') {
    // Get the accept-language header to detect user's preferred language
    const acceptLanguage = request.headers.get('accept-language');
    let locale = DEFAULT_LOCALE;
    
    if (acceptLanguage) {
      // Extract the first language code from the accept-language header
      const preferredLang = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if (preferredLang) {
        locale = preferredLang;
      }
    }
    
    // Redirect to the determined locale or default
    const url = new URL(`/${locale}`, origin);
    // Preserve any query parameters
    url.search = search;
    
    return NextResponse.redirect(url);
  }

  // For all other paths, just continue
  return NextResponse.next();
}

export const config = {
  // Only run on root path and specific paths we want to handle
  matcher: [
    '/',
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
};
