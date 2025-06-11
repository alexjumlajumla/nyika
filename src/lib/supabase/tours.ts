import { createServerClient } from '@/lib/supabase/server';
import { Tour } from '@/types/tour';
import { logger } from '@/lib/logger';

export async function getTours(): Promise<Tour[]> {
  const supabase = await createServerClient();
  
  // First, fetch all tours
  const { data: tours, error: toursError } = await supabase
    .from('tours')
    .select('*')
    .order('created_at', { ascending: false });

  if (toursError) {
    throw new Error(`Failed to fetch tours: ${toursError.message}`);
  }

  if (!tours || tours.length === 0) {
    return [];
  }

  // Get all tour IDs
  const tourIds = tours.map(tour => tour.id);

  // Fetch tour categories with proper error handling and logging
  let tourCategories: any[] = [];
  try {
    const { data, error } = await supabase
      .from('tour_category_relations')
      .select(`
        tour_id,
        category:categories!inner(
          id,
          name,
          slug,
          description
        )
      `)
      .in('tour_id', tourIds);
    
    if (error) {
      logger.error('Error fetching tour categories:', error);
    } else {
      tourCategories = data || [];
    }
  } catch (error) {
    logger.error('Unexpected error fetching tour categories:', error);
  }

  // Fetch tour destinations with proper error handling and logging
  let tourDestinations: any[] = [];
  try {
    const { data, error } = await supabase
      .from('tour_destinations')
      .select(`
        tour_id,
        destination:destinations!inner(
          id,
          name,
          slug,
          description,
          country
        )
      `)
      .in('tour_id', tourIds);
    
    if (error) {
      logger.error('Error fetching tour destinations:', error);
    } else {
      tourDestinations = data || [];
    }
  } catch (error) {
    logger.error('Unexpected error fetching tour destinations:', error);
  }

  // Group categories and destinations by tour ID
  const categoriesByTourId = (tourCategories || []).reduce((acc, item) => {
    if (!acc[item.tour_id]) {
      acc[item.tour_id] = [];
    }
    acc[item.tour_id].push(item.category);
    return acc;
  }, {} as Record<string, any[]>);

  const destinationsByTourId = (tourDestinations || []).reduce((acc, item) => {
    if (!acc[item.tour_id]) {
      acc[item.tour_id] = [];
    }
    acc[item.tour_id].push(item.destination);
    return acc;
  }, {} as Record<string, any[]>);

  // Transform the data to match the Tour type
  return (tours || []).map((tour: any) => ({
    ...tour,
    // Map database fields to Tour type
    title: tour.name || tour.title || 'Unnamed Tour',
    duration: tour.duration_days || 0,
    maxGroupSize: tour.group_size_max || 0,
    price: tour.price_start_from || tour.price_adult || 0,
    ratingsAverage: parseFloat(tour.rating) || 0,
    ratingsQuantity: tour.review_count || 0,
    imageCover: tour.featured_image || tour.image_cover || '',
    images: tour.images || tour.gallery || [],
    startLocation: tour.start_location || 'Nairobi, Kenya',
    // Get categories and destinations from the grouped data
    categories: (categoriesByTourId[tour.id] || []).map((c: any) => c?.name).filter(Boolean),
    destinations: (destinationsByTourId[tour.id] || []).map((d: any) => d?.name).filter(Boolean),
    // Add any other required fields with defaults
    difficulty: tour.difficulty || 'Moderate',
    summary: tour.short_description || '',
    description: tour.description || '',
    // Add empty arrays for required array fields if not present
    highlights: tour.highlights || [],
    included: tour.included || [],
    excluded: tour.excluded || [],
    itinerary: tour.itinerary || [],
    reviewCount: tour.review_count || 0,
    rating: parseFloat(tour.rating) || 0,
    name: tour.name || '',
    tourTypes: []
  } as Tour));
}

export async function getTourById(id: string): Promise<Tour | null> {
  const supabase = await createServerClient();
  
  // First, fetch the tour by ID
  const { data: tour, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !tour) {
    logger.error('Error fetching tour by ID:', error);
    return null;
  }

  // Fetch related data (categories, destinations, etc.)
  const [categoriesData, destinationsData] = await Promise.all([
    supabase
      .from('tour_category_relations')
      .select(`
        category:categories!inner(
          id,
          name,
          slug,
          description
        )
      `)
      .eq('tour_id', tour.id),
    
    supabase
      .from('tour_destinations')
      .select(`
        destination:destinations!inner(
          id,
          name,
          slug,
          description,
          country
        )
      `)
      .eq('tour_id', tour.id)
  ]);

  // Transform the data to match the Tour type
  return {
    ...tour,
    // Map database fields to Tour type
    title: tour.name || tour.title || 'Unnamed Tour',
    duration: tour.duration_days || 0,
    maxGroupSize: tour.group_size_max || 0,
    price: tour.price_start_from || tour.price_adult || 0,
    ratingsAverage: parseFloat(tour.rating) || 0,
    ratingsQuantity: tour.review_count || 0,
    imageCover: tour.featured_image || tour.image_cover || '',
    images: Array.isArray(tour.images) ? tour.images : (Array.isArray(tour.gallery) ? tour.gallery : []),
    startLocation: tour.start_location || 'Nairobi, Kenya',
    // Get categories and destinations from the grouped data
    categories: Array.isArray(categoriesData.data) 
      ? categoriesData.data.map((item: any) => item.category?.name).filter(Boolean) 
      : [],
    destinations: Array.isArray(destinationsData.data) 
      ? destinationsData.data.map((item: any) => item.destination?.name).filter(Boolean) 
      : [],
    // Add any other required fields with defaults
    difficulty: tour.difficulty || 'Moderate',
    summary: tour.short_description || '',
    description: tour.description || '',
    // Ensure all array fields are actually arrays
    highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
    included: Array.isArray(tour.included) ? tour.included : [],
    excluded: Array.isArray(tour.excluded) ? tour.excluded : [],
    itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
    reviewCount: tour.review_count || 0,
    rating: parseFloat(tour.rating) || 0,
    name: tour.name || '',
    tourTypes: []
  } as Tour;
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  const supabase = await createServerClient();
  
  // First, fetch the tour by slug
  const { data: tour, error } = await supabase
    .from('tours')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !tour) {
    logger.error('Error fetching tour by slug:', error);
    return null;
  }

  // Fetch related data (categories, destinations, etc.)
  const [categoriesData, destinationsData] = await Promise.all([
    supabase
      .from('tour_category_relations')
      .select(`
        category:categories!inner(
          id,
          name,
          slug,
          description
        )
      `)
      .eq('tour_id', tour.id),
    
    supabase
      .from('tour_destinations')
      .select(`
        destination:destinations!inner(
          id,
          name,
          slug,
          description,
          country
        )
      `)
      .eq('tour_id', tour.id)
  ]);

  // Transform the data to match the Tour type
  return {
    ...tour,
    // Map database fields to Tour type
    title: tour.name || tour.title || 'Unnamed Tour',
    duration: tour.duration_days || 0,
    maxGroupSize: tour.group_size_max || 0,
    price: tour.price_start_from || tour.price_adult || 0,
    ratingsAverage: parseFloat(tour.rating) || 0,
    ratingsQuantity: tour.review_count || 0,
    imageCover: tour.featured_image || tour.image_cover || '',
    images: Array.isArray(tour.images) ? tour.images : (Array.isArray(tour.gallery) ? tour.gallery : []),
    startLocation: tour.start_location || 'Nairobi, Kenya',
    // Get categories and destinations from the grouped data
    categories: Array.isArray(categoriesData.data) 
      ? categoriesData.data.map((item: any) => item.category?.name).filter(Boolean) 
      : [],
    destinations: Array.isArray(destinationsData.data) 
      ? destinationsData.data.map((item: any) => item.destination?.name).filter(Boolean) 
      : [],
    // Add any other required fields with defaults
    difficulty: tour.difficulty || 'Moderate',
    summary: tour.short_description || '',
    description: tour.description || '',
    // Ensure all array fields are actually arrays
    highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
    included: Array.isArray(tour.included) ? tour.included : [],
    excluded: Array.isArray(tour.excluded) ? tour.excluded : [],
    itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
    reviewCount: tour.review_count || 0,
    rating: parseFloat(tour.rating) || 0,
    name: tour.name || '',
    tourTypes: []
  } as Tour;
}
