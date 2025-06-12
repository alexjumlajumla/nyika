-- Add primary key to room_type_amenities
ALTER TABLE public.room_type_amenities 
    ADD CONSTRAINT pk_room_type_amenities 
    PRIMARY KEY (room_type_id, amenity_id);

-- Add unique constraint to accommodation_room_types
ALTER TABLE public.accommodation_room_types
    ADD CONSTRAINT uq_accommodation_room_types 
    UNIQUE (accommodation_id, room_type_id);

-- Add foreign key for room_type_amenities.room_type_id
ALTER TABLE public.room_type_amenities
    ADD CONSTRAINT fk_room_type_amenities_room_type
    FOREIGN KEY (room_type_id)
    REFERENCES public.room_types(id)
    ON DELETE CASCADE;

-- Add foreign key for room_type_amenities.amenity_id
ALTER TABLE public.room_type_amenities
    ADD CONSTRAINT fk_room_type_amenities_amenity
    FOREIGN KEY (amenity_id)
    REFERENCES public.amenities(id)
    ON DELETE CASCADE;

-- Add foreign key for accommodation_room_types.accommodation_id
ALTER TABLE public.accommodation_room_types
    ADD CONSTRAINT fk_accommodation_room_types_accommodation
    FOREIGN KEY (accommodation_id)
    REFERENCES public.accommodations(id)
    ON DELETE CASCADE;

-- Add foreign key for accommodation_room_types.room_type_id
ALTER TABLE public.accommodation_room_types
    ADD CONSTRAINT fk_accommodation_room_types_room_type
    FOREIGN KEY (room_type_id)
    REFERENCES public.room_types(id)
    ON DELETE CASCADE;

-- Add foreign key for rooms.accommodation_room_type_id
ALTER TABLE public.rooms
    ADD CONSTRAINT fk_rooms_accommodation_room_type
    FOREIGN KEY (accommodation_room_type_id)
    REFERENCES public.accommodation_room_types(id)
    ON DELETE SET NULL;
