'use client';

import { useQuery } from '@tanstack/react-query';
import { getFeaturedTours, getTourById, getTours } from '@/services/tourService';

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: getTours,
  });
}

export function useFeaturedTours() {
  return useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: getFeaturedTours,
  });
}

export function useTour(tourId: string) {
  return useQuery({
    queryKey: ['tours', tourId],
    queryFn: () => getTourById(tourId),
    enabled: !!tourId,
  });
}
