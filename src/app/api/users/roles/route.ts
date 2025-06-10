import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface RoleUpdateRequest {
  userId: string;
  roles: string[];
}

interface UserRole {
  roles: {
    name: string;
  };
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { userId, roles } = await request.json() as RoleUpdateRequest;

    // Validate input
    if (!userId || !Array.isArray(roles)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if current user is admin
    const { data: currentUserRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('roles!inner(name)')
      .eq('user_id', session.user.id) as { data: UserRole[] | null, error: any };

    const isAdmin = currentUserRoles?.some(ur => ur.roles.name === 'admin');

    if (!isAdmin || rolesError) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update user roles using the function we created
    const { error: updateError } = await supabase.rpc('update_user_roles', {
      p_user_id: userId,
      p_roles: roles
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || 'Failed to update user roles' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
