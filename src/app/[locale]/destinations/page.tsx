import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import FeaturedDestinations from '@/components/FeaturedDestinations';
import { locales, type Locale } from '@/i18n/routing';

type PageProps = {
  params: { locale?: string };
};

export default async function DestinationsPage({ params }: PageProps) {
  const { locale = 'en' } = params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get translations
  const t = await getTranslations({ locale, namespace: 'DestinationsPage' });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>
      <FeaturedDestinations />
    </main>
  );
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}
