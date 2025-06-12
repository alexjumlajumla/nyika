export type AccommodationType = 
  | 'hotel' 
  | 'lodge' 
  | 'camp' 
  | 'resort' 
  | 'guesthouse' 
  | 'eco-lodge' 
  | 'villa'
  | 'safari_lodge'
  | 'tented_camp'
  | 'beach_resort'
  | 'boutique_hotel'
  | 'eco_lodge'
  | 'luxury_camp'
  | 'mountain_lodge'
  | 'treehouse'
  | 'private_island'
  | 'game_lodge'
  | 'bush_camp'
  | 'beach_house'
  | 'chalet'
  | 'apartment'
  | 'guesthouse'
  | 'bed_and_breakfast'
  | 'hostel'
  | 'other';

export interface Room {
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
}

export interface Accommodation {
  // Basic info
  id: string;
  name: string;
  slug: string;
  description: string;
  type: AccommodationType | string; // Allow string for flexibility
  
  // Location
  location: {
    city: string;
    address: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  
  // Pricing and rating
  price: number;
  price_per_night: number;
  rating?: number | null;
  review_count?: number;
  
  // Media
  images: string[];
  featured_image?: string | null;
  
  // Features
  amenities: string[];
  is_active: boolean;
  is_featured: boolean;
  is_verified?: boolean;
  
  // Booking details
  check_in_time?: string | null;
  check_out_time?: string | null;
  max_guests?: number | null;
  min_nights?: number | null;
  cancellation_policy?: string | null;
  
  // Additional info
  tags?: string[] | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  destination_id?: string | null;
  social_links?: Record<string, string> | null;
  policies?: Record<string, string | boolean | number> | null;
  
  // System fields
  created_at: string;
  updated_at: string;
  
  // Index signature for any other properties that might come from the API
  [key: string]: unknown;
}
