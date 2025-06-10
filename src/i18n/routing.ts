// Define the locales as a const array for type safety
export const locales = ['en', 'sw'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';
export const localePrefix = 'as-needed' as const;

// Type guard to check if a string is a valid locale
export function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return (locales as readonly string[]).includes(locale as Locale);
}

// Re-export the routing configuration for use in middleware
export const routingConfig = {
  locales: [...locales],
  defaultLocale,
  localePrefix,
  localeDetection: true,
};
