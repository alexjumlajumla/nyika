import { createServerClient } from './server';
import type { Accommodation } from '@/types/accommodation';

// Helper function to check if the accommodations table exists and has the correct structure
async function checkTableStructure() {
  try {
    const supabase = createServerClient();
    
    // Check if the table exists by querying its structure
    const { error } = await supabase
      .from('accommodations')
      .select('*')
      .limit(1);
    
    if (error) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

// Fetch all accommodations
export async function fetchAccommodations(): Promise<Accommodation[]> {
  try {
    // First, check if the table exists and has the correct structure
    const tableExists = await checkTableStructure();
    if (!tableExists) {
      return [];
    }
    
    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('accommodations')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    return data;
  } catch {
    return [];
  }
}

// Fetch a single accommodation by slug with its rooms
export async function fetchAccommodationBySlug(slug: string): Promise<AccommodationWithRooms | null> {
  try {
    const supabase = createServerClient();
    
    // First, get the accommodation
    const { data: accommodation, error: accommodationError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (accommodationError || !accommodation) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error fetching accommodation:', accommodationError);
      }
      return null;
    }
    
    // Then get the related rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('accommodation_id', accommodation.id)
      .order('price_per_night', { ascending: true });
    
    if (roomsError && process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching rooms:', roomsError);
    }
    
    // Return the accommodation with its rooms
    return {
      ...accommodation,
      rooms: rooms || [],
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Unexpected error in fetchAccommodationBySlug:', error);
    }
    return null;
  }
}

// Extend the Accommodation type to include rooms
export interface AccommodationWithRooms extends Accommodation {
  rooms: Array<{
    id: string;
    name: string;
    description: string;
    max_occupancy: number;
    price_per_night: number;
    images: string[];
    amenities: string[];
    size_sqm?: number;
    bed_type?: string;
    view?: string;
    quantity_available: number;
  }>;
}
