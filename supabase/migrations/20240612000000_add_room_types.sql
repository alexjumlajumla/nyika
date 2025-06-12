-- Create room_types table if it doesn't exist
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

-- Create room_type_amenities table for many-to-many relationship
-- This is created after the amenities table in the previous migration
CREATE TABLE IF NOT EXISTS public.room_type_amenities (
    room_type_id UUID NOT NULL,
    amenity_id UUID NOT NULL,
    is_included BOOLEAN DEFAULT true,
    additional_charge DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create accommodation_room_types table for accommodation-specific overrides
CREATE TABLE IF NOT EXISTS public.accommodation_room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_id UUID NOT NULL,
    room_type_id UUID NOT NULL,
    price_override DECIMAL(10, 2),
    quantity_available INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Update rooms table to reference accommodation_room_types
ALTER TABLE public.rooms 
    ADD COLUMN IF NOT EXISTS accommodation_room_type_id UUID,
    ADD COLUMN IF NOT EXISTS room_number TEXT,
    ADD COLUMN IF NOT EXISTS floor_number INTEGER,
    ADD COLUMN IF NOT EXISTS view_type TEXT,
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS additional_amenities TEXT[] DEFAULT '{}';

-- Insert default room types if they don't exist
INSERT INTO public.room_types (name, description, icon, base_occupancy, max_occupancy, base_price, is_active)
VALUES 
    ('Standard Room', 'Comfortable room with standard amenities', 'bed', 2, 2, 100.00, true),
    ('Deluxe Room', 'Spacious room with premium amenities', 'king-bed', 2, 3, 150.00, true),
    ('Family Suite', 'Luxurious suite with separate living area', 'apartment', 2, 4, 250.00, true),
    ('Executive Suite', 'Premium suite with work area and extra space', 'briefcase', 1, 2, 300.00, true),
    ('Honeymoon Suite', 'Romantic suite for couples', 'heart', 2, 2, 350.00, true),
    ('Penthouse', 'Luxury penthouse with premium features', 'award', 2, 4, 500.00, true)
ON CONFLICT (name) DO NOTHING;
