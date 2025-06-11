-- Create tours table
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    price_adult DECIMAL(10, 2) NOT NULL,
    price_child DECIMAL(10, 2),
    price_includes JSONB,
    price_excludes JSONB,
    difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'difficult')),
    group_size_min INTEGER,
    group_size_max INTEGER,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    featured_image TEXT,
    gallery JSONB,
    highlights JSONB,
    itinerary JSONB,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create tour categories table
CREATE TABLE IF NOT EXISTS public.tour_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tour to category relationship
CREATE TABLE IF NOT EXISTS public.tour_category_relations (
    tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.tour_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (tour_id, category_id)
);

-- Create tour destinations table
CREATE TABLE IF NOT EXISTS public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    featured_image TEXT,
    gallery JSONB,
    country TEXT,
    region TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create tour to destination relationship
CREATE TABLE IF NOT EXISTS public.tour_destinations (
    tour_id UUID NOT NULL REFERENCES public.tours(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    days_spent INTEGER DEFAULT 1,
    PRIMARY KEY (tour_id, destination_id)
);

-- Create RLS policies for tours
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable public read access for published tours" 
    ON public.tours 
    FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Enable all access for admins"
    ON public.tours
    USING (auth.role() = 'authenticated' AND 
           EXISTS (
               SELECT 1 FROM user_roles ur
               JOIN roles r ON ur.role_id = r.id
               WHERE ur.user_id = auth.uid() AND r.name = 'admin'
           ));

-- Create indexes for better performance
CREATE INDEX idx_tours_slug ON public.tours(slug);
CREATE INDEX idx_tours_status ON public.tours(status);
CREATE INDEX idx_tour_categories_slug ON public.tour_categories(slug);
CREATE INDEX idx_destinations_slug ON public.destinations(slug);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tours_updated_at
BEFORE UPDATE ON public.tours
FOR EACH ROW
EXECUTE FUNCTION update_tours_updated_at();

-- Create trigger for tour categories
CREATE OR REPLACE FUNCTION update_tour_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tour_categories_updated_at
BEFORE UPDATE ON public.tour_categories
FOR EACH ROW
EXECUTE FUNCTION update_tour_categories_updated_at();

-- Create trigger for destinations
CREATE OR REPLACE FUNCTION update_destinations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_destinations_updated_at
BEFORE UPDATE ON public.destinations
FOR EACH ROW
EXECUTE FUNCTION update_destinations_updated_at();
