import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

// This route doesn't need locale handling since it's under /api
export async function GET() {
  try {
    const supabase = await createServerClient();
    
    // Get all accommodations
    const { data: accommodations, error: accError } = await supabase
      .from('accommodations')
      .select('*');
    
    if (accError) {
      console.error('Error fetching accommodations:', accError);
      throw accError;
    }
    
    // Get all rooms
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) {
      console.error('Error fetching rooms:', roomsError);
      throw roomsError;
    }
    
    return NextResponse.json({
      accommodations: accommodations || [],
      rooms: rooms || [],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch debug data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
