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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          avatar_url: string | null
          email_verified: boolean
          is_active: boolean
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          is_active?: boolean
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          is_active?: boolean
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      tours: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          duration: number
          max_group_size: number
          price: number
          discount: number | null
          rating: number | null
          review_count: number | null
          start_location: string | null
          cover_image: string | null
          images: string[] | null
          highlights: string[] | null
          included: string[] | null
          not_included: string[] | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          duration: number
          max_group_size?: number
          price: number
          discount?: number | null
          rating?: number | null
          review_count?: number | null
          start_location?: string | null
          cover_image?: string | null
          images?: string[] | null
          highlights?: string[] | null
          included?: string[] | null
          not_included?: string[] | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          duration?: number
          max_group_size?: number
          price?: number
          discount?: number | null
          rating?: number | null
          review_count?: number | null
          start_location?: string | null
          cover_image?: string | null
          images?: string[] | null
          highlights?: string[] | null
          included?: string[] | null
          not_included?: string[] | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      destinations: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          country: string | null
          region: string | null
          featured_image: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          country?: string | null
          region?: string | null
          featured_image?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          country?: string | null
          region?: string | null
          featured_image?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      tour_categories: {
        Row: {
          tour_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          tour_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          tour_id?: string
          category_id?: string
          created_at?: string
        }
      }
      tour_destinations: {
        Row: {
          tour_id: string
          destination_id: string
          created_at: string
        }
        Insert: {
          tour_id: string
          destination_id: string
          created_at?: string
        }
        Update: {
          tour_id?: string
          destination_id?: string
          created_at?: string
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