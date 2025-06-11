'use client';

import dynamic from 'next/dynamic';
import { AccommodationWithRelations } from '../../lib/supabase/accommodations';

interface AccommodationsListClientProps {
  initialAccommodations: AccommodationWithRelations[];
}

// Dynamically import AccommodationsList with SSR disabled
const AccommodationsList = dynamic<AccommodationsListClientProps>(
  () => import('./AccommodationsList').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="h-48 animate-pulse bg-gray-200"></div>
            <div className="p-4">
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mb-4 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-3 w-full animate-pulse rounded bg-gray-100"></div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div>
                <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }
);

const AccommodationsListClient = ({ initialAccommodations }: AccommodationsListClientProps) => {
  return <AccommodationsList initialAccommodations={initialAccommodations} />;
};

export default AccommodationsListClient;
