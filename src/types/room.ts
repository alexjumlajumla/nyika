import { Database } from '@/types/supabase';
import { Amenity } from './amenity';

type BaseRoomType = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  max_occupancy: number;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type BaseAccommodation = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export interface RoomType extends BaseRoomType {
  amenities?: Amenity[];
  image_urls?: string[];
  accommodations?: AccommodationRoomType[];
}

export interface AccommodationRoomType {
  id: string;
  accommodation_id: string;
  room_type_id: string;
  price_override: number | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  room_type: RoomType;
  accommodation?: Accommodation;
  effective_price: number;
  available_rooms: number;
  total_rooms: number;
  quantity_available?: number;
  max_occupancy?: number;
  room_size?: string | null;
  bed_type?: string | null;
  description?: string | null;
  amenities?: Array<{
    id: string;
    name: string;
    icon?: string;
    description?: string | null;
  }>;
  images?: Array<{
    id: string;
    url: string;
    alt?: string;
    is_primary?: boolean;
  }>;
}

export interface Room {
  id: string;
  name: string;
  accommodation_id: string;
  room_type_id: string | null;
  accommodation_room_type_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  room_type?: RoomType | null;
  accommodation_room_type?: AccommodationRoomType | null;
  amenities?: Amenity[];
  accommodation?: Accommodation;
}

export interface Accommodation extends BaseAccommodation {
  room_types?: AccommodationRoomType[];
}

export interface RoomFormData {
  id?: string;
  name: string;
  description: string;
  price_per_night: number;
  max_occupancy: number;
  room_size?: string | null;
  bed_type?: string | null;
  quantity_available: number;
  amenities: string[];
  images: File[] | string[];
  is_active: boolean;
  room_type_id?: string | null;
  view_type?: string;
  floor_number?: number | null;
  additional_amenities?: string[];
}

export interface RoomTypeFormData {
  id?: string;
  name: string;
  description: string;
  icon: string;
  max_occupancy: number;
  base_price: number;
  is_active: boolean;
  amenities: string[];
}

export interface RoomFilterOptions {
  minPrice?: number;
  maxPrice?: number;
  occupancy?: number;
  bedType?: string;
  amenities?: string[];
  viewType?: string;
  floorNumber?: number;
}

export interface RoomAvailabilityParams {
  startDate: Date;
  endDate: Date;
  roomTypeId?: string;
  accommodationId?: string;
}

export interface RoomAvailability {
  roomId: string;
  roomTypeId: string;
  available: boolean;
  date: Date;
}

// Re-export related types for convenience
export type { Amenity } from '@/types/amenity';

// This file provides a complete type system for working with rooms and room types in the application.
// The types are designed to work with the database schema and provide type safety throughout the app.
