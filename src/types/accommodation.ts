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
  type: AccommodationType;
  rooms: Room[];
  
  // Location
  location: string;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  // Pricing and ratings
  price: number;
  price_per_night: number;
  rating?: number | null;
  review_count?: number;
  is_featured: boolean;
  
  // Media
  amenities: string[];
  images: string[];
  featured_image?: string | null;
  
  // Booking details
  check_in_time?: string | null;
  check_out_time?: string | null;
  max_guests?: number | null;
  min_nights?: number | null;
  
  // Additional info
  cancellation_policy?: string | null;
  tags?: string[] | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  social_links?: Record<string, string> | null;
  policies?: Record<string, string | boolean | number> | null;
  
  // System fields
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  
  // Index signature for any other properties that might come from the API
  [key: string]: unknown;
}
