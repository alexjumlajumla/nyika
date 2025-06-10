/**
 * Supported locales in the application
 * @type {readonly [string, ...string[]]}
 */
export const appLocales = ['en', 'sw'] as const;

/**
 * Type representing a supported locale
 */
export type Locale = (typeof appLocales)[number];

/**
 * The default locale to be used when no locale is specified
 */
export const defaultLocale: Locale = 'en';

/**
 * Type guard to check if a string is a valid locale
 * @param {string | undefined} locale - The locale to check
 * @returns {boolean} True if the locale is valid
 */
export function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return (appLocales as readonly string[]).includes(locale);
}

/**
 * Type for our translation messages
 */
export type Messages = Record<string, string | Record<string, string>>;
