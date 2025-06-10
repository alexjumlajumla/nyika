'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { fallbackLng, languages } from './settings';

export function useTranslation(ns: string | string[] = 'common') {
  const { t, i18n, ready } = useI18nTranslation(ns);
  
  // Helper to change language
  const changeLanguage = (lng: string) => {
    if (!languages.includes(lng as any)) {
      console.warn(`Language "${lng}" is not supported. Falling back to ${fallbackLng}.`);
      lng = fallbackLng;
    }
    return i18n.changeLanguage(lng);
  };

  return {
    t: (key: string, options?: Record<string, any>) => t(key, options),
    i18n,
    ready,
    changeLanguage,
    language: i18n.language,
    languages: [...languages],
  };
}
