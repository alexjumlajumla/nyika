'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, Language } from '@/app/i18n/settings';

export function I18nProvider({ 
  children,
  lng = 'en' 
}: { 
  children: React.ReactNode;
  lng?: string;
}) {
  const [instance, setInstance] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const i18nInstance = await initI18n(lng as Language);
        setInstance(i18nInstance);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
      } finally {
        setInitialized(true);
      }
    };

    init();
  }, [lng]);

  if (!initialized) {
    return <div>Loading translations...</div>;
  }

  if (!instance) {
    return <div>Error loading translations</div>;
  }

  return (
    <I18nextProvider i18n={instance}>
      {children}
    </I18nextProvider>
  );
}
