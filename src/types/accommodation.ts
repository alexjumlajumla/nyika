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
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  
  // Pricing and ratings
  price: number;
  price_per_night: number;
  rating?: number;
  review_count?: number;
  is_featured: boolean;
  
  // Media
  amenities: string[];
  images: string[];
  featured_image?: string;
  
  // Booking details
  check_in_time?: string;
  check_out_time?: string;
  max_guests?: number;
  min_nights?: number;
  
  // Additional info
  cancellation_policy?: string;
  tags?: string[];
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  social_links?: {
    [key: string]: string;
  };
  policies?: {
    [key: string]: string | boolean | number;
  };
  
  // System fields
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
