'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useCallback } from 'react';

// Import types and constants from i18n config
import { type Locale, locales } from '@/lib/i18n';

const defaultLocale: Locale = 'en';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Language switcher component that allows users to change the current language
 */
export function LanguageSwitcher({ 
  className = ''
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  
  // Get the current locale from the URL
  const currentLocale = (() => {
    if (!pathname) return defaultLocale;
    const maybeLocale = pathname.split('/')[1] as Locale;
    return locales.includes(maybeLocale) ? maybeLocale : defaultLocale;
  })();

  /**
   * Changes the current locale and navigates to the localized URL
   */
  const changeLocale = useCallback((newLocale: Locale) => {
    if (!pathname) return;
    
    const segments = pathname.split('/');
    
    // Replace or add the locale segment
    if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale; // Replace existing locale
    } else {
      segments.splice(1, 0, newLocale); // Insert new locale after the first slash
    }
    
    const newPath = segments.join('/');
    window.location.href = newPath;
  }, [pathname]);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {locales.map((locale) => (
        <Button
          key={locale}
          variant={currentLocale === locale ? 'outline' : 'ghost'}
          size="sm"
          className={`h-8 px-2 text-xs font-medium ${
            currentLocale === locale 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30' 
              : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
          }`}
          onClick={() => changeLocale(locale)}
        >
          <span className="flex items-center gap-1">
            {currentLocale === locale && <Globe className="h-3 w-3" />}
            {locale.toUpperCase()}
          </span>
        </Button>
      ))}
    </div>
  );
}
