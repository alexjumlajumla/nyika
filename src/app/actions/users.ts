'server-only';

import { getUsers, getUserById, updateUserRoles } from '@/lib/supabase/admin';
import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function fetchUsers() {
  try {
    const users = await getUsers();
    return { users, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
    return { users: [], error: errorMessage };
  }
}

export async function fetchUserById(userId: string) {
  try {
    const user = await getUserById(userId);
    return { user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    return { user: null, error: errorMessage };
  }
}

export async function updateUserRolesAction(userId: string, roles: string[]) {
  try {
    const supabase = await createServerClient();
    
    // Verify current user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Not authenticated');
    }
    
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      user_id: user.id,
      role_name: 'admin'
    });
    
    if (roleError || !isAdmin) {
      throw new Error('Unauthorized');
    }
    
    await updateUserRoles(userId, roles);
    
    // Revalidate the users page
    revalidatePath('/dashboard/users');
    
    return { success: true, error: null };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update user roles' 
    };
  }
}
