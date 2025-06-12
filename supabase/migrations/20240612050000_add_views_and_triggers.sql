-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for accommodation_room_types
CREATE TRIGGER update_accommodation_room_types_modtime
BEFORE UPDATE ON public.accommodation_room_types
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Create the available_room_types view
CREATE OR REPLACE VIEW public.available_room_types AS
SELECT 
    art.id,
    art.accommodation_id,
    art.room_type_id,
    art.price_override,
    art.quantity_available,
    art.is_available,
    art.created_at,
    art.updated_at,
    COALESCE(art.price_override, rt.base_price) AS effective_price,
    rt.name AS room_type_name,
    rt.description AS room_type_description,
    rt.base_occupancy,
    rt.max_occupancy,
    rt.base_price,
    rt.icon AS room_type_icon,
    (
        SELECT COUNT(*)
        FROM public.rooms r
        WHERE r.accommodation_room_type_id = art.id
        AND r.is_active = true
        AND r.is_available = true
    ) AS available_rooms_count,
    a.name AS accommodation_name,
    a.slug AS accommodation_slug,
    (
        SELECT COUNT(*)
        FROM public.rooms r
        WHERE r.accommodation_room_type_id = art.id
        AND r.is_active = true
    ) AS total_rooms,
    (
        SELECT COUNT(*)
        FROM public.rooms r
        WHERE r.accommodation_room_type_id = art.id
        AND r.is_active = true
        AND r.is_available = true
        AND NOT EXISTS (
            SELECT 1
            FROM public.bookings b
            WHERE b.room_id = r.id
            AND b.status IN ('confirmed', 'pending')
            AND b.check_out_date > NOW()
        )
    ) AS available_rooms
FROM public.accommodation_room_types art
JOIN public.room_types rt ON art.room_type_id = rt.id
JOIN public.accommodations a ON art.accommodation_id = a.id
WHERE art.is_available = true
AND rt.is_active = true
AND a.is_active = true;

-- Create function to update room type availability
CREATE OR REPLACE FUNCTION public.update_room_type_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        UPDATE public.accommodation_room_types art
        SET 
            quantity_available = (
                SELECT COUNT(*)
                FROM public.rooms r
                WHERE r.accommodation_room_type_id = COALESCE(NEW.accommodation_room_type_id, OLD.accommodation_room_type_id)
                AND r.is_active = true
                AND r.is_available = true
            ),
            is_available = (
                SELECT COUNT(*) > 0
                FROM public.rooms r
                WHERE r.accommodation_room_type_id = COALESCE(NEW.accommodation_room_type_id, OLD.accommodation_room_type_id)
                AND r.is_active = true
                AND r.is_available = true
            )
        WHERE art.id = COALESCE(NEW.accommodation_room_type_id, OLD.accommodation_room_type_id);
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
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
WHEN (OLD.is_active IS DISTINCT FROM NEW.is_active OR 
      OLD.is_available IS DISTINCT FROM NEW.is_available OR
      OLD.accommodation_room_type_id IS DISTINCT FROM NEW.accommodation_room_type_id)
EXECUTE FUNCTION public.update_room_type_availability();

CREATE OR REPLACE TRIGGER update_room_availability_after_delete
AFTER DELETE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_room_type_availability();
