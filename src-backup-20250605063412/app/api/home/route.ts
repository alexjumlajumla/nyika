import { NextResponse } from 'next/server';
import { collections } from '@/lib/api';
import { transformDestination, transformTour } from '@/lib/transform';

interface ApiResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export async function GET() {
  try {
    // Fetch featured tours
    const toursResponse = await collections.tours.getAll({
      limit: 8,
      where: {
        featured: { equals: true },
      },
      sort: '-createdAt',
    }) as unknown as ApiResponse<any>; // Type assertion since we know the structure

    // Fetch featured attractions (destinations)
    const destinationsResponse = await collections.attractions.getAll({
      limit: 6,
      where: {
        featured: { equals: true },
      },
      sort: '-createdAt',
    }) as unknown as ApiResponse<any>; // Type assertion since we know the structure

    // Transform the data before sending
    const featuredTours = (toursResponse.docs || []).map(transformTour);
    const featuredDestinations = (destinationsResponse.docs || []).map(transformDestination);

    return NextResponse.json({
      success: true,
      data: {
        featuredTours,
        featuredDestinations,
      },
    });
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch home page data' },
      { status: 500 }
    );
  }
}
