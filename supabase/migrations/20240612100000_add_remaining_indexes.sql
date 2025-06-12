-- Add indexes that depend on columns that are added in later migrations

-- Index for rooms.room_type_id
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON public.rooms(room_type_id);

-- Index for rooms.accommodation_room_type_id
CREATE INDEX IF NOT EXISTS idx_rooms_accommodation_room_type_id ON public.rooms(accommodation_room_type_id);

-- Index for accommodation_room_types.room_type_id
CREATE INDEX IF NOT EXISTS idx_accommodation_room_types_room_type_id ON public.accommodation_room_types(room_type_id);

-- Add any other indexes that might be needed for performance
-- This is a good place to add any additional indexes that depend on the final schema
