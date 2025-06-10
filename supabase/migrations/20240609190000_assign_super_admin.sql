-- This migration assigns the super_admin role to admin@nyikasafaris.com
-- It should be run after the user is created through the Supabase Auth UI/API

-- First, ensure the function exists
\i supabase/seed/create_super_admin.sql

-- Assign the super_admin role to the admin user
DO $$
BEGIN
    -- Check if user exists
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@nyikasafaris.com') THEN
        PERFORM public.assign_super_admin('admin@nyikasafaris.com');
        RAISE NOTICE 'Successfully assigned super_admin role to admin@nyikasafaris.com';
    ELSE
        RAISE NOTICE 'User admin@nyikasafaris.com does not exist. Please create the user first through the Supabase Auth UI/API.';
    END IF;
END $$;
