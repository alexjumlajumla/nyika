import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from './routing';

// Define message loaders with proper typing
const messageLoaders = {
  en: () => import('@/messages/en.json').then((mod) => mod.default),
  sw: () => import('@/messages/sw.json').then((mod) => mod.default),
} as const;

// Type for the locale parameter
type Locale = keyof typeof messageLoaders;

// Type guard to check if a string is a valid locale
function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return locale in messageLoaders;
}

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is defined and valid, fallback to default if not
  const validLocale = (locale && isValidLocale(locale)) ? locale : defaultLocale;
  
  // Load messages for the valid locale
  const messages = await messageLoaders[validLocale]();
  
  return {
    messages,
    timeZone: 'Africa/Nairobi',
    locale: validLocale,
  };
});
