-- Create admin user and assign super_admin role
DO $$
DECLARE
  user_id UUID;
  role_id UUID;
  admin_email TEXT := 'admin@nyikasafaris.com';
  admin_password TEXT := '12345678';
  admin_name TEXT := 'Admin User';
  
  -- Function to check if user exists
  FUNCTION user_exists(email TEXT) RETURNS BOOLEAN AS $$
  DECLARE
    user_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO user_count FROM auth.users WHERE email = $1;
    RETURN user_count > 0;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;
  
  -- Function to create user using Supabase Auth admin API
  FUNCTION create_auth_user(email TEXT, password TEXT, name TEXT) RETURNS UUID AS $$
  DECLARE
    response JSONB;
    user_id UUID;
    api_key TEXT;
    supabase_url TEXT;
  BEGIN
    -- Get the service role key and URL from environment variables
    -- In Supabase, these are available in the database
    SELECT current_setting('app.settings.service_role_key', true) INTO api_key;
    SELECT current_setting('app.settings.url', true) INTO supabase_url;
    
    -- If not set, use default values (these should be set in your Supabase project)
    IF api_key IS NULL THEN
      RAISE NOTICE 'Service role key not found in app.settings.service_role_key';
      RETURN NULL;
    END IF;
    
    IF supabase_url IS NULL THEN
      RAISE NOTICE 'Supabase URL not found in app.settings.url';
      RETURN NULL;
    END IF;
    
    -- Use Supabase Auth admin API to create user
    -- This is a placeholder - in practice, you would use the Supabase client or REST API
    -- from your application code, not from SQL
    RAISE NOTICE 'To create a user with email %, use the Supabase Admin API or Auth UI', email;
    RAISE NOTICE 'Then run: SELECT public.assign_super_admin(''%'');', email;
    
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

BEGIN
  -- Check if user already exists
  IF NOT user_exists(admin_email) THEN
    -- Create user (this is a placeholder - see note below)
    -- In practice, you should create the user through the Supabase Auth UI or API
    -- and then assign the super_admin role
    user_id := create_auth_user(admin_email, admin_password, admin_name);
    
    IF user_id IS NULL THEN
      RAISE NOTICE 'User creation requires manual intervention.';
      RAISE NOTICE '1. First, create a user with email % using the Supabase Auth UI or API', admin_email;
      RAISE NOTICE '2. Then run: SELECT public.assign_super_admin(''%'');', admin_email;
      RETURN;
    END IF;
  ELSE
    -- Get existing user ID
    SELECT id INTO user_id FROM auth.users WHERE email = admin_email LIMIT 1;
    RAISE NOTICE 'User % already exists with ID: %', admin_email, user_id;
  END IF;
  
  -- Get super_admin role ID
  SELECT id INTO role_id FROM public.roles WHERE name = 'super_admin' LIMIT 1;
  
  IF role_id IS NULL THEN
    RAISE EXCEPTION 'super_admin role not found. Make sure migrations have been run.';
  END IF;
  
  -- Assign super_admin role
  INSERT INTO public.user_roles (user_id, role_id, created_at, updated_at)
  VALUES (user_id, role_id, NOW(), NOW())
  ON CONFLICT (user_id, role_id) DO NOTHING;
  
  RAISE NOTICE 'Super admin user % has been created/updated with ID: %', admin_email, user_id;
  
  -- Output the user ID for reference
  RAISE NOTICE 'To log in, use email: % and password: %', admin_email, admin_password;
  
  -- Important security note: In a production environment, never log passwords
  -- This is just for development/testing purposes
  RAISE WARNING 'CHANGE THE PASSWORD AFTER FIRST LOGIN! This is a temporary password.';
  
  -- Create a profile for the admin user if it doesn't exist
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url, bio, website, phone, language_code, timezone, metadata)
  VALUES (
    user_id,
    'Admin',
    'User',
    '',
    'System Administrator',
    'https://nyikasafaris.com',
    '+255700000000',
    'en',
    'Africa/Nairobi',
    '{"is_admin": true}'
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    bio = EXCLUDED.bio,
    updated_at = NOW();
    
  RAISE NOTICE 'Admin profile created/updated for user ID: %', user_id;
  
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error creating admin user: %', SQLERRM;
END;
$$;

-- Note: In a production environment, it's recommended to:
-- 1. Create the user through the Supabase Auth UI or API
-- 2. Then run: SELECT public.assign_super_admin('admin@nyikasafaris.com');

-- To manually assign the super_admin role to an existing user:
-- SELECT public.assign_super_admin('admin@nyikasafaris.com');
