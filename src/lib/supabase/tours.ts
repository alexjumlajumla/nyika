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
  return tours.map((tour: any) => ({
    ...tour,
    // Map database fields to Tour type
    duration: tour.duration_days || 0,
    maxGroupSize: tour.group_size_max || 0,
    price: tour.price_adult || 0,
    ratingsAverage: parseFloat(tour.rating) || 0,
    ratingsQuantity: tour.review_count || 0,
    imageCover: tour.featured_image || '',
    images: tour.gallery || [],
    startLocation: tour.start_location || '',
    // Get categories and destinations from the grouped data with fallbacks
    categories: (categoriesByTourId[tour.id] || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description
    })),
    destinations: (destinationsByTourId[tour.id] || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      description: d.description,
      country: d.country
    })),
    // Add any other required fields with defaults
    difficulty: tour.difficulty_level || 'moderate',
    summary: tour.short_description || '',
    description: tour.description || '',
    // Add empty arrays for required array fields if not present
    included: tour.price_includes?.items || [],
    excluded: tour.price_excludes?.items || [],
    itinerary: tour.itinerary || [],
    tourTypes: []
  }));
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const supabase = await createServerClient();
    
    // First, fetch the tour by slug
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select('*')
      .eq('slug', slug)
      .single();

    if (tourError || !tour) {
      logger.error('Error fetching tour by slug:', { error: tourError, slug });
      return null;
    }

    // Fetch tour categories with proper error handling
    let tourCategories: any[] = [];
    try {
      const { data, error } = await supabase
        .from('tour_category_relations')
        .select(`
          category:categories!inner(
            id,
            name,
            slug,
            description
          )
        `)
        .eq('tour_id', tour.id);
      
      if (error) {
        logger.error('Error fetching tour categories:', { error, tourId: tour.id });
      } else {
        tourCategories = data || [];
      }
    } catch (error) {
      logger.error('Unexpected error fetching tour categories:', { error, tourId: tour.id });
    }

    // Fetch tour destinations with proper error handling
    let tourDestinations: any[] = [];
    try {
      const { data, error } = await supabase
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
        .eq('tour_id', tour.id);
      
      if (error) {
        logger.error('Error fetching tour destinations:', { error, tourId: tour.id });
      } else {
        tourDestinations = data || [];
      }
    } catch (error) {
      logger.error('Unexpected error fetching tour destinations:', { error, tourId: tour.id });
    }
    
    // Extract categories and destinations
    const categories = tourCategories
      .filter(item => item?.category)
      .map(({ category }) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description
      }));

    const destinations = tourDestinations
      .filter(item => item?.destination)
      .map(({ destination }) => ({
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        description: destination.description,
        country: destination.country
      }));
    
    // Get primary destination (first in the array or empty string)
    const primaryDestination = destinations.length > 0 ? destinations[0].name : '';
    
    // Transform the data to match the Tour type
    return {
      ...tour,
      // Map database fields to Tour type
      duration: tour.duration_days || 0,
      maxGroupSize: tour.group_size_max || 0,
      price: tour.price_adult || 0,
      ratingsAverage: parseFloat(tour.rating) || 0,
      ratingsQuantity: tour.review_count || 0,
      imageCover: tour.featured_image || '',
      images: tour.gallery || [],
      startLocation: tour.start_location || '',
      // Add the destination field (first destination or empty string)
      destination: primaryDestination,
      // Categories and destinations
      categories,
      destinations,
      // Add any other required fields with defaults
      difficulty: tour.difficulty_level || 'moderate',
      summary: tour.short_description || '',
      description: tour.description || '',
      // Add empty arrays for required array fields if not present
      highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
      included: tour.price_includes?.items || [],
      excluded: tour.price_excludes?.items || [],
      itinerary: tour.itinerary || [],
      tourTypes: []
    };
  } catch (error) {
    logger.error('Unexpected error in getTourBySlug:', { error, slug });
    return null;
  }
}

export async function getFeaturedTours(limit = 3): Promise<Tour[]> {
  const supabase = await createServerClient();
  
  // First, fetch featured tours
  const { data: featuredTours, error: toursError } = await supabase
    .from('tours')
    .select('*')
    .eq('is_featured', true)
    .limit(limit);

  if (toursError || !featuredTours || featuredTours.length === 0) {
    logger.error('Error fetching featured tours:', toursError?.message || 'No featured tours found');
    return [];
  }

  // Get all tour IDs
  const tourIds = featuredTours.map(tour => tour.id);

  // Fetch tour categories
  const { data: tourCategories, error: categoriesError } = await supabase
    .from('tour_category_relations')
    .select(`
      tour_id,
      category:categories!inner(*)
    `)
    .in('tour_id', tourIds);

  if (categoriesError) {
    logger.error('Error fetching featured tour categories:', categoriesError);
  }

  // Fetch tour destinations
  const { data: tourDestinations, error: destinationsError } = await supabase
    .from('tour_destinations')
    .select(`
      tour_id,
      destination:destinations!inner(*)
    `)
    .in('tour_id', tourIds);

  if (destinationsError) {
    logger.error('Error fetching featured tour destinations:', destinationsError);
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
  return featuredTours.map((tour: any) => ({
    ...tour,
    // Map database fields to Tour type
    duration: tour.duration_days || 0,
    maxGroupSize: tour.group_size_max || 0,
    price: tour.price_adult || 0,
    ratingsAverage: parseFloat(tour.rating) || 0,
    ratingsQuantity: tour.review_count || 0,
    imageCover: tour.featured_image || '',
    images: tour.gallery || [],
    startLocation: tour.start_location || '',
    // Get categories and destinations from the grouped data
    categories: (categoriesByTourId[tour.id] || []).map((c: any) => c?.name).filter(Boolean),
    destinations: (destinationsByTourId[tour.id] || []).map((d: any) => d?.name).filter(Boolean),
    // Add any other required fields with defaults
    difficulty: tour.difficulty_level || 'moderate',
    summary: tour.short_description || '',
    description: tour.description || '',
    // Add empty arrays for required array fields if not present
    included: tour.price_includes?.items || [],
    excluded: tour.price_excludes?.items || [],
    itinerary: tour.itinerary || [],
    tourTypes: []
  }));
}