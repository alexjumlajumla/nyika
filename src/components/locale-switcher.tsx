'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { locales, isValidLocale } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Globe } from 'lucide-react';

function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    if (!isValidLocale(newLocale) || newLocale === locale) return;
    
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '');
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  // Don't render anything if there's only one locale
  if (locales.length <= 1) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('switchLanguage')}</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {locales.map((loc) => (
          <DropdownMenu.Item
            key={loc}
            disabled={loc === locale}
            onSelect={() => switchLocale(loc)}
            className="cursor-pointer"
          >
            {t(`languages.${loc}`)}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default LocaleSwitcher;
