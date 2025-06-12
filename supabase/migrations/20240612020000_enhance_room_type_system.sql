-- Create a view to get available room types with their effective prices
CREATE OR REPLACE VIEW public.available_room_types AS
SELECT 
    art.id,
    art.accommodation_id,
    art.room_type_id,
    rt.name AS room_type_name,
    rt.description AS room_type_description,
    rt.icon AS room_type_icon,
    rt.base_occupancy,
    rt.max_occupancy,
    COALESCE(art.price_override, rt.base_price) AS effective_price,
    rt.base_price,
    art.price_override,
    art.quantity_available,
    art.is_available,
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
    ) AS available_rooms_count,
    art.created_at,
    art.updated_at
FROM public.accommodation_room_types art
JOIN public.room_types rt ON art.room_type_id = rt.id
WHERE rt.is_active = true
AND art.is_available = true;

-- Create a function to update the quantity_available in accommodation_room_types
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

-- Add comments for documentation
COMMENT ON TABLE public.accommodation_room_types IS 'Links accommodations to their available room types with optional price overrides';
COMMENT ON COLUMN public.accommodation_room_types.price_override IS 'Optional override for the base price of this room type at this accommodation';
COMMENT ON COLUMN public.accommodation_room_types.is_available IS 'Whether this room type is currently available at this accommodation';

-- Update the rooms table to include the new relationship
COMMENT ON COLUMN public.rooms.accommodation_room_type_id IS 'References the specific accommodation-room-type relationship for this room';
