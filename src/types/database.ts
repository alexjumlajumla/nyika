import { Database as DatabaseGenerated } from '../lib/supabase/database.types';

type Tables = DatabaseGenerated['public']['Tables'];
type TableName = keyof Tables;
type Table<T extends TableName> = Tables[T];
type Row<T extends TableName> = Table<T>['Row'];
type Insert<T extends TableName> = Table<T>['Insert'];
type Update<T extends TableName> = Table<T>['Update'];

// Destinations
export type Destination = Row<'destinations'>;
export type NewDestination = Insert<'destinations'>;
export type DestinationUpdate = Update<'destinations'>;

// Accommodations
export type Accommodation = Row<'accommodations'> & {
  rooms?: Room[];
  reviews?: AccommodationReview[];
  destination?: Destination;
};

export type NewAccommodation = Insert<'accommodations'>;
export type AccommodationUpdate = Update<'accommodations'>;

// Rooms
export type Room = Row<'rooms'> & {
  room_type?: RoomType;
  accommodation?: Accommodation;
};

export type NewRoom = Insert<'rooms'>;
export type RoomUpdate = Update<'rooms'>;

// Room Types
export type RoomType = Row<'room_types'>;
export type NewRoomType = Insert<'room_types'>;
export type RoomTypeUpdate = Update<'room_types'>;

// Accommodation Reviews
export type AccommodationReview = Row<'accommodation_reviews'> & {
  user?: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
};

export type NewAccommodationReview = Insert<'accommodation_reviews'>;
export type AccommodationReviewUpdate = Update<'accommodation_reviews'>;

// Search and Filter Types
export interface AccommodationSearchParams {
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
}

export interface AvailabilityCheckParams {
  startDate: string;
  endDate: string;
  guests: number;
  roomTypeId?: string;
}

export interface BookingRequestParams {
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
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}

export interface AccommodationFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  types?: string[];
  amenities?: string[];
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
}

// Booking related types
export interface BookingRequest {
  accommodationId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  paymentMethod: 'card' | 'bank_transfer' | 'paypal';
}

export interface BookingResponse {
  id: string;
  bookingNumber: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  createdAt: string;
  updatedAt: string;
}
