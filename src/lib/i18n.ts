// This file serves as a central export point for all i18n utilities
// It re-exports everything from the individual i18n modules

// Import types and values for local use
import { defaultLocale as defaultLocaleFromRouting } from '@/i18n/routing';

// Re-export everything except what we're overriding
export {
  locales,
  type Locale,
  localePrefix,
  routingConfig,
  // Don't re-export defaultLocale and isValidLocale as we're providing our own
} from '@/i18n/routing';

export * from '@/i18n/navigation';

// Type guard for locale validation
function isValidLocale(locale: string | undefined): boolean {
  if (!locale) return false;
  return ['en', 'sw'].includes(locale);
}

// Re-export defaultLocale with our own name to avoid conflicts
const defaultLocale = defaultLocaleFromRouting;

/**
 * Gets the current locale from a pathname
 * @param pathname - The URL pathname
 * @returns The locale from the pathname or default locale if not found
 */
export function getCurrentLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  
  return isValidLocale(locale) ? locale : defaultLocale;
}
