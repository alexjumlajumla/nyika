-- Create destinations table (reference for accommodations)
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    country TEXT NOT NULL,
    region TEXT,
    featured_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create accommodations table
CREATE TABLE IF NOT EXISTS public.accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    location JSONB NOT NULL, -- Contains address, city, country, coordinates
    price NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    check_in_time TIME,
    check_out_time TIME,
    max_guests INTEGER,
    min_nights INTEGER DEFAULT 1,
    cancellation_policy TEXT,
    tags TEXT[] DEFAULT '{}',
    contact_email TEXT,
    contact_phone TEXT,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_id UUID NOT NULL REFERENCES public.accommodations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    max_occupancy INTEGER NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    images TEXT[],
    amenities TEXT[],
    size_sqm INTEGER,
    bed_type TEXT,
    view TEXT,
    quantity_available INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(accommodation_id, name)
);

-- Create room types table
CREATE TABLE IF NOT EXISTS public.room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default room types
INSERT INTO public.room_types (name, description, icon) VALUES
('Standard', 'Standard room with basic amenities', 'bed'),
('Deluxe', 'Spacious room with premium amenities', 'star'),
('Suite', 'Luxury suite with separate living area', 'crown'),
('Family', 'Large room suitable for families', 'users'),
('Executive', 'Executive room with work area', 'briefcase'),
('Honeymoon', 'Romantic suite for couples', 'heart'),
('Villa', 'Private villa with exclusive amenities', 'home'),
('Penthouse', 'Luxury penthouse with premium features', 'award')
ON CONFLICT (name) DO NOTHING;

-- Create accommodation reviews table
CREATE TABLE IF NOT EXISTS public.accommodation_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_id UUID NOT NULL REFERENCES public.accommodations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(accommodation_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accommodations_location ON public.accommodations(location);
CREATE INDEX IF NOT EXISTS idx_accommodations_type ON public.accommodations(type);
CREATE INDEX IF NOT EXISTS idx_accommodations_price ON public.accommodations(price_per_night);
CREATE INDEX IF NOT EXISTS idx_rooms_accommodation ON public.rooms(accommodation_id);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_reviews ENABLE ROW LEVEL SECURITY;

-- Accommodations policies
CREATE POLICY "Enable read access for all users" ON public.accommodations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.accommodations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for admins" ON public.accommodations
    FOR UPDATE USING (auth.uid() = created_by OR auth.role() = 'service_role');

-- Rooms policies
CREATE POLICY "Enable read access for all users" ON public.rooms
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.rooms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reviews policies
CREATE POLICY "Enable read access for all users" ON public.accommodation_reviews
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.accommodation_reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own reviews" ON public.accommodation_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at
CREATE TRIGGER update_accommodations_updated_at
BEFORE UPDATE ON public.accommodations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.accommodation_reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to update the average rating
CREATE OR REPLACE FUNCTION update_accommodation_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.accommodations
    SET 
        rating = (
            SELECT AVG(rating)
            FROM public.accommodation_reviews
            WHERE accommodation_id = COALESCE(NEW.accommodation_id, OLD.accommodation_id)
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.accommodation_reviews
            WHERE accommodation_id = COALESCE(NEW.accommodation_id, OLD.accommodation_id)
        )
    WHERE id = COALESCE(NEW.accommodation_id, OLD.accommodation_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update the average rating
CREATE TRIGGER update_rating_after_insert
AFTER INSERT ON public.accommodation_reviews
FOR EACH ROW EXECUTE FUNCTION update_accommodation_rating();

CREATE TRIGGER update_rating_after_update
AFTER UPDATE ON public.accommodation_reviews
FOR EACH ROW EXECUTE FUNCTION update_accommodation_rating();

CREATE TRIGGER update_rating_after_delete
AFTER DELETE ON public.accommodation_reviews
FOR EACH ROW EXECUTE FUNCTION update_accommodation_rating();
