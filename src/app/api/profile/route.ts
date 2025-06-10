import { NextResponse } from 'next/server';
import { getSession } from '@/lib/supabase/server';
import { getProfile, createProfile, updateProfile } from '@/lib/supabase/profile';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Try to get existing profile
    let profile = await getProfile(session.user.id);
    
    // If no profile exists, create one
    if (!profile) {
      if (!session.user.email) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }
      profile = await createProfile(session.user.id, session.user.email);
    }
    
    return NextResponse.json(profile);
    
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const profileData = await request.json();
    
    // Map form fields to profile fields
    const updates = {
      full_name: profileData.full_name,
      bio: profileData.bio,
      website: profileData.website,
      company: profileData.company,
      title: profileData.title,
      location: profileData.location,
      timezone: profileData.timezone,
      locale: profileData.locale,
      metadata: profileData.metadata || {}
    };
    
    // Update the profile with the provided data
    const updatedProfile = await updateProfile(session.user.id, updates);
    
    return NextResponse.json(updatedProfile);
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: error instanceof Error ? 400 : 500 }
    );
  }
}
