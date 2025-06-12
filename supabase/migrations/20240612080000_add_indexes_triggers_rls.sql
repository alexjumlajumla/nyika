-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_room_type ON public.room_type_amenities(room_type_id);
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_amenity ON public.room_type_amenities(amenity_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON public.rooms(room_type_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_room_types_modtime
BEFORE UPDATE ON public.room_types
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_room_type_amenities_updated_at
BEFORE UPDATE ON public.room_type_amenities
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Enable RLS and add policies for room_types
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.room_types
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.room_types
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.room_types
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Enable RLS and add policies for room_type_amenities
ALTER TABLE public.room_type_amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.room_type_amenities
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.room_type_amenities
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.room_type_amenities
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
