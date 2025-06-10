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
      tours: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          description: string | null
          duration: string | null
          price: number
          discount: number | null
          rating: number | null
          review_count: number | null
          start_location: string | null
          destinations: string[] | null
          images: string[] | null
          is_featured: boolean
          is_private: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          description?: string | null
          duration?: string | null
          price: number
          discount?: number | null
          rating?: number | null
          review_count?: number | null
          start_location?: string | null
          destinations?: string[] | null
          images?: string[] | null
          is_featured?: boolean
          is_private?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          description?: string | null
          duration?: string | null
          price?: number
          discount?: number | null
          rating?: number | null
          review_count?: number | null
          start_location?: string | null
          destinations?: string[] | null
          images?: string[] | null
          is_featured?: boolean
          is_private?: boolean
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
