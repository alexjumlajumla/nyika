'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { type Locale, locales, defaultLocale, getLocalizedUrl } from '@/lib/i18n';

/**
 * Hook to handle locale-related functionality in client components
 */
export function useLocale() {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Changes the current locale and navigates to the localized URL
   */
  const changeLocale = useCallback((newLocale: Locale) => {
    if (!pathname) return;
    const newUrl = getLocalizedUrl(pathname, newLocale);
    router.push(newUrl);
  }, [pathname, router]);

  /**
   * Gets the current locale from the URL path
   */
  const currentLocale = (() => {
    const maybeLocale = pathname.split('/')[1];
    return locales.includes(maybeLocale as Locale) ? (maybeLocale as Locale) : defaultLocale;
  })();

  /**
   * Gets all available locales with their display names
   */
  const availableLocales = locales.map((locale) => ({
    code: locale,
    name: new Intl.DisplayNames([locale], { type: 'language' }).of(locale) || locale,
    isCurrent: locale === currentLocale,
  }));

  return {
    /** Current locale */
    locale: currentLocale,
    /** All available locales with metadata */
    locales: availableLocales,
    /** Change the current locale */
    changeLocale,
    /** Check if a locale is the current one */
    isCurrentLocale: (locale: Locale) => locale === currentLocale,
    /** Get the localized URL for a given path and locale */
    getLocalizedUrl: (path: string, locale: Locale) => getLocalizedUrl(path, locale),
  };
}

/**
 * Hook to get the current locale
 * @deprecated Use useLocale instead
 */
export function useCurrentLocale(): Locale {
  const pathname = usePathname();
  const maybeLocale = pathname.split('/')[1];
  return locales.includes(maybeLocale as Locale) ? (maybeLocale as Locale) : defaultLocale;
}
