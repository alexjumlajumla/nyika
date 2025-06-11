export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      room_types: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      },
      destinations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          country: string
          region: string | null
          featured_image: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          country: string
          region?: string | null
          featured_image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          country?: string
          region?: string | null
          featured_image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      accommodations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          location: Json
          price: number
          rating: number | null
          review_count: number
          amenities: string[]
          images: string[]
          is_active: boolean
          is_featured: boolean
          check_in_time: string | null
          check_out_time: string | null
          max_guests: number | null
          min_nights: number
          cancellation_policy: string | null
          tags: string[]
          contact_email: string | null
          contact_phone: string | null
          destination_id: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          location: Json
          price: number
          rating?: number | null
          review_count?: number
          amenities?: string[]
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          check_in_time?: string | null
          check_out_time?: string | null
          max_guests?: number | null
          min_nights?: number
          cancellation_policy?: string | null
          tags?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          destination_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          location?: Json
          price?: number
          rating?: number | null
          review_count?: number
          amenities?: string[]
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          check_in_time?: string | null
          check_out_time?: string | null
          max_guests?: number | null
          min_nights?: number
          cancellation_policy?: string | null
          tags?: string[]
          contact_email?: string | null
          contact_phone?: string | null
          destination_id?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
      }
      rooms: {
        Row: {
          id: string
          accommodation_id: string
          name: string
          description: string | null
          max_occupancy: number
          price_per_night: number
          images: string[]
          amenities: string[]
          size_sqm: number | null
          bed_type: string | null
          view: string | null
          quantity_available: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          accommodation_id: string
          name: string
          description?: string | null
          max_occupancy: number
          price_per_night: number
          images?: string[]
          amenities?: string[]
          size_sqm?: number | null
          bed_type?: string | null
          view?: string | null
          quantity_available?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          accommodation_id?: string
          name?: string
          description?: string | null
          max_occupancy?: number
          price_per_night?: number
          images?: string[]
          amenities?: string[]
          size_sqm?: number | null
          bed_type?: string | null
          view?: string | null
          quantity_available?: number
          created_at?: string
          updated_at?: string
        }
      }
      accommodation_reviews: {
        Row: {
          id: string
          accommodation_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          accommodation_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          accommodation_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper type for location object
export interface AccommodationLocation {
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  formatted_address?: string
}

// Helper type for price range
export interface PriceRange {
  min: number
  max: number
  currency: string
}

// Helper type for availability check
export interface AvailabilityCheck {
  start_date: string
  end_date: string
  guests: number
  room_type_id?: string
}

// Helper type for booking request
export interface BookingRequest {
  accommodation_id: string
  room_id: string
  start_date: string
  end_date: string
  guests: number
  guest_info: {
    name: string
    email: string
    phone: string
    special_requests?: string
  }
  payment_method: 'credit_card' | 'paypal' | 'bank_transfer'
}

// Helper type for search filters
export interface AccommodationFilters {
  destination?: string
  check_in?: string
  check_out?: string
  guests?: number
  min_price?: number
  max_price?: number
  amenities?: string[]
  rating?: number
  sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'popularity'
  page?: number
  limit?: number
}