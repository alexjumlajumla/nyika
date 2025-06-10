import { Locale, locales } from '@/config/site';

/**
 * Type guard to check if a string is a valid locale
 */
export function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return (locales as readonly string[]).includes(locale);
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): Locale {
  return 'en';
}

/**
 * Format locale for display
 */
export function formatLocale(locale: Locale): string {
  return new Intl.DisplayNames([locale], { type: 'language' }).of(locale) || locale;
}

/**
 * Get browser's preferred locale
 */
export function getBrowserLocale(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const nav = window.navigator;
  const browserLocale = nav.language || (nav.languages && nav.languages[0]);
  
  if (!browserLocale) return undefined;
  
  // Extract base language (e.g., 'en' from 'en-US')
  return browserLocale.split('-')[0];
}

/**
 * Get the best matching locale from available locales
 */
export function getBestMatchingLocale(preferredLocale?: string): Locale {
  if (preferredLocale && isValidLocale(preferredLocale)) {
    return preferredLocale;
  }
  
  const browserLocale = getBrowserLocale();
  if (browserLocale && isValidLocale(browserLocale as Locale)) {
    return browserLocale as Locale;
  }
  
  return getDefaultLocale();
}
