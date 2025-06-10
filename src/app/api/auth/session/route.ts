import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Get the user's profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        role: profile?.role || 'user',
        ...profile
      }
    });
    
  } catch {
    // Log error to server logs
    // Error is intentionally not exposed to client for security
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
