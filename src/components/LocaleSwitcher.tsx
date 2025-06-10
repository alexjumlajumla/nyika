'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/lib/i18n';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  // Remove the current locale from the pathname
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');

  const switchLocale = (locale: string) => {
    // Redirect to the new locale with the same path
    const newPath = `/${locale}${pathWithoutLocale}`.replace(/\/+/g, '/');
    router.push(newPath);
  };

  return (
    <div className="flex items-center space-x-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentLocale === locale
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          disabled={currentLocale === locale}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
