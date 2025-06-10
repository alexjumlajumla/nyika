import { locales, defaultLocale, type Locale } from './i18n';
import { NextResponse } from 'next/server';

/**
 * Validates if a string is a valid locale
 */
export function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return locales.includes(locale as Locale);
}

/**
 * Gets the locale from the URL path or returns the default locale
 * @param pathname The pathname to extract the locale from
 * @returns The extracted locale or the default locale
 */
export function getLocaleFromPathname(pathname: string): Locale {
  // Remove leading slash if present
  const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const [maybeLocale] = cleanPath.split('/');
  
  if (!maybeLocale) {
    return defaultLocale;
  }
  
  return isValidLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

/**
 * Gets the path without the locale prefix
 * @param pathname The full pathname including the locale
 * @returns The path without the locale prefix
 */
export function getPathWithoutLocale(pathname: string): string {
  // Remove leading slash if present
  const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  const pathParts = cleanPath.split('/');
  
  // If the first part is a valid locale, remove it
  if (pathParts.length > 0 && isValidLocale(pathParts[0])) {
    const [, ...rest] = pathParts;
    const path = rest.join('/');
    return path ? `/${path}` : '/';
  }
  
  // If no valid locale is found, return the original path
  return pathname;
}

/**
 * Gets the URL with the specified locale
 */
export function getLocalizedUrl(
  pathname: string,
  targetLocale: Locale,
  searchParams?: URLSearchParams
): string {
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const search = searchParams?.toString() ? `?${searchParams.toString()}` : '';
  
  // Don't prefix the default locale
  if (targetLocale === defaultLocale) {
    return `${pathWithoutLocale}${search}`;
  }
  
  return `/${targetLocale}${pathWithoutLocale}${search}`;
}

/**
 * Validates the locale and returns it if valid, otherwise returns the default locale
 * @param locale The locale to validate
 * @returns The validated locale or the default locale
 */
export function validateLocale(locale: string | undefined): Locale {
  if (!locale || !isValidLocale(locale)) {
    console.warn(`Invalid locale: ${locale}, falling back to ${defaultLocale}`);
    return defaultLocale;
  }
  return locale;
}

/**
 * Creates a URL for the localized version of the current path
 * @param request The incoming request object
 * @param targetLocale The target locale to redirect to
 * @returns A URL object for the localized path
 */
export function createLocalizedUrl(
  request: Request,
  targetLocale: Locale
): URL {
  const { pathname, search } = new URL(request.url);
  const searchParams = new URLSearchParams(search);
  const path = getLocalizedUrl(pathname, targetLocale, searchParams);
  return new URL(path, request.url);
}

/**
 * Creates a redirect response to the localized version of the current URL
 * @param request The incoming request object
 * @param targetLocale The target locale to redirect to
 * @returns A NextResponse redirect to the localized URL
 */
export function redirectToLocalizedUrl(
  request: Request,
  targetLocale: Locale
): never {
  const url = createLocalizedUrl(request, targetLocale);
  return NextResponse.redirect(url, { status: 307 }) as never;
}

/**
 * Gets the display name of a locale
 * @param locale The locale code to get the display name for
 * @param displayLocale The locale to use for the display name (defaults to the locale itself)
 * @returns The display name of the locale
 */
export function getLocaleDisplayName(
  locale: Locale,
  displayLocale: string = locale
): string {
  try {
    const displayName = new Intl.DisplayNames([displayLocale], {
      type: 'language',
      languageDisplay: 'standard',
    }).of(locale);
    
    // Capitalize the first letter for better display
    return displayName ? displayName.charAt(0).toUpperCase() + displayName.slice(1) : locale;
  } catch (error) {
    console.error(`Error getting display name for locale ${locale}:`, error);
    return locale;
  }
}

/**
 * Gets all available locales with their display names
 * @param displayLocale The locale to use for the display names (defaults to 'en')
 * @returns An array of objects with locale code and display name
 */
export function getAvailableLocales(
  displayLocale: string = 'en'
): Array<{ code: Locale; name: string; nativeName: string }> {
  return locales.map((locale) => ({
    code: locale,
    name: getLocaleDisplayName(locale, displayLocale),
    nativeName: getLocaleDisplayName(locale, locale),
  }));
}

/**
 * Gets the current locale from the request
 * @param request The incoming request object
 * @returns The current locale from the URL or the default locale
 */
export function getRequestLocale(request: Request): Locale {
  const url = new URL(request.url);
  return getLocaleFromPathname(url.pathname);
}

/**
 * Creates a response with localized headers
 * @param response The response to add headers to
 * @param locale The locale to set in the headers
 * @returns The response with localized headers
 */
export function withLocalizedHeaders(
  response: NextResponse,
  locale: Locale
): NextResponse {
  // Add Vary header to ensure proper caching
  response.headers.set('Vary', 'Accept-Language');
  
  // Add Content-Language header
  response.headers.set('Content-Language', locale);
  
  // Add Link header for alternate language versions
  const url = new URL(response.headers.get('Location') || '/', 'http://example.com');
  const links = locales
    .filter((l) => l !== locale)
    .map((l) => {
      const altUrl = new URL(url);
      altUrl.pathname = `/${l}${url.pathname}`.replace(/\/+/g, '/');
      return `<${altUrl.toString()}>; rel="alternate"; hreflang="${l}"`;
    });
  
  if (links.length > 0) {
    response.headers.set('Link', links.join(', '));
  }
  
  return response;
}
