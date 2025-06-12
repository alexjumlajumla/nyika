-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    accommodation_id UUID NOT NULL REFERENCES public.accommodations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    room_number TEXT,
    floor_number INTEGER,
    view_type TEXT,
    is_active BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    additional_amenities TEXT[] DEFAULT '{}',
    room_type_id UUID,
    accommodation_room_type_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT rooms_accommodation_id_room_number_key UNIQUE (accommodation_id, room_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rooms_accommodation_id ON public.rooms(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_rooms_is_active ON public.rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_is_available ON public.rooms(is_available);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for rooms
CREATE POLICY "Enable read access for all users" ON public.rooms
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.rooms
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.rooms
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.rooms IS 'Stores individual rooms within accommodations';
COMMENT ON COLUMN public.rooms.accommodation_id IS 'Reference to the accommodation this room belongs to';
COMMENT ON COLUMN public.rooms.room_number IS 'Unique identifier for the room within the accommodation';
COMMENT ON COLUMN public.rooms.is_active IS 'Whether the room is active and can be booked';
COMMENT ON COLUMN public.rooms.is_available IS 'Current availability status of the room';
COMMENT ON COLUMN public.rooms.additional_amenities IS 'Array of additional amenities specific to this room';
