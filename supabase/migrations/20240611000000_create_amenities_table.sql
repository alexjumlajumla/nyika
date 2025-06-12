-- Create amenities table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category_id UUID,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT amenities_name_key UNIQUE (name)
);

-- Create categories table for amenity categories
CREATE TABLE IF NOT EXISTS public.amenity_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT amenity_categories_name_key UNIQUE (name)
);

-- Add foreign key constraint for category_id
ALTER TABLE public.amenities 
    ADD CONSTRAINT fk_amenity_category 
    FOREIGN KEY (category_id) 
    REFERENCES public.amenity_categories(id) 
    ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.amenity_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for amenities
CREATE POLICY "Enable read access for all users" ON public.amenities
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.amenities
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.amenities
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Create policies for amenity categories
CREATE POLICY "Enable read access for all users" ON public.amenity_categories
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.amenity_categories
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.amenity_categories
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_amenities_updated_at
BEFORE UPDATE ON public.amenities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_amenity_categories_updated_at
BEFORE UPDATE ON public.amenity_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default amenity categories
INSERT INTO public.amenity_categories (name, icon, description)
VALUES 
    ('General', 'check-circle', 'General amenities available in the accommodation'),
    ('Bathroom', 'droplet', 'Bathroom amenities and features'),
    ('Room', 'home', 'In-room amenities and features'),
    ('Food & Drink', 'coffee', 'Food and drink related amenities'),
    ('Media & Technology', 'monitor', 'Media and technology features'),
    ('Outdoor & View', 'sun', 'Outdoor features and views'),
    ('Accessibility', 'wheelchair', 'Accessibility features')
ON CONFLICT (name) DO NOTHING;

-- Insert default amenities
INSERT INTO public.amenities (name, description, icon, category_id, is_featured)
SELECT 
    amenity.name,
    amenity.description,
    amenity.icon,
    (SELECT id FROM public.amenity_categories WHERE name = amenity.category_name LIMIT 1),
    amenity.is_featured
FROM (
    VALUES 
        ('Free WiFi', 'High-speed internet access', 'wifi', 'General', true),
        ('Air Conditioning', 'Air conditioning in all rooms', 'wind', 'Room', true),
        ('Swimming Pool', 'Outdoor swimming pool', 'droplets', 'Outdoor & View', true),
        ('Restaurant', 'On-site restaurant', 'utensils', 'Food & Drink', true),
        ('Parking', 'Free private parking available', 'car', 'General', true),
        ('24-Hour Front Desk', '24-hour front desk service', 'clock', 'General', false),
        ('Room Service', '24-hour room service', 'coffee', 'Food & Drink', false),
        ('Fitness Center', 'Fully equipped fitness center', 'dumbbell', 'General', false),
        ('Spa', 'Full-service spa', 'heart-pulse', 'General', false),
        ('Bar', 'On-site bar', 'glass-wine', 'Food & Drink', false),
        ('Airport Shuttle', 'Airport shuttle service', 'plane-landing', 'General', false),
        ('Laundry Service', 'Laundry and dry cleaning service', 'shirt', 'General', false),
        ('Business Center', 'Business center with printing facilities', 'briefcase', 'General', false),
        ('Concierge', 'Concierge service', 'bell', 'General', false),
        ('Garden', 'Beautiful garden area', 'trees', 'Outdoor & View', false)
) AS amenity(name, description, icon, category_name, is_featured)
ON CONFLICT (name) DO NOTHING;
