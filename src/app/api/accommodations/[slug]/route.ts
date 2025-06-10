import { NextResponse } from 'next/server';
import { fetchAccommodationBySlug } from '@/lib/supabase/accommodations';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(
  _request: Request,
  { params }: RouteParams
) {
  try {
    const accommodation = await fetchAccommodationBySlug(params.slug);
    
    if (!accommodation) {
      return NextResponse.json(
        { error: 'Accommodation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(accommodation);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error fetching accommodation:', error);
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
