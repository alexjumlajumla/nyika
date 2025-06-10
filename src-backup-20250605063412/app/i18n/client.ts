'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Define i18n settings to match next.config.js
const fallbackLng = 'en';
const defaultNS = 'common';

// Create a simple i18n client
const createI18nClient = () => {
  return i18n.createInstance({
    fallbackLng,
    defaultNS,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable Suspense for better error handling
    },
  });
};

// Create a new i18n instance for the client
const i18nInstance = createI18nClient();

// Initialize the i18n instance
const initI18nClient = async (locale = fallbackLng) => {
  if (i18nInstance.isInitialized) {
    if (i18nInstance.language !== locale) {
      await i18nInstance.changeLanguage(locale);
    }
    return i18nInstance;
  }
  
  try {
    await i18nInstance
      .use(initReactI18next)
      .use(LanguageDetector)
      .use(Backend)
      .init({
        fallbackLng,
        defaultNS,
        lng: locale,
        debug: false, // Disable debug output to reduce console noise
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          caches: ['localStorage'],
          lookupLocalStorage: 'i18nextLng',
        },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        // Add missing key handling
        saveMissing: false,
        missingKeyNoValueFallbackToKey: true,
        // Disable loading of namespaces not in use
        ns: ['common'],
        fallbackNS: 'common',
        // Skip loading translations if they're not available
        react: {
          useSuspense: false,
        },
        // Add a simple fallback for missing translations
        parseMissingKeyHandler: (key) => {
          console.warn(`Missing translation: ${key}`);
          return key;
        }
      });
    
    return i18nInstance;
  } catch (error) {
    console.warn('i18n initialization warning (continuing without translations):', error);
    // Return the instance even if initialization fails
    return i18nInstance;
  }
};

// Export the i18n instance and initialization function
export { i18nInstance as i18n, initI18nClient as initI18n };
export default i18nInstance;
