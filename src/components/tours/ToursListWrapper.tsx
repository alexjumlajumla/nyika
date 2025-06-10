'use client';

import dynamic from 'next/dynamic';
import type { TourCardProps } from './NewTourCard';
import SkeletonList from './SkeletonList';

interface ToursListWrapperProps {
  initialTours: TourCardProps[];
}

// This is a client component that wraps the dynamic import
export default function ToursListWrapper({ initialTours }: ToursListWrapperProps) {
  const ToursList = dynamic<{ initialTours: TourCardProps[] }>(
    () => import('./ToursList'),
    {
      ssr: false,
      loading: () => <SkeletonList />,
    }
  );

  return <ToursList initialTours={initialTours} />;
}
