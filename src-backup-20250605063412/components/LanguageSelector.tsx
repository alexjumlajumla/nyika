'use client';

import { useTranslation } from 'react-i18next';
import { useLanguageSwitcher } from '@/lib/i18n-utils';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = '' }: LanguageSelectorProps) {
  const { changeLanguage, currentLocale } = useLanguageSwitcher();
  const { t } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    changeLanguage(newLocale);
  };

  return (
    <select
      value={currentLocale}
      onChange={handleLanguageChange}
      className={`focus:ring-safari-brown rounded-md border border-gray-300 bg-white px-2 py-1 pr-8 text-sm text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 ${className}`}
      aria-label={t('common.languageSelector')}
    >
      <option value="en">{t('language.en')}</option>
      <option value="sw">{t('language.sw')}</option>
    </select>
  );
}
