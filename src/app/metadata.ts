import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Nyika Safaris',
    template: '%s | Nyika Safaris',
  },
  description: 'Experience the best safaris in Africa with Nyika Safaris.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nyikasafaris.com'),
  keywords: [
    'safari',
    'africa',
    'travel',
    'tours',
    'wildlife',
    'adventure',
    'luxury safari',
    'african safari',
  ],
  openGraph: {
    title: 'Nyika Safaris - Unforgettable African Adventures',
    description: 'Experience the best safaris in Africa with Nyika Safaris.',
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Nyika Safaris',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nyika Safaris - Unforgettable African Adventures',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nyika Safaris - Unforgettable African Adventures',
    description: 'Experience the best safaris in Africa with Nyika Safaris.',
    images: ['/images/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
