-- Create the function to update room type availability
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

-- Update existing data to set initial availability
UPDATE public.accommodation_room_types art
SET 
    quantity_available = subquery.available_count,
    is_available = (subquery.available_count > 0)
FROM (
    SELECT 
        accommodation_room_type_id,
        COUNT(*) FILTER (WHERE is_active = true AND is_available = true) as available_count
    FROM public.rooms
    WHERE accommodation_room_type_id IS NOT NULL
    GROUP BY accommodation_room_type_id
) subquery
WHERE art.id = subquery.accommodation_room_type_id;

-- Set is_available to false for room types with no rooms
UPDATE public.accommodation_room_types
SET 
    quantity_available = 0,
    is_available = false
WHERE id NOT IN (
    SELECT DISTINCT accommodation_room_type_id 
    FROM public.rooms 
    WHERE accommodation_room_type_id IS NOT NULL
);
