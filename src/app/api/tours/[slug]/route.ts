import { NextResponse } from 'next/server';
import { getTourBySlug } from '@/lib/supabase/tours';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const tour = await getTourBySlug(params.slug);
    
    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tour);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}
