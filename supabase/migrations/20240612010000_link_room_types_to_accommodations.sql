-- Create accommodation_room_types junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.accommodation_room_types (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    accommodation_id UUID NOT NULL,
    room_type_id UUID NOT NULL,
    price_override DECIMAL(10, 2), -- Allow per-accommodation pricing
    quantity_available INTEGER,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (accommodation_id, room_type_id)
);

-- Add the accommodation_room_type_id column to rooms table
ALTER TABLE public.rooms 
    ADD COLUMN IF NOT EXISTS accommodation_room_type_id UUID;

-- Enable RLS on accommodation_room_types
ALTER TABLE public.accommodation_room_types ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for accommodation_room_types
CREATE POLICY "Enable read access for all users" ON public.accommodation_room_types
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.accommodation_room_types
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.accommodation_room_types
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE public.accommodation_room_types IS 'Links accommodations to their available room types with optional price overrides';

-- Triggers will be added in a later migration after the function is created

-- Create a function to get the effective price of a room type at an accommodation
CREATE OR REPLACE FUNCTION public.get_effective_room_type_price(
    p_accommodation_id UUID,
    p_room_type_id UUID
) RETURNS DECIMAL(10, 2) AS $$
DECLARE
    v_effective_price DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(art.price_override, rt.base_price)
    INTO v_effective_price
    FROM public.room_types rt
    LEFT JOIN public.accommodation_room_types art 
        ON rt.id = art.room_type_id 
        AND art.accommodation_id = p_accommodation_id
    WHERE rt.id = p_room_type_id;
    
    RETURN v_effective_price;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update the room_type_amenities table to include accommodation-specific overrides
-- First, add the columns without the primary key constraint
ALTER TABLE public.room_type_amenities
    ADD COLUMN IF NOT EXISTS accommodation_id UUID,
    ADD COLUMN IF NOT EXISTS is_included BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS additional_charge DECIMAL(10, 2) DEFAULT 0;

-- Add a default UUID for NULL accommodation_ids if needed
UPDATE public.room_type_amenities 
SET accommodation_id = '00000000-0000-0000-0000-000000000000' 
WHERE accommodation_id IS NULL;

-- Now add the NOT NULL constraint to accommodation_id
ALTER TABLE public.room_type_amenities 
    ALTER COLUMN accommodation_id SET NOT NULL;

-- Add the foreign key constraint
ALTER TABLE public.room_type_amenities
    ADD CONSTRAINT fk_room_type_amenities_accommodation
    FOREIGN KEY (accommodation_id) 
    REFERENCES public.accommodations(id) 
    ON DELETE CASCADE;

-- Drop the existing primary key if it exists
ALTER TABLE public.room_type_amenities
    DROP CONSTRAINT IF EXISTS room_type_amenities_pkey;

-- Add the new primary key without using COALESCE
ALTER TABLE public.room_type_amenities
    ADD PRIMARY KEY (room_type_id, amenity_id, accommodation_id);

-- Add index for the accommodation-specific amenities
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_accommodation ON public.room_type_amenities(accommodation_id);

-- Update the RLS policies for room_type_amenities
DROP POLICY IF EXISTS "Enable read access for all users" ON public.room_type_amenities;
CREATE POLICY "Enable read access for all users" ON public.room_type_amenities
    FOR SELECT USING (true);

-- Add comments for documentation
COMMENT ON TABLE public.accommodation_room_types IS 'Links accommodations to their available room types with optional price overrides';
COMMENT ON COLUMN public.accommodation_room_types.price_override IS 'Optional override for the base price of this room type at this accommodation';
COMMENT ON COLUMN public.accommodation_room_types.is_available IS 'Whether this room type is currently available at this accommodation';

-- Update the rooms table to include the new relationship
COMMENT ON COLUMN public.rooms.accommodation_room_type_id IS 'References the specific accommodation-room-type relationship for this room';
