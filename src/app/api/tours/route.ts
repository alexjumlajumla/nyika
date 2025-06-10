import { NextResponse } from 'next/server';
import { getTours } from '@/lib/supabase/tours';

export async function GET() {
  try {
    const tours = await getTours();
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}
