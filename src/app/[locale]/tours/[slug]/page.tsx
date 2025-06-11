import { Suspense } from 'react';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { TourDetail } from '@/components/tours/TourDetail';
import { getTourBySlug } from '@/lib/supabase/tours';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const tour = await getTourBySlug(params.slug);
  
  return {
    title: tour?.title || 'Tour Details',
    description: tour?.summary || 'Tour details page',
  };
}

export default async function TourPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  try {
    // Fetch tour data using the shared function
    const tour = await getTourBySlug(params.slug);
    
    if (!tour) {
      notFound();
    }

    return (
      <Suspense fallback={<PageLoader />}>
        <TourDetail tour={tour} />
      </Suspense>
    );
  } catch (error) {
    console.error('Error in TourPage:', error);
    notFound();
  }
}

// Configuration is in config.ts
