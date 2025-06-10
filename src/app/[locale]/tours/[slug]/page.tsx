import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { TourDetail } from '@/components/tours/TourDetail';
import type { Tour } from '@/types/tour';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const supabase = createServerClient();
  
  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!tour) {
    return {
      title: 'Tour Not Found',
    };
  }

  return {
    title: `${tour.title} | Nyika Safaris`,
    description: tour.description,
    openGraph: {
      title: tour.title,
      description: tour.description,
      images: [
        {
          url: tour.coverImage || tour.images?.[0] || '',
          width: 1200,
          height: 630,
          alt: tour.title,
        },
      ],
    },
  };
}

export default async function TourPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations('TourPage');
  const supabase = createServerClient();
  
  const { data: tour, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !tour) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">{t('notFound')}</h1>
        <p className="mt-4">{t('tourNotFound')}</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <TourDetail tour={tour as Tour} />
    </Suspense>
  );
}

// For static generation, we'll use ISR (Incremental Static Regeneration)
// instead of pre-generating all possible pages at build time
// This function will be called at runtime when a page is requested
// and the result will be cached for future requests
export const dynamicParams = true; // Enable dynamic params for ISR

export async function generateStaticParams() {
  // Return an empty array to disable pre-generation of all pages at build time
  // This will make Next.js fall back to on-demand generation with ISR
  return [];
  
  // If you want to pre-generate specific pages, you can return them here:
  // return [
  //   { slug: 'popular-tour-1' },
  //   { slug: 'popular-tour-2' },
  // ];
}
