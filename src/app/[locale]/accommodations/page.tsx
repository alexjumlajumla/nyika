import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { fetchAccommodations } from '@/lib/supabase/accommodations';
import AccommodationsListClient from '@/components/accommodations/AccommodationsListClient';

type AccommodationsTranslations = {
  title: string;
  description: string;
};

type PageProps = {
  params: { locale?: string };
};

export default async function AccommodationsPage({ params }: PageProps) {
  const { locale = 'en' } = params;
  
  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get translations with proper typing
  const t = getTranslations('AccommodationsPage') as unknown as AccommodationsTranslations;

  // Fetch accommodations from the database
  const initialAccommodations = await fetchAccommodations();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {t.title || 'Our Accommodations'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t.description || 'Discover our handpicked selection of premium accommodations across Africa'}
        </p>
      </div>
      <AccommodationsListClient initialAccommodations={initialAccommodations} />
    </main>
  );
}

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}
