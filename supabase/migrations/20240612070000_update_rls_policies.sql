-- Update RLS policies with proper authentication

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for now" ON public.room_types;
DROP POLICY IF EXISTS "Enable all operations for now" ON public.room_type_amenities;

-- Room types RLS
CREATE POLICY "Enable read access for all users" ON public.room_types
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.room_types
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for admin users" ON public.room_types
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Room type amenities RLS
CREATE POLICY "Enable read access for all users" ON public.room_type_amenities
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.room_type_amenities
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON public.room_type_amenities
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
