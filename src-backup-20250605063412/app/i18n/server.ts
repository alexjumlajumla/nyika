'server-only';

import React from 'react';
import { i18n } from 'i18next';
import { createInstance } from 'i18next';
import { initI18nServer } from './settings';
import { Language } from './settings';

/**
 * Get server-side i18n instance
 */
export async function getI18n(lng: Language, ns: string | string[] = 'common'): Promise<i18n> {
  return await initI18nServer(lng, ns);
}

/**
 * Server component wrapper that initializes i18n
 */
interface I18nProviderProps {
  locale: Language;
  namespaces?: string | string[];
  children: React.ReactNode;
}

export async function I18nProvider({
  locale,
  namespaces = ['common'],
  children,
}: I18nProviderProps) {
  await initI18nServer(locale, namespaces);
  return children;
}
