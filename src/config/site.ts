// Supported locales
export const locales = ['en', 'fr', 'es'] as const;

export type Locale = typeof locales[number];

// Default locale (used as a fallback)
export const defaultLocale: Locale = 'en';

// Site configuration
export const siteConfig = {
  name: 'Nyika Safaris',
  description: 'Experience the best safaris in Africa with Nyika Safaris',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/images/og-image.jpg',
  twitterImage: '/images/twitter-image.jpg',
  links: {
    twitter: 'https://twitter.com/nyikasafaris',
    facebook: 'https://facebook.com/nyikasafaris',
    instagram: 'https://instagram.com/nyikasafaris',
  },
} as const;
