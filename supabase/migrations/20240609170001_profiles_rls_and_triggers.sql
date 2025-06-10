-- This migration assumes the profiles table already exists
-- It only sets up RLS policies and triggers

-- Enable RLS if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile." 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Create or replace function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create or replace function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    avatar_url, 
    email_verified, 
    is_active, 
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'first_name',
      SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1)
    ),
    CASE 
      WHEN NEW.raw_user_meta_data->>'last_name' IS NOT NULL THEN NEW.raw_user_meta_data->>'last_name'
      WHEN NEW.raw_user_meta_data->>'full_name' IS NOT NULL 
        AND POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') > 0 
      THEN SUBSTRING(
        NEW.raw_user_meta_data->>'full_name' 
        FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1
      )
      ELSE NULL
    END,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE((NEW.raw_user_meta_data->>'email_verified')::boolean, NEW.email_confirmed_at IS NOT NULL, false),
    true,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT ALL ON TABLE public.profiles TO authenticated, service_role;
GRANT ALL ON FUNCTION public.handle_updated_at() TO authenticated, service_role;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated, service_role;
