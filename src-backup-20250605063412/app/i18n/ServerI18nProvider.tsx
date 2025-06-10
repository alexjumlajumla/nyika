import { ReactNode } from 'react';
import { I18nProvider as I18nProviderClient } from './Provider';
import { I18nProvider as I18nProviderServer } from './server';
import { fallbackLng } from './settings';
import i18next, { i18n } from 'i18next';

interface ServerI18nProviderProps {
  children: ReactNode;
  locale: string;
  namespaces?: string[];
}

export async function ServerI18nProvider({
  children,
  locale,
  namespaces = ['common'],
}: ServerI18nProviderProps) {
  // On the server, we use the server-side i18n
  if (typeof window === 'undefined') {
    const i18nInstance = i18next.createInstance();
    await I18nProviderServer({
      locale: locale || fallbackLng,
      namespaces,
      children: null,
    });
    
    // Get the initialized store from the instance
    const initialI18nStore = i18nInstance.services.resourceStore.data;
    
    return (
      <I18nProviderClient
        initialI18nStore={initialI18nStore}
        initialLanguage={locale}
      >
        {children}
      </I18nProviderClient>
    );
  }

  // On the client, we use the client-side i18n
  return (
    <I18nProviderClient
      initialI18nStore={window.__NEXT_DATA__?.props?.pageProps?._nextI18Next?.initialI18nStore || {}}
      initialLanguage={locale}
    >
      {children}
    </I18nProviderClient>
  );
}
