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
export type AccommodationWithRelations = Omit<Accommodation, 'rooms' | 'reviews' | 'destination' | 'type' | 'social_links' | 'policies' | 'tags' | 'featured_image'> & {
  // Ensure all properties are properly typed for React rendering
  type: string | AccommodationType;
  price_per_night: number; // Map from price in database
  is_verified?: boolean;
  images: string[]; // Changed from featured_image to images array
  rooms?: Room[];
  reviews?: (AccommodationReview & { user?: Profile })[];
  destination_id?: string | null;
  
  // Location is an object in the database
  location: {
    city: string;
    address: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // Other properties from the database
  rating: number;
  review_count: number;
  amenities: string[];
  is_active: boolean;
  is_featured: boolean;
  check_in_time: string;
  check_out_time: string;
  max_guests: number;
  min_nights: number;
  cancellation_policy: string;
  tags: string[];
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
  
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
  type?: string | string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
  pageSize?: number; // Alias for limit
  // Add any other filter properties that might be used
  [key: string]: any; // Allow for dynamic properties
};

/**
 * Fetches a list of accommodations with optional filters
 */
export async function getAccommodations(
  filters: AccommodationFilters = {}
): Promise<AccommodationWithRelations[]> {
  try {
    const supabase = await createServerClient();
    
    // Initialize the query
    let query = supabase
      .from('accommodations')
      .select('*', { count: 'exact' });
    
    // Destructure filters
    const { destination } = filters;
    
    // Apply filters if provided
    if (destination) {
      query = query.ilike('location->>city', `%${destination}%`);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.contains('amenities', filters.amenities);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      const [column, order] = filters.sortBy.split('_');
      query = query.order(column, { ascending: order === 'asc' });
    } else {
      // Default sorting
      query = query.order('name', { ascending: true });
    }
    
    // Apply pagination
    if (filters.page && filters.pageSize) {
      const from = (filters.page - 1) * filters.pageSize;
      const to = from + filters.pageSize - 1;
      query = query.range(from, to);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches an accommodation by its slug with all related data
 */
export async function getAccommodationBySlug(
  slug: string
): Promise<{ data: AccommodationWithRelations | null; error: Error | null }> {
  try {
    // Input validation
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      const error = new Error('Invalid slug provided');
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('getAccommodationBySlug error:', error);
      }
      return { data: null, error };
    }

    const supabase = await createServerClient();
    
    // First, get the basic accommodation data
    const { data: accommodation, error: accommodationError } = await supabase
      .from('accommodations')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (accommodationError) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Supabase error in getAccommodationBySlug:', {
          error: accommodationError,
          slug,
          table: 'accommodations',
          query: `select * from accommodations where slug = '${slug}' and is_active = true limit 1`
        });
      }
      throw accommodationError;
    }

    if (!accommodation) {
      return { data: null, error: null };
    }

    // Fetch related data in parallel with individual error handling
    const [rooms, reviews, destination] = await Promise.all([
      getAccommodationRooms(accommodation.id).catch(error => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error fetching rooms in getAccommodationBySlug:', {
            error,
            accommodationId: accommodation.id,
            timestamp: new Date().toISOString()
          });
        }
        return [];
      }),
      getAccommodationReviews(accommodation.id).catch(error => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Error fetching reviews in getAccommodationBySlug:', {
            error,
            accommodationId: accommodation.id,
            timestamp: new Date().toISOString()
          });
        }
        return [];
      }),
      // Get destination - will return null on error or if no destination_id
      accommodation.destination_id 
        ? getDestinationById(accommodation.destination_id).catch((error: Error) => {
            // Log error in development only
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.error('Error fetching destination:', error);
            }
            return null;
          })
        : Promise.resolve(null),
    ]);

    // If no accommodation found, return null with no error
    if (!accommodation) {
      return { data: null, error: null };
    }

    // Map price to price_per_night and ensure all required fields are present
    const { price, ...accommodationWithoutPrice } = accommodation;
    
    return {
      data: {
        ...accommodationWithoutPrice,
        price_per_night: price,
        price, // Keep original price for backward compatibility
        rooms: rooms || [],
        reviews: reviews || [],
        destination: destination || undefined,
      },
      error: null
    };
  } catch (error) {
    // Error logging is handled by the error response
    
    // Return error response
    return {
      data: null,
      error: error instanceof Error ? error : new Error('Failed to fetch accommodation')
    };
  }
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
 * Fetches rooms for a specific accommodation with proper type safety and error handling
 */
export async function getAccommodationRooms(
  accommodationId: string
): Promise<Room[]> {
  try {
    // Input validation
    if (!accommodationId || typeof accommodationId !== 'string' || accommodationId.trim() === '') {
      if (process.env.NODE_ENV === 'development') {
        // Error is already handled by returning empty array
      }
      return [];
    }
    
    const supabase = await createServerClient();
    
    // Log the query we're about to make
    console.log(`Fetching rooms for accommodation ID: ${accommodationId}`);
    
    // Query rooms with proper type safety
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('accommodation_id', accommodationId)
      .order('price_per_night', { ascending: true });

    // Log the raw response
    console.log('Raw rooms response:', { data, error });

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        // Error is already handled by the thrown error
      }
      throw error;
    }

    // Ensure we return an array of Room objects with proper defaults
    return (Array.isArray(data) ? data : []).map(room => ({
      id: room.id || '',
      accommodation_id: room.accommodation_id || accommodationId,
      name: room.name || 'Standard Room',
      description: room.description || '',
      price_per_night: typeof room.price_per_night === 'number' ? room.price_per_night : 0,
      price: typeof room.price === 'number' ? room.price : room.price_per_night || 0,
      max_occupancy: typeof room.max_occupancy === 'number' ? room.max_occupancy : 2,
      size_sqm: typeof room.size_sqm === 'number' ? room.size_sqm : null,
      bed_type: room.bed_type || 'Double',
      view: room.view || null,
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      is_active: room.is_active !== undefined ? room.is_active : true,
      created_at: room.created_at || new Date().toISOString(),
      updated_at: room.updated_at || new Date().toISOString(),
      ...room // Spread any additional properties
    }));
  } catch {
    // Error is already handled by returning an empty array
    return [];
  }
}

// Type for the review with joined profile data
type ReviewWithProfile = Database['public']['Tables']['accommodation_reviews']['Row'] & {
  profiles?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    email: string;
    created_at: string;
    updated_at: string;
  };
};

/**
 * Fetches reviews for a specific accommodation
 */
export async function getAccommodationReviews(
  accommodationId: string,
  limit: number = 5
): Promise<AccommodationReview[]> {
  try {
    if (!accommodationId) {
      return [];
    }
    
    const supabase = await createServerClient();
    
    // First, check if the accommodation exists
    const { data: accommodation, error: accommodationError } = await supabase
      .from('accommodations')
      .select('id')
      .eq('id', accommodationId)
      .single();

    if (accommodationError || !accommodation) {
      return [];
    }
    
    // Now fetch the reviews with the profile information
    const { data, error } = await supabase
      .from('accommodation_reviews')
      .select(`
        id,
        accommodation_id,
        user_id,
        rating,
        comment,
        created_at,
        updated_at,
        profiles!inner(
          id,
          full_name,
          avatar_url,
          email,
          created_at,
          updated_at
        )
      `)
      .eq('accommodation_id', accommodationId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    // Map the profile data to the review
    return (data as unknown as ReviewWithProfile[]).map((review) => {
      const profile = review.profiles || {
        id: 'anonymous',
        full_name: 'Anonymous',
        avatar_url: null,
        email: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Return the review with the user profile
      return {
        id: review.id,
        accommodation_id: review.accommodation_id,
        user_id: review.user_id,
        rating: review.rating,
        comment: review.comment || null,
        created_at: review.created_at,
        updated_at: review.updated_at,
        user: {
          id: profile.id,
          full_name: profile.full_name || 'Anonymous',
          avatar_url: profile.avatar_url || undefined
        }
      };
    });
  } catch {
    // Return empty array on any error
    return [];
  }
}

/**
 * Fetches a destination by ID
 */
async function getDestinationById(
  destinationId: string
): Promise<Database['public']['Tables']['destinations']['Row'] | null> {
  try {
    if (!destinationId) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('No destination ID provided');
      }
      return null;
    }

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
        console.error('Error fetching destination:', {
          error,
          destinationId,
          table: 'destinations',
          query: `select * from destinations where id = '${destinationId}' limit 1`
        });
      }
      return null;
    }

    return data;
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error in getDestinationById:', {
        error,
        destinationId,
        timestamp: new Date().toISOString()
      });
    }
    return null;
  }
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
