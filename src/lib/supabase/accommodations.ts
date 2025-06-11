import { createServerClient } from './server';
import { Database } from './database.types';
import { Accommodation, Room, AccommodationReview } from '../../types/database';
import { AccommodationType } from '../../types/accommodation';

// Define the profile type since it's not in the database.types
type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  created_at: string;
  updated_at: string;
};

// Type for accommodation with relationships
export type AccommodationWithRelations = Omit<Accommodation, 'rooms' | 'reviews' | 'destination' | 'type' | 'social_links' | 'policies' | 'tags'> & {
  // Ensure all properties are properly typed for React rendering
  type: string | AccommodationType;
  price_per_night: number;
  is_verified: boolean;
  featured_image?: string | null;
  rooms?: Room[];
  reviews?: (AccommodationReview & { user?: Profile })[];
  destination?: Database['public']['Tables']['destinations']['Row'] | null;
  
  // Ensure these properties are properly typed for React rendering
  social_links?: Record<string, string> | null;
  policies?: Record<string, string | boolean | number> | null;
  
  // Ensure these properties are properly typed for React rendering
  location: string;
  description: string;
  rating?: number | null;
  
  // Handle tags which might come as Json from Supabase
  tags?: string[] | null;
  
  // Add explicit type for is_featured since it's used in the component
  is_featured: boolean;
  
  // Add explicit type for name and slug since they're used in the component
  name: string;
  slug: string;
  
  // Ensure all other properties that might be rendered are properly typed
  [key: string]: unknown;
};

export type AccommodationFilters = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
};

/**
 * Fetches a list of accommodations with optional filters
 */
export async function getAccommodations(
  filters: AccommodationFilters = {}
): Promise<AccommodationWithRelations[]> {
  const supabase = await createServerClient();
  const {
    destination,
    minPrice,
    maxPrice,
    rating,
    amenities = [],
    sortBy = 'popularity',
    page = 1,
    limit = 12,
  } = filters;

  let query = supabase
    .from('accommodations')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  // Apply filters
  if (destination) {
    query = query.ilike('location->>city', `%${destination}%`);
  }
  if (minPrice) {
    query = query.gte('price', minPrice);
  }
  if (maxPrice) {
    query = query.lte('price', maxPrice);
  }
  if (rating) {
    query = query.gte('rating', rating);
  }
  if (amenities.length > 0) {
    query = query.contains('amenities', amenities);
  }

  // Apply sorting
  switch (sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'popularity':
    default:
      query = query.order('review_count', { ascending: false });
      break;
  }

  // Apply pagination
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  query = query.range(start, end);

  const { data, error } = await query;
  
  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching accommodations:', error);
    }
    throw error;
  }

  return data || [];
}

/**
 * Fetches a single accommodation by its slug with related rooms and destination
 */
export async function getAccommodationBySlug(
  slug: string
): Promise<AccommodationWithRelations | null> {
  const supabase = await createServerClient();
  
  const { data: accommodation, error: accommodationError } = await supabase
    .from('accommodations')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (accommodationError) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching accommodation:', accommodationError);
    }
    throw accommodationError;
  }

  if (!accommodation) return null;

  // Fetch related data in parallel
  const [rooms, reviews, destination] = await Promise.all([
    getAccommodationRooms(accommodation.id),
    getAccommodationReviews(accommodation.id),
    accommodation.destination_id ? getDestinationById(accommodation.destination_id) : Promise.resolve(null),
  ]);

  return {
    ...accommodation,
    rooms,
    reviews,
    destination: destination || undefined,
  };
}

/**
 * Fetches featured accommodations
 */
export async function getFeaturedAccommodations(
  limit: number = 6
): Promise<AccommodationWithRelations[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(limit);

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching featured accommodations:', error);
    }
    throw error;
  }

  return data || [];
}

/**
 * Searches accommodations by name or description
 */
export async function searchAccommodations(
  query: string,
  limit: number = 10
): Promise<AccommodationWithRelations[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .rpc('search_accommodations', {
      search_term: query,
      max_results: limit,
    });

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error searching accommodations:', error);
    }
    throw error;
  }

  return data || [];
}

/**
 * Fetches rooms for a specific accommodation
 */
export async function getAccommodationRooms(
  accommodationId: string
): Promise<Room[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('accommodation_id', accommodationId)
    .order('price_per_night', { ascending: true });

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching rooms:', error);
    }
    throw error;
  }

  return data || [];
}

/**
 * Fetches reviews for a specific accommodation
 */
export async function getAccommodationReviews(
  accommodationId: string,
  limit: number = 5
): Promise<AccommodationReview[]> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('accommodation_reviews')
    .select('*, profiles!inner(*)')
    .eq('accommodation_id', accommodationId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching reviews:', error);
    }
    throw error;
  }

  // Map the profile data to the review
  return (data || []).map((review: unknown) => {
    const reviewWithProfile = review as { profiles?: Profile } & Record<string, unknown>;
    const profile = reviewWithProfile.profiles;
    
    const userProfile = profile ? {
      id: profile.id,
      full_name: profile.full_name || 'Anonymous',
      avatar_url: profile.avatar_url || null,
    } : {
      id: 'anonymous',
      full_name: 'Anonymous',
      avatar_url: null,
    };

    // Remove the profiles property and add user
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { profiles, ...reviewData } = reviewWithProfile;
    return {
      ...reviewData,
      user: userProfile,
    } as unknown as AccommodationReview & { user: Profile };
  });
}

/**
 * Fetches a destination by ID
 */
async function getDestinationById(
  destinationId: string
): Promise<Database['public']['Tables']['destinations']['Row'] | null> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', destinationId)
    .single();

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching destination:', error);
    }
    return null;
  }

  return data;
}

/**
 * Checks availability for an accommodation
 */
export async function checkAvailability(
  accommodationId: string,
  params: { startDate: string; endDate: string; guests?: number }
): Promise<{ is_available: boolean; available_rooms: Room[] }> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase.rpc('check_accommodation_availability', {
    p_accommodation_id: accommodationId,
    p_start_date: params.startDate,
    p_end_date: params.endDate,
    p_guests: params.guests || 1,
  });

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error checking availability:', error);
    }
    throw error;
  }

  return data;
}

/**
 * Creates a new booking
 */
export async function createBooking(
  bookingData: {
    accommodationId: string;
    roomId: string;
    startDate: string;
    endDate: string;
    guests: number;
    guestInfo: {
      name: string;
      email: string;
      phone: string;
      specialRequests?: string;
    };
  },
  userId?: string
): Promise<{ id: string; booking_number: string }> {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase.rpc('create_booking', {
    p_accommodation_id: bookingData.accommodationId,
    p_room_id: bookingData.roomId,
    p_user_id: userId || null,
    p_start_date: bookingData.startDate,
    p_end_date: bookingData.endDate,
    p_guests: bookingData.guests,
    p_guest_name: bookingData.guestInfo.name,
    p_guest_email: bookingData.guestInfo.email,
    p_guest_phone: bookingData.guestInfo.phone,
    p_special_requests: bookingData.guestInfo.specialRequests || null,
  });

  if (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error creating booking:', error);
    }
    throw error;
  }

  return data;
}
