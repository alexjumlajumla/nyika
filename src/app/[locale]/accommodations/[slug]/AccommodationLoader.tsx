'use client';

import dynamic from 'next/dynamic';
import { Accommodation } from '@/types/accommodation';

const AccommodationClient = dynamic(
  () => import('./AccommodationClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    ),
  }
);

interface AccommodationLoaderProps {
  initialData: Accommodation;
  slug: string;
}

export default function AccommodationLoader({ initialData, slug }: AccommodationLoaderProps) {
  return <AccommodationClient initialData={initialData} slug={slug} />;
}
