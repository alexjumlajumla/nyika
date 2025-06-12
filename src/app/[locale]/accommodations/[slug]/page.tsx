import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getAccommodationBySlug } from '@/lib/supabase/accommodations';
import AccommodationClient from './AccommodationClient';
import { AccommodationSkeleton } from '@/components/skeletons/AccommodationSkeleton';

// Static generation settings
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// This tells Next.js to treat this as a Server Component
export const dynamicParams = true;

// Define local interfaces to match the expected data structure
interface RoomType {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  max_occupancy: number;
  room_size?: string | null;
  bed_type?: string | null;
  quantity_available?: number | null;
  amenities: string[];
  images: string[];
}

interface AccommodationType {
  id: string;
  slug: string;
  name: string;
  description: string;
  rating: number;
  price?: number; // Made optional as it might not always be provided
  price_per_night: number;
  location: any;
  rooms: RoomType[];
  reviews: any[];
  images: string[];
  amenities: string[];
  review_count: number;
  is_active: boolean;
  is_featured: boolean;
  check_in_time: string;
  check_out_time: string;
  max_guests: number;
  min_nights: number;
  cancellation_policy: string;
  contact_email: string;
  contact_phone: string;
  destination_id: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  type: string;
  is_verified?: boolean;
  tags: string[];
}



export default async function AccommodationDetailPage({ 
  params 
}: { 
  params: { 
    locale: string; 
    slug: string;
  };
}) {
  // First, validate the slug
  if (!params.slug || typeof params.slug !== 'string') {
    notFound();
  }

  try {
    // Fetch accommodation data
    console.log('Fetching accommodation for slug:', params.slug);
    const { data: accommodation, error } = await getAccommodationBySlug(params.slug);
    
    // Log the raw data for debugging
    console.log('Raw accommodation data:', JSON.stringify(accommodation, null, 2));
    
    // Handle fetch errors
    if (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error fetching accommodation:', error);
      }
      throw new Error('Failed to load accommodation');
    }
    
    // If no accommodation found, return 404
    if (!accommodation) {
      notFound();
    }

    // Transform the accommodation data to match AccommodationType
    const transformRoom = (room: any): RoomType => ({
      id: room.id?.toString() || '',
      name: room.name?.toString() || 'Standard Room',
      description: room.description?.toString() || '',
      // Use price_per_night if available, otherwise fall back to price or 0
      price_per_night: Number(room.price_per_night || room.price || 0),
      max_occupancy: Number(room.max_occupancy) || 2,
      room_size: room.room_size?.toString() || null,
      bed_type: room.bed_type?.toString() || null,
      quantity_available: room.quantity_available ? Number(room.quantity_available) : null,
      amenities: Array.isArray(room.amenities) 
        ? room.amenities.map((a: any) => a?.toString() || '') 
        : [],
      images: Array.isArray(room.images) 
        ? room.images.map((img: any) => img?.toString() || '')
        : []
    });

    // Transform the main accommodation data
    const simplifiedData: AccommodationType = {
      ...accommodation,
      // Map price to price_per_night if it exists
      price_per_night: Number(accommodation.price_per_night || accommodation.price || 0),
      // Ensure arrays are always arrays with proper typing
      rooms: (Array.isArray(accommodation.rooms) ? accommodation.rooms : []).map(transformRoom),
      reviews: Array.isArray(accommodation.reviews) ? accommodation.reviews : [],
      images: Array.isArray(accommodation.images) ? accommodation.images : [],
      amenities: Array.isArray(accommodation.amenities) ? accommodation.amenities : [],
      // Ensure required fields have defaults
      name: accommodation.name || 'Unnamed Accommodation',
      description: accommodation.description || '',
      rating: accommodation.rating || 0,
      // price_per_night is already set above using the spread operator and our custom logic
      // Handle location safely
      location: (() => {
        if (!accommodation.location) {
          return { city: '', address: '', country: '', coordinates: { lat: 0, lng: 0 } };
        }
        if (typeof accommodation.location === 'string') {
          try {
            return JSON.parse(accommodation.location);
          } catch {
            return { city: '', address: '', country: '', coordinates: { lat: 0, lng: 0 } };
          }
        }
        return accommodation.location;
      })(),
      // Ensure all required fields have defaults
      id: accommodation.id || '',
      slug: accommodation.slug || '',
      review_count: accommodation.review_count || 0,
      is_active: accommodation.is_active ?? true,
      is_featured: accommodation.is_featured ?? false,
      check_in_time: accommodation.check_in_time || '14:00',
      check_out_time: accommodation.check_out_time || '12:00',
      max_guests: accommodation.max_guests || 2,
      min_nights: accommodation.min_nights || 1,
      cancellation_policy: accommodation.cancellation_policy || 'Flexible',
      contact_email: accommodation.contact_email || '',
      contact_phone: accommodation.contact_phone || '',
      destination_id: accommodation.destination_id || null,
      created_at: accommodation.created_at || new Date().toISOString(),
      updated_at: accommodation.updated_at || new Date().toISOString(),
      created_by: accommodation.created_by || null,
      type: accommodation.type || 'hotel',
      is_verified: accommodation.is_verified ?? false,
      tags: Array.isArray(accommodation.tags) ? accommodation.tags : [],
    };

    return (
      <Suspense fallback={<AccommodationSkeleton />}>
        <div className="container mx-auto px-4 py-8">
          <AccommodationClient initialData={simplifiedData} />
        </div>
      </Suspense>
    );
  } catch (error) {
    // Log the error in development
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Error in AccommodationDetailPage:', error);
    }
    
    // Show a user-friendly error message
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Accommodation</h2>
        <p className="text-gray-600">We're sorry, but we couldn't load the accommodation details at this time.</p>
        <p className="text-sm text-gray-500 mt-2">Please try again later or contact support if the problem persists.</p>
      </div>
    );
    
    // Alternatively, you could throw the error to be caught by an error boundary
    // throw new Error('Failed to load accommodation details');
  }

}
