import { Accommodation } from '@/types/accommodation';
import AccommodationDetailClient from './AccommodationDetailClient';

interface AccommodationDetailProps {
  accommodation: Accommodation;
}

export default function AccommodationDetail({ accommodation }: AccommodationDetailProps) {
  return <AccommodationDetailClient accommodation={accommodation} />;
}
