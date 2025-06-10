'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18nClient } from './client';
import { i18n as i18nType, createInstance } from 'i18next';

export function I18nProvider({
  children,
  initialI18nStore,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialI18nStore: any;
  initialLanguage: string;
}) {
  const [i18n, setI18n] = useState<i18nType | null>(null);

  useEffect(() => {
    const i18nInstance = createInstance();
    initI18nClient(i18nInstance, { 
      resources: initialI18nStore,
      lng: initialLanguage 
    });
    setI18n(i18nInstance);
    
    return () => {
      if (i18nInstance.isInitialized) {
        // @ts-ignore - destroy exists on i18n instance
        i18nInstance.destroy();
      }
    };
  }, [initialI18nStore, initialLanguage]);

  if (!i18n) return null;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
