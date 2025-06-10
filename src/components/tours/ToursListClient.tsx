'use client';

import dynamic from 'next/dynamic';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { TourCardProps } from '@/app/[locale]/tours/page';

interface ToursListClientProps {
  initialTours: TourCardProps[];
  searchParams?: {
    search?: string;
    destinations?: string | string[];
    minPrice?: string;
    maxPrice?: string;
  };
  locale: string;
}

// Dynamically import the ToursList component with no SSR
const ToursList = dynamic(
  () => import('./ToursList'),
  { 
    ssr: false,
    loading: () => <PageLoader />
  }
);

export default function ToursListClient({
  initialTours,
  searchParams = {},
  locale
}: ToursListClientProps) {
  return (
    <ToursList 
      initialTours={initialTours} 
      searchParams={searchParams}
      locale={locale}
    />
  );
}
