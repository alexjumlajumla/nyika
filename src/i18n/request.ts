import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { defaultLocale, isValidLocale } from '@/lib/i18n';

/**
 * Request configuration for next-intl
 * This is the default path where next-intl looks for the request configuration
 */
export default getRequestConfig(async ({ locale: localeParam }) => {
  // Cast to string to ensure it's not undefined
  const locale = localeParam as string;
  
  // Validate that the locale is valid
  if (!isValidLocale(locale)) {
    console.error(`Invalid locale in request config: ${locale}`);
    notFound();
    // The following line is unreachable due to notFound() but makes TypeScript happy
    return { messages: {}, locale: defaultLocale };
  }

  try {
    // Import messages for the requested locale
    const messages = (await import(`@/messages/${locale}/common.json`)).default;
    
    return {
      messages,
      timeZone: 'Africa/Nairobi',
      now: new Date(),
      locale, // TypeScript now knows this is a valid Locale
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
    // The following line is unreachable due to notFound() but makes TypeScript happy
    return { messages: {}, locale: defaultLocale };
  }
});
