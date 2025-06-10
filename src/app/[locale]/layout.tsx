import { ReactNode } from 'react';
import { Locale, locales } from '@/i18n/routing';
import { ClientLayout } from '@/components/ClientLayout';

import '@/app/globals.css';

// Type guard to check if a string is a valid locale
function isValidLocale(locale: string | undefined): locale is Locale {
  if (!locale) return false;
  return (locales as readonly string[]).includes(locale as Locale);
}

// Import Metadata type from next
import type { Metadata as NextMetadata } from 'next';

// Define our custom metadata properties
interface CustomMetadata {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    locale: string;
    url: string;
    siteName: string;
  };
  alternates?: {
    canonical: string;
    languages: Record<string, string>;
  };
}

// Extend the Metadata type to include our custom properties
type Metadata = NextMetadata & CustomMetadata;

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { locale?: string } }): Promise<Metadata> {
  // Safely get locale from params with fallback
  const locale = await Promise.resolve(params?.locale || 'en');
  const currentLocale = isValidLocale(locale) ? locale : 'en';

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: 'Nyika Safaris',
    description: 'Experience the best safaris in Africa with Nyika Safaris',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${currentLocale}`,
      languages: locales.reduce((acc, loc) => ({
        ...acc,
        [loc]: `/${loc}`,
      }), {}),
    },
    openGraph: {
      title: 'Nyika Safaris',
      description: 'Experience the best safaris in Africa with Nyika Safaris',
      type: 'website',
      locale: currentLocale.replace('-', '_').toLowerCase(),
      url: `/${currentLocale}`,
      siteName: 'Nyika Safaris',
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Nyika Safaris',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Nyika Safaris',
      description: 'Experience the best safaris in Africa with Nyika Safaris',
      images: [`${baseUrl}/images/twitter-image.jpg`],
    },
  };
}

// Layout wrapper that will be used by ClientLayout
const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// This is a server component that handles data fetching and passes props to client components
// It doesn't render any JSX directly to avoid hydration issues
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate locale
  const locale = isValidLocale(params.locale) ? params.locale : 'en';
  
  // Handle root path - redirect to default locale
  if (!params.locale) {
    // This will be handled by the middleware, but we'll handle it here too for safety
    return null;
  }
  
  // Dynamically import messages for the current locale
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to English if the locale file doesn't exist
    if (process.env.NODE_ENV === 'development') {
      // Only log in development using a custom logger
      const logError = (message: string, err: unknown) => {
        // Using a function to encapsulate the console.error call
        // This helps with tree-shaking in production
        // eslint-disable-next-line no-console
        console.error(message, err);
      };
      logError(`[i18n] Failed to load messages for locale: ${locale}`, error);
    }
    messages = (await import('@/messages/en.json')).default;
  }

  // Pass data to client components as props
  return (
    <ClientLayout locale={locale} messages={messages}>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </ClientLayout>
  );
}
