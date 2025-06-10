import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { NextResponse as NextResponseType } from 'next/server';

/**
 * Creates a Supabase client configured for middleware
 * @param {NextRequest} request - The incoming request object
 * @returns {ReturnType<typeof createServerClient>} Configured Supabase client
 */
export function createClient(request: NextRequest) {
  // Create a response object to handle cookies
  const response = NextResponse.next();
  
  // Create a Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Set the cookie in the response
          response.cookies.set({
            ...options,
            name,
            value,
          });
        },
        remove(name: string, options: CookieOptions) {
          // Remove the cookie in the response
          response.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Return the Supabase client and the response
  return { supabase, response };
}

/**
 * Handles authentication in middleware
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<{ session: any | null, response: NextResponseType }>} Session and response object
 */
export async function handleAuth(request: NextRequest) {
  const { supabase, response } = createClient(request);
  
  try {
    // Get the session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return { session: null, response };
    }
    
    return { session, response };
  } catch (error) {
    console.error('Authentication error:', error);
    return { session: null, response };
  }
}

/**
 * Creates a redirect response with proper cookies
 * @param {string} url - The URL to redirect to
 * @param {NextResponse} response - The response object
 * @param {string} locale - The current locale
 * @returns {NextResponse} The redirect response
 */
export function createRedirectResponse(
  url: string,
  response: NextResponseType,
  locale: string
): NextResponse {
  // Default to a base URL if response.url is not available
  const defaultBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Try to create a base URL object from the response URL, fallback to default
  let baseUrl: URL;
  try {
    baseUrl = new URL(response.url || defaultBaseUrl);
  } catch (error) {
    console.error('Invalid base URL:', response.url, 'Falling back to default');
    baseUrl = new URL(defaultBaseUrl);
  }
  
  // Create the redirect URL, handling both absolute and relative URLs
  let redirectUrl: URL;
  try {
    // If the URL is already absolute, use it as is
    if (url.startsWith('http')) {
      redirectUrl = new URL(url);
    } else {
      // For relative URLs, resolve against the base URL
      redirectUrl = new URL(url, baseUrl.origin);
    }
  } catch (error) {
    console.error('Invalid redirect URL:', url, 'Falling back to home page');
    // Fall back to the home page if the URL is invalid
    redirectUrl = new URL(`/${locale || 'en'}`, baseUrl.origin);
  }
  
  // Create the redirect response
  const redirectResponse = NextResponse.redirect(redirectUrl, { status: 307 });
  
  // Copy cookies from the original response to the redirect response
  response.cookies.getAll().forEach(cookie => {
    const { name, value, ...options } = cookie;
    redirectResponse.cookies.set({
      ...options,
      name,
      value,
    });
  });
  
  // Add localized headers
  redirectResponse.headers.set('Content-Language', locale);
  redirectResponse.headers.set('Vary', 'Accept-Language');
  
  return redirectResponse;
}
