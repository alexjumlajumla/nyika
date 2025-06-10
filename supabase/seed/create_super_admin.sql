-- This script creates a super admin user with all permissions
-- It should be run manually after the database is set up

-- 1. First, create the user in auth.users (handled by Supabase Auth)
-- Note: The password will need to be set via the Supabase Auth UI or API

-- 2. Create a function to assign the super_admin role to a user by email
CREATE OR REPLACE FUNCTION public.assign_super_admin(user_email TEXT)
RETURNS UUID AS $$
DECLARE
    user_id UUID;
    role_id UUID;
BEGIN
    -- Get the user ID from auth.users
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = user_email
    LIMIT 1;
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;
    
    -- Get the super_admin role ID
    SELECT id INTO role_id
    FROM public.roles
    WHERE name = 'super_admin'
    LIMIT 1;
    
    IF role_id IS NULL THEN
        RAISE EXCEPTION 'Super admin role not found. Make sure to run migrations first.';
    END IF;
    
    -- Assign the role
    INSERT INTO public.user_roles (user_id, role_id, created_at, updated_at)
    VALUES (user_id, role_id, NOW(), NOW())
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    RETURN user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a function to create a new super admin user
CREATE OR REPLACE FUNCTION public.create_super_admin(
    p_email TEXT,
    p_password TEXT
) RETURNS UUID AS $$
DECLARE
    user_id UUID;
    role_id UUID;
    user_metadata JSONB;
BEGIN
    -- Create the user in auth.users
    user_metadata := jsonb_build_object('full_name', 'Super Admin', 'avatar_url', '');
    
    -- Note: In a real implementation, you would use the Supabase Auth API to create the user
    -- This is a placeholder that shows what would happen
    -- You would typically call this from your application code, not directly in SQL
    -- For security reasons, we don't handle password hashing in SQL
    
    -- Get the super_admin role ID
    SELECT id INTO role_id
    FROM public.roles
    WHERE name = 'super_admin'
    LIMIT 1;
    
    IF role_id IS NULL THEN
        RAISE EXCEPTION 'Super admin role not found. Make sure to run migrations first.';
    END IF;
    
    -- In a real implementation, you would:
    -- 1. Call the Supabase Auth API to create the user
    -- 2. Get the user ID from the response
    -- 3. Assign the super_admin role using the assign_super_admin function
    
    -- For now, we'll just return NULL to indicate manual intervention is needed
    RAISE NOTICE 'To create a super admin user, please use the Supabase Auth UI or API to create a user with email: %', p_email;
    RAISE NOTICE 'Then run: SELECT public.assign_super_admin(''%'');', p_email;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create a function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_id AND r.name = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 5. Create a function to get all permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_permissions(user_id UUID)
RETURNS TABLE(resource TEXT, action TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT p.resource, p.action
    FROM public.permissions p
    JOIN public.role_permissions rp ON p.id = rp.permission_id
    JOIN public.user_roles ur ON rp.role_id = ur.role_id
    WHERE ur.user_id = user_id
    ORDER BY p.resource, p.action;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 6. Create a function to check if a user has a specific permission
CREATE OR REPLACE FUNCTION public.has_permission(
    user_id UUID,
    resource TEXT,
    action TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    -- Super admins have all permissions
    IF public.is_super_admin(user_id) THEN
        RETURN true;
    END IF;
    
    -- Check for specific permission
    RETURN EXISTS (
        SELECT 1
        FROM public.permissions p
        JOIN public.role_permissions rp ON p.id = rp.permission_id
        JOIN public.user_roles ur ON rp.role_id = ur.role_id
        WHERE ur.user_id = has_permission.user_id
        AND p.resource = has_permission.resource
        AND p.action = has_permission.action
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 7. Create a function to get all roles for a user
CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TABLE(role_id UUID, role_name TEXT, role_description TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.name, r.description
    FROM public.roles r
    JOIN public.user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = user_id
    ORDER BY r.name;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 8. Create a function to get all users with their roles
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE(
    user_id UUID,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ,
    roles JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        (u.raw_user_meta_data->>'full_name')::TEXT AS full_name,
        (u.raw_user_meta_data->>'avatar_url')::TEXT AS avatar_url,
        u.created_at,
        (
            SELECT jsonb_agg(jsonb_build_object(
                'id', r.id,
                'name', r.name,
                'description', r.description
            ))
            FROM public.roles r
            JOIN public.user_roles ur ON r.id = ur.role_id
            WHERE ur.user_id = u.id
        ) AS roles
    FROM auth.users u
    ORDER BY u.email;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 9. Create a function to update a user's roles
CREATE OR REPLACE FUNCTION public.update_user_roles(
    target_user_id UUID,
    role_ids UUID[],
    current_user_id UUID
) RETURNS JSONB AS $$
DECLARE
    is_admin BOOLEAN;
    result JSONB;
BEGIN
    -- Check if current user is an admin
    SELECT public.is_super_admin(current_user_id) INTO is_admin;
    
    IF NOT is_admin THEN
        RAISE EXCEPTION 'Permission denied. Only administrators can update user roles.';
    END IF;
    
    -- Prevent users from modifying their own roles
    IF target_user_id = current_user_id THEN
        RAISE EXCEPTION 'You cannot modify your own roles.';
    END IF;
    
    -- Delete existing roles
    DELETE FROM public.user_roles 
    WHERE user_id = target_user_id;
    
    -- Add new roles
    INSERT INTO public.user_roles (user_id, role_id, created_at, updated_at)
    SELECT 
        target_user_id, 
        role_id, 
        NOW(), 
        NOW()
    FROM unnest(role_ids) AS role_id;
    
    -- Return success message
    SELECT jsonb_build_object(
        'success', true,
        'message', 'User roles updated successfully',
        'user_id', target_user_id,
        'roles', array_agg(name)
    ) INTO result
    FROM public.roles
    WHERE id = ANY(role_ids);
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create a function to get all permissions for the current user
CREATE OR REPLACE FUNCTION public.get_my_permissions()
RETURNS TABLE(resource TEXT, action TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.get_user_permissions(auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 11. Create a function to check if the current user has a specific permission
CREATE OR REPLACE FUNCTION public.i_have_permission(resource TEXT, action TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.has_permission(auth.uid(), resource, action);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 12. Create a function to get the current user's roles
CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS TABLE(role_id UUID, role_name TEXT, role_description TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.get_user_roles(auth.uid());
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
