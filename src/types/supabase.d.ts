// Import types from the correct path
import type { Accommodation } from './accommodation';

// Extend the Accommodation type to include rooms
export interface AccommodationWithRooms extends Accommodation {
  rooms?: Array<{
    id: string;
    name: string;
    description: string;
    max_occupancy: number;
    price_per_night: number;
    images: string[];
  }>;
}

declare module '@/lib/supabase/accommodations' {
  export function fetchAccommodations(): Promise<Accommodation[]>;
  export function fetchAccommodationBySlug(slug: string): Promise<AccommodationWithRooms | null>;
}
