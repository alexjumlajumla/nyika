-- Update tours table
ALTER TABLE public.tours
  ADD COLUMN IF NOT EXISTS difficulty_level TEXT,
  ADD COLUMN IF NOT EXISTS group_size_min INTEGER,
  ADD COLUMN IF NOT EXISTS group_size_max INTEGER,
  ADD COLUMN IF NOT EXISTS start_location TEXT,
  ADD COLUMN IF NOT EXISTS end_location TEXT,
  ADD COLUMN IF NOT EXISTS price_includes JSONB,
  ADD COLUMN IF NOT EXISTS price_excludes JSONB,
  ADD COLUMN IF NOT EXISTS highlights TEXT,
  ADD COLUMN IF NOT EXISTS itinerary JSONB,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';

-- Update tour_categories table
ALTER TABLE public.tour_categories
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update destinations table
ALTER TABLE public.destinations
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS featured_image TEXT,
  ADD COLUMN IF NOT EXISTS gallery TEXT[];

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tours_category_id ON public.tours(category_id);
CREATE INDEX IF NOT EXISTS idx_tours_destination_id ON public.tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_tours_status ON public.tours(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.tour_categories(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON public.destinations(slug);

-- Add comments for better documentation
COMMENT ON COLUMN public.tours.difficulty_level IS 'Difficulty level of the tour (easy, moderate, challenging, difficult)';
COMMENT ON COLUMN public.tours.status IS 'Publication status of the tour (draft, published, archived)';
COMMENT ON COLUMN public.tour_categories.icon IS 'Icon name for the category (for UI display)';
COMMENT ON COLUMN public.tour_categories.is_active IS 'Whether the category is active and visible to users';
COMMENT ON COLUMN public.destinations.is_active IS 'Whether the destination is active and visible to users';
