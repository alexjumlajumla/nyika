// src/app/[locale]/tours/page.tsx
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/routing';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { logger } from '@/lib/logger';
import { getTours } from '@/lib/supabase/tours';
import { Tour } from '@/types/tour';
import { Suspense } from 'react';
import ToursListClient from '@/components/tours/ToursListClient';

export const revalidate = 3600; // Revalidate every hour

// Re-export the Tour type for use in other components
export type { Tour };

// Define the TourCardProps interface based on the TourCard component's expected props
export interface TourCardProps {
  id: string | number;
  title: string;
  slug: string;
  duration: number;
  price: number;
  ratingsAverage: number;
  ratingsQuantity: number;
  imageCover: string;
  destinations: string[];
  isFeatured?: boolean;
  discount?: number;
  originalPrice?: number;
}

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Validate the locale
  if (!locales.includes(params.locale)) {
    notFound();
  }

  try {
    // Fetch tours data on the server
    const data = await getTours();
    
    // Transform the data to match the expected TourCardProps
    const tourCards: TourCardProps[] = data.map((tour: any) => ({
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      duration: Number(tour.duration_days) || 1,
      price: Number(tour.price) || 0,
      ratingsAverage: Number(tour.ratings_average) || 0,
      ratingsQuantity: Number(tour.ratings_count) || 0,
      imageCover: tour.image_cover || '/images/placeholder.jpg',
      destinations: Array.isArray(tour.destinations) 
        ? tour.destinations 
        : [tour.destinations].filter(Boolean),
      isFeatured: Boolean(tour.is_featured),
      discount: tour.discount ? Number(tour.discount) : undefined,
      originalPrice: tour.original_price ? Number(tour.original_price) : undefined,
    }));

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<PageLoader />}>
          <ToursListClient 
            initialTours={tourCards} 
            searchParams={searchParams} 
            locale={params.locale}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    logger.error('Error fetching tours:', error);
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading tours</h1>
        <p className="text-gray-600">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }
}