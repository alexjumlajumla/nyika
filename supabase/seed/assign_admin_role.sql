-- First, run the create_super_admin.sql script to ensure the function exists
\i supabase/seed/create_super_admin.sql

-- Then assign the super_admin role to the admin user
SELECT public.assign_super_admin('admin@nyikasafaris.com');

-- Verify the role was assigned
SELECT 
    u.email, 
    r.name as role, 
    u.created_at as user_created,
    ur.created_at as role_assigned
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE u.email = 'admin@nyikasafaris.com';
