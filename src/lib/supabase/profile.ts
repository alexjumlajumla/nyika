import { createServerClient } from './server';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Omit<
  Partial<Profile>,
  'id' | 'email' | 'created_at' | 'updated_at'
>;

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return data;
  } catch {
    return null;
  }
}

export async function createProfile(userId: string, email: string): Promise<Profile> {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: '',
        avatar_url: null,
        website: null,
        company: null,
        title: null,
        bio: null,
        location: null,
        timezone: null,
        locale: null,
        metadata: {}
      })
      .select()
      .single()
      .throwOnError();

    return data;
  } catch {
    throw new Error('Failed to create profile');
  }
}

export async function updateProfile(
  userId: string, 
  updates: ProfileUpdate
): Promise<Profile> {
  try {
    const supabase = await createServerClient();
    const { data } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()
      .throwOnError();

    return data;
  } catch {
    throw new Error('Failed to update profile');
  }
}
