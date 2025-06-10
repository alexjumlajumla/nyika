'use client';

import { useEffect, useState, useCallback } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useParams, usePathname } from 'next/navigation';
import i18n, { initI18n } from '@/app/i18n/client';

interface I18nProviderProps {
  children: React.ReactNode;
  locale: string;
}

export default function I18nProvider({ children, locale: initialLocale }: I18nProviderProps) {
  const params = useParams();
  const pathname = usePathname();
  const [i18nInstance, setI18nInstance] = useState(i18n);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get the current locale from URL params or props
  const locale = (params?.locale as string) || initialLocale || 'en';

  // Initialize i18n instance
  const initializeI18n = useCallback(async () => {
    try {
      if (!i18nInstance.isInitialized) {
        console.log('[i18n] Initializing i18n...');
        await initI18n(locale);
        setI18nInstance(i18n);
        console.log('[i18n] i18n initialized successfully');
      } else if (i18nInstance.language !== locale) {
        console.log(`[i18n] Changing language to: ${locale}`);
        await i18nInstance.changeLanguage(locale);
      }
    } catch (error) {
      console.warn('[i18n] Warning: i18n initialization had issues, but continuing', error);
    } finally {
      // Always set initialized to true to prevent blocking the app
      setIsInitialized(true);
    }
  }, [i18nInstance, locale]);

  useEffect(() => {
    initializeI18n();
  }, [initializeI18n]);

  // Update the language if it changes
  useEffect(() => {
    if (i18nInstance && i18nInstance.language && i18nInstance.language !== locale) {
      console.log(`[i18n] Language changed to: ${locale}`);
      i18nInstance.changeLanguage(locale).catch(err => {
        console.warn(`[i18n] Failed to change language to ${locale}:`, err);
      });
    }
  }, [locale, i18nInstance]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18nInstance} defaultNS="common">
      {children}
    </I18nextProvider>
  );
}
