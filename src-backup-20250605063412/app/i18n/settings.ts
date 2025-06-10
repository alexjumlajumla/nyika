import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';

export const fallbackLng = 'en' as const;
export const defaultLocale = fallbackLng;

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'de', name: 'Deutsch' },
] as const;

export const locales = languages.map((l) => l.code) as readonly string[];
export type Language = (typeof languages)[number]['code'];
export const defaultNS = 'common' as const;

// Server-side initialization
export async function initI18nServer(
  lng: Language = fallbackLng,
  ns: string | string[] = defaultNS
) {
  const i18nInstance = createInstance();
  
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng,
      fallbackLng,
      supportedLngs: locales,
      defaultNS,
      fallbackNS: defaultNS,
      ns,
      interpolation: {
        escapeValue: false,
      },
      debug: process.env.NODE_ENV === 'development',
    });

  return i18nInstance;
}

// Client-side initialization
export function createI18nClient() {
  return createInstance({
    fallbackLng,
    supportedLngs: locales,
    defaultNS,
    fallbackNS: defaultNS,
    interpolation: {
      escapeValue: false,
    },
    debug: process.env.NODE_ENV === 'development',
  });
}

export function getOptions(lng: Language = fallbackLng, ns: string | string[] = defaultNS) {
  return {
    lng,
    ns,
    fallbackLng,
    supportedLngs: locales,
    defaultNS,
    fallbackNS: defaultNS,
  };
}
