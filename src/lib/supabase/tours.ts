import { createServerClient } from '@/lib/supabase/server';
import { Tour } from '@/types/tour';

const TABLE_NAME = 'tours';

export async function getTours(): Promise<Tour[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tours: ${error.message}`);
  }
  
  return data as Tour[];
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    return null;
  }
  
  return data as Tour;
}

export async function getFeaturedTours(limit = 3): Promise<Tour[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('isFeatured', true)
    .limit(limit);

  if (error) {
    // Silently fail and return empty array for featured tours
    return [];
  }
  
  return data as Tour[];
}