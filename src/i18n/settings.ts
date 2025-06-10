export const locales = ['en', 'sw'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as ReadonlyArray<string>).includes(value);
}

// Helper to get locale from pathname
export function getLocaleFromPathname(pathname: string): Locale {
  const parts = pathname.split('/');
  const maybeLocale = parts[1];
  return isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

// Helper to get path without locale
export function getPathWithoutLocale(pathname: string): string {
  const parts = pathname.split('/');
  const maybeLocale = parts[1];
  
  if (isLocale(maybeLocale)) {
    return '/' + parts.slice(2).join('/');
  }
  
  return pathname;
}

// Helper to add locale to path
export function localizePath(
  pathname: string, 
  locale: Locale = defaultLocale
): string {
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  return `/${locale}${pathWithoutLocale}`;
}
