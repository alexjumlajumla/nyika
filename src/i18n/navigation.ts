import { usePathname } from 'next/navigation';
import { routing, type Locale } from './routing';

// Re-export types
export type { Locale };

// Simple hook to get the current locale from the URL
export function useCurrentLocale(): Locale {
  const pathname = usePathname() || '';
  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  
  return isValidLocale(maybeLocale) ? maybeLocale : routing.defaultLocale;
}

// Hook to get the path without the locale prefix
export function usePathWithoutLocale(): string {
  const pathname = usePathname() || '';
  const locale = useCurrentLocale();
  return pathname.replace(new RegExp(`^/${locale}`), '') || '/';
}

// Helper to create localized paths
export function localizePath(path: string, locale: Locale = routing.defaultLocale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}${cleanPath ? `/${cleanPath}` : ''}`;
}

// Type guard to check if a string is a valid locale
export function isValidLocale(locale: string | undefined): locale is Locale {
  return routing.locales.includes(locale as Locale);
}

// Simple redirect function that preserves the locale
export function redirect(path: string): never {
  window.location.href = path;
  // This is a type assertion to satisfy TypeScript's control flow analysis
  throw new Error('Redirecting...');
}
