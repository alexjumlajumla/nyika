'use client';

import { useFeaturedTours } from '@/hooks/useTours';
import { Skeleton } from '@/components/ui/skeleton';
import { TourCard } from '@/components/tours/TourCardSimple';

export function FeaturedTours() {
  const { data: tours, isLoading, error } = useFeaturedTours();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Failed to load featured tours. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tours?.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
