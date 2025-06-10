// Type definitions for locale utilities

import { Locale } from '@/config/site';

declare module '@/lib/utils/locale' {
  export function isValidLocale(locale: string | undefined): locale is Locale;
  export function getDefaultLocale(): Locale;
  export function formatLocale(locale: Locale): string;
  export function getBrowserLocale(): string | undefined;
  export function getBestMatchingLocale(preferredLocale?: string): Locale;
}
