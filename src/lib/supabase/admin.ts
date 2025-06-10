import { createServerClient } from '@/lib/supabase/server';

// Type for user data from Supabase auth
type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
};

// Type for the returned user with roles
export type User = AuthUser & {
  roles: string[];
  user_roles?: Array<{
    roles: {
      name: string;
    };
  }>;
  name?: string;
  avatar_url?: string;
  last_sign_in_at?: string | null;
};

// Helper function to get Supabase client with proper typing
async function getClient() {
  return createServerClient();
}

type UserRole = {
  roles: {
    name: string;
  };
};

type DatabaseUser = {
  id: string;
  email: string | null;
  user_metadata: Record<string, any> | null;
  last_sign_in_at: string | null;
  user_roles: UserRole[];
};

export async function getUsers(): Promise<User[]> {
  const supabase = await getClient();
  
  try {
    // Fetch users with their roles in a single query using a join
    const { data: users, error: fetchError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        user_metadata,
        last_sign_in_at,
        user_roles!inner (
          roles (
            name
          )
        )
      `);

    if (fetchError) {
      throw new Error(`Failed to fetch users: ${fetchError.message}`);
    }
    if (!users) return [];

    // Type assertion for the response
    const typedUsers = users as unknown as DatabaseUser[];

    return typedUsers.map(user => ({
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata || {},
      last_sign_in_at: user.last_sign_in_at,
      roles: user.user_roles.map(ur => ur.roles.name),
      user_roles: user.user_roles
    }));
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
    throw new Error(errorMessage);
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const supabase = await getClient();
  
  try {
    const { data: user, error } = await supabase.auth.admin.getUserById(userId);
    
    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }

    // Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, roles!inner(name)')
      .eq('user_id', userId);

    if (rolesError) {
      throw new Error('Failed to fetch user roles');
    }
    
    const roles = (userRoles || []).flatMap((ur: any) => ur.roles.map((r: any) => r.name));
    
    return {
      id: user.user.id,
      email: user.user.email,
      user_metadata: user.user.user_metadata,
      roles: roles || []
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user';
    throw new Error(errorMessage);
  }
}

export async function updateUserRoles(userId: string, roles: string[]) {
  const supabase = await getClient();
  
  try {
    // First, delete all existing roles for the user
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (deleteError) throw deleteError;
    
    // Then, add the new roles
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert(
        roles.map(role => ({
          user_id: userId,
          role_name: role
        }))
      );
    
    if (insertError) throw insertError;
    
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user roles';
    throw new Error(errorMessage);
  }
}

export async function getAllRoles() {
  const supabase = await getClient();
  
  try {
    const { data: roles, error } = await supabase
      .from('roles')
      .select('name, description')
      .order('name');
    
    if (error) {
      throw new Error('Failed to fetch roles');
    }
    
    return roles || [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch roles';
    throw new Error(errorMessage);
  }
}

export async function getCurrentUser() {
  const supabase = await getClient();
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`);
    }
    
    if (!user) {
      return null;
    }
    
    // Get user roles
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('roles!inner(name)')
      .eq('user_id', user.id);
    
    const roles = (userRoles || []).flatMap((ur: any) => ur.roles.map((r: any) => r.name));
    
    return {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      roles: roles || []
    };
  } catch (_error) {
    return null;
  }
}
