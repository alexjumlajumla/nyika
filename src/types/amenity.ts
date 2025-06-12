import { Database } from '@/types/supabase';

export type Amenity = Database['public']['Tables']['amenities']['Row'] & {
  icon?: string;
  category?: string;
};

export type AmenityCategory = {
  id: string;
  name: string;
  icon: string;
  amenities: Amenity[];
};

export interface AmenityFormData {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
  category_id?: string;
  is_featured?: boolean;
}
