// Type definitions for site configuration

declare module '@/config/site' {
  export type Locale = 'en' | 'fr' | 'es';
  
  export const locales: readonly Locale[];
  export const defaultLocale: Locale;
  
  export interface SiteConfig {
    name: string;
    description: string;
    url: string;
    ogImage: string;
    twitterImage: string;
    links: {
      twitter: string;
      facebook: string;
      instagram: string;
    };
  }
  
  export const siteConfig: SiteConfig;
}
