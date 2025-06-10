'use client';

import { Tour } from '@/types/tour';
import TourDetail from './TourDetail';

interface TourDetailClientProps {
  tour: Tour;
}

export default function TourDetailClient({ tour }: TourDetailClientProps) {
  return <TourDetail tour={tour} />;
}
