-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS update_room_availability_after_insert ON public.rooms;
DROP TRIGGER IF EXISTS update_room_availability_after_update ON public.rooms;
DROP TRIGGER IF EXISTS update_room_availability_after_delete ON public.rooms;
DROP FUNCTION IF EXISTS public.update_room_type_availability();

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rooms;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.rooms;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.rooms;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.room_types;
DROP POLICY IF EXISTS "Enable all operations for now" ON public.room_types;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.room_type_amenities;
DROP POLICY IF EXISTS "Enable all operations for now" ON public.room_type_amenities;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.accommodation_room_types;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.accommodation_room_types;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.accommodation_room_types;

-- Drop existing tables in reverse order of dependencies
DROP TABLE IF EXISTS public.room_type_amenities CASCADE;
DROP TABLE IF EXISTS public.accommodation_room_types CASCADE;
DROP TABLE IF EXISTS public.room_types CASCADE;

-- Create room_types table
CREATE TABLE IF NOT EXISTS public.room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    base_occupancy INTEGER NOT NULL DEFAULT 2,
    max_occupancy INTEGER NOT NULL DEFAULT 2,
    base_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT room_types_name_key UNIQUE (name)
);

-- Create room_type_amenities table
CREATE TABLE IF NOT EXISTS public.room_type_amenities (
    room_type_id UUID NOT NULL,
    amenity_id UUID NOT NULL,
    is_included BOOLEAN DEFAULT true,
    additional_charge DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (room_type_id, amenity_id)
);

-- Create accommodation_room_types table
CREATE TABLE IF NOT EXISTS public.accommodation_room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_id UUID NOT NULL,
    room_type_id UUID NOT NULL,
    price_override DECIMAL(10, 2),
    quantity_available INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT accommodation_room_types_accommodation_room_type_key UNIQUE (accommodation_id, room_type_id)
);

-- Add columns to rooms table if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'rooms' AND column_name = 'room_type_id') THEN
        ALTER TABLE public.rooms ADD COLUMN room_type_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'rooms' AND column_name = 'accommodation_room_type_id') THEN
        ALTER TABLE public.rooms ADD COLUMN accommodation_room_type_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'rooms' AND column_name = 'room_number') THEN
        ALTER TABLE public.rooms ADD COLUMN room_number TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'rooms' AND column_name = 'floor_number') THEN
        ALTER TABLE public.rooms ADD COLUMN floor_number INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'rooms' AND column_name = 'view_type') THEN
        ALTER TABLE public.rooms ADD COLUMN view_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'rooms' AND column_name = 'additional_amenities') THEN
        ALTER TABLE public.rooms ADD COLUMN additional_amenities TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add foreign key constraints
ALTER TABLE public.room_type_amenities
    ADD CONSTRAINT fk_room_type_amenities_room_type
    FOREIGN KEY (room_type_id)
    REFERENCES public.room_types(id)
    ON DELETE CASCADE;

ALTER TABLE public.room_type_amenities
    ADD CONSTRAINT fk_room_type_amenities_amenity
    FOREIGN KEY (amenity_id)
    REFERENCES public.amenities(id)
    ON DELETE CASCADE;

ALTER TABLE public.accommodation_room_types
    ADD CONSTRAINT fk_accommodation_room_types_accommodation
    FOREIGN KEY (accommodation_id)
    REFERENCES public.accommodations(id)
    ON DELETE CASCADE;

ALTER TABLE public.accommodation_room_types
    ADD CONSTRAINT fk_accommodation_room_types_room_type
    FOREIGN KEY (room_type_id)
    REFERENCES public.room_types(id)
    ON DELETE CASCADE;

ALTER TABLE public.rooms
    ADD CONSTRAINT fk_rooms_room_type
    FOREIGN KEY (room_type_id)
    REFERENCES public.room_types(id)
    ON DELETE SET NULL;

ALTER TABLE public.rooms
    ADD CONSTRAINT fk_rooms_accommodation_room_type
    FOREIGN KEY (accommodation_room_type_id)
    REFERENCES public.accommodation_room_types(id)
    ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_room_type ON public.room_type_amenities(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_amenity ON public.room_type_amenities(amenity_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_room_types_accommodation ON public.accommodation_room_types(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_accommodation_room_types_room_type ON public.accommodation_room_types(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type ON public.rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_rooms_accommodation_room_type ON public.rooms(accommodation_room_type_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE TRIGGER update_room_types_updated_at
BEFORE UPDATE ON public.room_types
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE OR REPLACE TRIGGER update_room_type_amenities_updated_at
BEFORE UPDATE ON public.room_type_amenities
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE OR REPLACE TRIGGER update_accommodation_room_types_updated_at
BEFORE UPDATE ON public.accommodation_room_types
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Create function to update room type availability
CREATE OR REPLACE FUNCTION public.update_room_type_availability()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the quantity_available in accommodation_room_types
    -- based on the count of active and available rooms
    UPDATE public.accommodation_room_types art
    SET 
        quantity_available = subquery.available_count,
        is_available = (subquery.available_count > 0),
        updated_at = NOW()
    FROM (
        SELECT 
            accommodation_room_type_id,
            COUNT(*) FILTER (WHERE is_active = true AND is_available = true) as available_count
        FROM public.rooms
        WHERE accommodation_room_type_id IS NOT NULL
        GROUP BY accommodation_room_type_id
    ) subquery
    WHERE art.id = subquery.accommodation_room_type_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update room type availability
CREATE OR REPLACE TRIGGER update_room_availability_after_insert
AFTER INSERT ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_room_type_availability();

CREATE OR REPLACE TRIGGER update_room_availability_after_update
AFTER UPDATE OF is_active, is_available, accommodation_room_type_id ON public.rooms
FOR EACH ROW
WHEN (
    OLD.is_active IS DISTINCT FROM NEW.is_active OR 
    OLD.is_available IS DISTINCT FROM NEW.is_available OR
    OLD.accommodation_room_type_id IS DISTINCT FROM NEW.accommodation_room_type_id
)
EXECUTE FUNCTION public.update_room_type_availability();

CREATE OR REPLACE TRIGGER update_room_availability_after_delete
AFTER DELETE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_room_type_availability();

-- Create RLS policies
-- Room types
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.room_types
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.room_types
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.room_types
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Room type amenities
ALTER TABLE public.room_type_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.room_type_amenities
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.room_type_amenities
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.room_type_amenities
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Accommodation room types
ALTER TABLE public.accommodation_room_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.accommodation_room_types
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.accommodation_room_types
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.accommodation_room_types
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Insert default room types
INSERT INTO public.room_types (name, description, icon, base_occupancy, max_occupancy, base_price, is_active)
VALUES 
    ('Standard Room', 'Comfortable room with standard amenities', 'bed', 2, 2, 100.00, true),
    ('Deluxe Room', 'Spacious room with premium amenities', 'king-bed', 2, 3, 150.00, true),
    ('Family Suite', 'Luxurious suite with separate living area', 'apartment', 2, 4, 250.00, true),
    ('Executive Suite', 'Premium suite with work area and extra space', 'briefcase', 1, 2, 300.00, true),
    ('Honeymoon Suite', 'Romantic suite for couples', 'heart', 2, 2, 350.00, true),
    ('Penthouse', 'Luxury penthouse with premium features', 'award', 2, 4, 500.00, true)
ON CONFLICT (name) DO NOTHING;

-- Update existing rooms to have a default room type if needed
UPDATE public.rooms
SET room_type_id = (SELECT id FROM public.room_types WHERE name = 'Standard Room' LIMIT 1)
WHERE room_type_id IS NULL;
