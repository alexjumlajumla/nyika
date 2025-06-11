-- Update tours table
DO $$
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'difficulty_level') THEN
    ALTER TABLE public.tours ADD COLUMN difficulty_level TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'group_size_min') THEN
    ALTER TABLE public.tours ADD COLUMN group_size_min INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'group_size_max') THEN
    ALTER TABLE public.tours ADD COLUMN group_size_max INTEGER;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'start_location') THEN
    ALTER TABLE public.tours ADD COLUMN start_location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'end_location') THEN
    ALTER TABLE public.tours ADD COLUMN end_location TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'price_includes') THEN
    ALTER TABLE public.tours ADD COLUMN price_includes JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'price_excludes') THEN
    ALTER TABLE public.tours ADD COLUMN price_excludes JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'highlights') THEN
    ALTER TABLE public.tours ADD COLUMN highlights TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'itinerary') THEN
    ALTER TABLE public.tours ADD COLUMN itinerary JSONB;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'seo_keywords') THEN
    ALTER TABLE public.tours ADD COLUMN seo_keywords TEXT[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'status') THEN
    ALTER TABLE public.tours ADD COLUMN status TEXT DEFAULT 'draft';
  END IF;
  
  -- Update tour_categories table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tour_categories' AND column_name = 'icon') THEN
    ALTER TABLE public.tour_categories ADD COLUMN icon TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tour_categories' AND column_name = 'is_active') THEN
    ALTER TABLE public.tour_categories ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tour_categories' AND column_name = 'sort_order') THEN
    ALTER TABLE public.tour_categories ADD COLUMN sort_order INTEGER DEFAULT 0;
  END IF;
  
  -- Update destinations table
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'region') THEN
    ALTER TABLE public.destinations ADD COLUMN region TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'latitude') THEN
    ALTER TABLE public.destinations ADD COLUMN latitude DECIMAL(10, 8);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'longitude') THEN
    ALTER TABLE public.destinations ADD COLUMN longitude DECIMAL(11, 8);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'is_active') THEN
    ALTER TABLE public.destinations ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'featured_image') THEN
    ALTER TABLE public.destinations ADD COLUMN featured_image TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'destinations' AND column_name = 'gallery') THEN
    ALTER TABLE public.destinations ADD COLUMN gallery TEXT[];
  END IF;
  
  -- Create indexes if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tours_category_id') THEN
    CREATE INDEX idx_tours_category_id ON public.tours(category_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tours_destination_id') THEN
    CREATE INDEX idx_tours_destination_id ON public.tours(destination_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_tours_status') THEN
    CREATE INDEX idx_tours_status ON public.tours(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_categories_slug') THEN
    CREATE INDEX idx_categories_slug ON public.tour_categories(slug);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_destinations_slug') THEN
    CREATE INDEX idx_destinations_slug ON public.destinations(slug);
  END IF;
  
  -- Add comments if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objoid = 'public.tours'::regclass AND objsubid = (SELECT attnum FROM pg_attribute WHERE attname = 'difficulty_level' AND attrelid = 'public.tours'::regclass)) THEN
    COMMENT ON COLUMN public.tours.difficulty_level IS 'Difficulty level of the tour (easy, moderate, challenging, difficult)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objoid = 'public.tours'::regclass AND objsubid = (SELECT attnum FROM pg_attribute WHERE attname = 'status' AND attrelid = 'public.tours'::regclass)) THEN
    COMMENT ON COLUMN public.tours.status IS 'Publication status of the tour (draft, published, archived)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objoid = 'public.tour_categories'::regclass AND objsubid = (SELECT attnum FROM pg_attribute WHERE attname = 'icon' AND attrelid = 'public.tour_categories'::regclass)) THEN
    COMMENT ON COLUMN public.tour_categories.icon IS 'Icon name for the category (for UI display)';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objoid = 'public.tour_categories'::regclass AND objsubid = (SELECT attnum FROM pg_attribute WHERE attname = 'is_active' AND attrelid = 'public.tour_categories'::regclass)) THEN
    COMMENT ON COLUMN public.tour_categories.is_active IS 'Whether the category is active and visible to users';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_description WHERE objoid = 'public.destinations'::regclass AND objsubid = (SELECT attnum FROM pg_attribute WHERE attname = 'is_active' AND attrelid = 'public.destinations'::regclass)) THEN
    COMMENT ON COLUMN public.destinations.is_active IS 'Whether the destination is active and visible to users';
  END IF;
  
  RAISE NOTICE 'Database schema updated successfully';
EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'Error updating database schema: %', SQLERRM;
END $$;
