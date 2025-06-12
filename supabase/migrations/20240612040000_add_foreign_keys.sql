-- Add foreign key constraints after all tables are created

-- Add foreign key for rooms.room_type_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'rooms_room_type_id_fkey'
    ) THEN
        ALTER TABLE public.rooms
            ADD CONSTRAINT rooms_room_type_id_fkey
            FOREIGN KEY (room_type_id)
            REFERENCES public.room_types(id)
            ON DELETE SET NULL;
    END IF;
END $$;

-- Add foreign key for rooms.accommodation_room_type_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'rooms_accommodation_room_type_id_fkey'
    ) THEN
        ALTER TABLE public.rooms
            ADD CONSTRAINT rooms_accommodation_room_type_id_fkey
            FOREIGN KEY (accommodation_room_type_id)
            REFERENCES public.accommodation_room_types(id)
            ON DELETE SET NULL;
    END IF;
END $$;
