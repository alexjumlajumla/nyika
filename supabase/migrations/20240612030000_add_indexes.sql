-- Add indexes for better performance after all tables are created

-- Index for rooms.room_type_id
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON public.rooms(room_type_id);

-- Index for rooms.is_active (already exists in create_rooms_table.sql)
-- Index for rooms.is_available (already exists in create_rooms_table.sql)
-- These are commented out since they're already created in the initial table creation

-- Index for room_types.is_active
CREATE INDEX IF NOT EXISTS idx_room_types_is_active ON public.room_types(is_active);

-- Index for accommodation_room_types.is_available
CREATE INDEX IF NOT EXISTS idx_accommodation_room_types_is_available ON public.accommodation_room_types(is_available);

-- Index for accommodation_room_types.accommodation_id
CREATE INDEX IF NOT EXISTS idx_accommodation_room_types_accommodation_id ON public.accommodation_room_types(accommodation_id);

-- Index for room_type_amenities.room_type_id
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_room_type_id ON public.room_type_amenities(room_type_id);

-- Index for room_type_amenities.amenity_id
CREATE INDEX IF NOT EXISTS idx_room_type_amenities_amenity_id ON public.room_type_amenities(amenity_id);

-- Note: The following indexes will be added in a later migration after the columns are properly set up
-- CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON public.rooms(room_type_id);
-- CREATE INDEX IF NOT EXISTS idx_rooms_accommodation_room_type_id ON public.rooms(accommodation_room_type_id);
