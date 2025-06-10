-- Fresh Baseline Migration for Nyika Safaris
-- This migration will reset and recreate all database objects in the correct order

-- Drop all existing tables and types to start fresh
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Disable triggers to avoid dependency issues
    SET session_replication_role = 'replica';
    
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Drop all types
    FOR r IN (SELECT typname FROM pg_type t JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' AND t.typtype = 'e')
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;

    -- Re-enable triggers
    SET session_replication_role = 'origin';
END $$;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA public;

-- Create custom types
CREATE TYPE public.booking_status AS ENUM (
    'pending', 'confirmed', 'paid', 'cancelled', 'completed', 'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
    'pending', 'completed', 'failed', 'refunded', 'partially_refunded', 'cancelled'
);

CREATE TYPE public.payment_method AS ENUM (
    'pesapal', 'card', 'mpesa', 'bank_transfer', 'paypal', 'other'
);

-- Create tables in dependency order

-- 1. Currencies table (no dependencies)
CREATE TABLE public.currencies (
    code CHAR(3) PRIMARY KEY,
    name TEXT NOT NULL,
    symbol TEXT NOT NULL,
    decimal_places INTEGER NOT NULL DEFAULT 2,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tour Categories (no dependencies)
CREATE TABLE public.tour_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    featured_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Destinations (no dependencies)
CREATE TABLE public.destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    featured_image TEXT,
    gallery TEXT[],
    location JSONB,
    best_time_to_visit TEXT[],
    meta_title TEXT,
    meta_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tours (depends on tour_categories and destinations)
CREATE TABLE public.tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER,
    price_start_from DECIMAL(10, 2),
    featured_image TEXT,
    gallery TEXT[],
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    category_id UUID REFERENCES public.tour_categories(id) ON DELETE SET NULL,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    meta_title TEXT,
    meta_description TEXT,
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Accommodations (depends on destinations)
CREATE TABLE public.accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    location JSONB,
    price DECIMAL(10, 2) NOT NULL,
    rating NUMERIC(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    amenities TEXT[],
    images TEXT[],
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '11:00',
    max_guests INTEGER,
    min_nights INTEGER DEFAULT 1,
    cancellation_policy TEXT,
    tags TEXT[],
    contact_email TEXT,
    contact_phone TEXT,
    destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Bookings (depends on tours and auth.users)
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
    status public.booking_status DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) REFERENCES public.currencies(code) ON DELETE SET NULL,
    special_requests TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Payments (depends on bookings and auth.users)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) REFERENCES public.currencies(code) ON DELETE SET NULL,
    status public.payment_status NOT NULL DEFAULT 'pending',
    payment_method public.payment_method NOT NULL,
    transaction_id TEXT,
    payment_provider_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PesaPal payments (depends on payments)
CREATE TABLE public.pesapal_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    order_tracking_id TEXT UNIQUE NOT NULL,
    merchant_reference TEXT,
    status TEXT NOT NULL,
    payment_method TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL,
    payment_status_description TEXT,
    payment_method_description TEXT,
    message TEXT,
    payment_id_provider TEXT,
    ipn_notification_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Payment webhook logs (depends on payments)
CREATE TABLE public.payment_webhook_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status_code INTEGER,
    response_body TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_tours_slug ON public.tours(slug);
CREATE INDEX idx_tours_category_id ON public.tours(category_id);
CREATE INDEX idx_tours_destination_id ON public.tours(destination_id);
CREATE INDEX idx_tours_is_featured ON public.tours(is_featured) WHERE is_featured = true;
CREATE INDEX idx_tours_is_active ON public.tours(is_active) WHERE is_active = true;

CREATE INDEX idx_destinations_slug ON public.destinations(slug);
CREATE INDEX idx_destinations_is_active ON public.destinations(is_active) WHERE is_active = true;

CREATE INDEX idx_tour_categories_slug ON public.tour_categories(slug);
CREATE INDEX idx_tour_categories_is_featured ON public.tour_categories(is_featured) WHERE is_featured = true;

CREATE INDEX idx_accommodations_slug ON public.accommodations(slug);
CREATE INDEX idx_accommodations_is_featured ON public.accommodations(is_featured) WHERE is_featured = true;
CREATE INDEX idx_accommodations_is_active ON public.accommodations(is_active) WHERE is_active = true;

CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON public.bookings(tour_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_status ON public.payments(status);

CREATE INDEX idx_pesapal_payments_order_id ON public.pesapal_payments(order_tracking_id);
CREATE INDEX idx_pesapal_payments_status ON public.pesapal_payments(status);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables with updated_at
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN 
        SELECT table_schema, table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I.%I', 
                      t.table_name, t.table_schema, t.table_name);
                      
        EXECUTE format('CREATE TRIGGER update_%s_updated_at
                      BEFORE UPDATE ON %I.%I
                      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
                      t.table_name, t.table_schema, t.table_name);
    END LOOP;
END;
$$;

-- Insert initial data
-- Insert default currencies
INSERT INTO public.currencies (code, name, symbol, decimal_places, is_active)
VALUES 
    ('USD', 'US Dollar', '$', 2, true),
    ('EUR', 'Euro', '€', 2, true),
    ('GBP', 'British Pound', '£', 2, true),
    ('KES', 'Kenyan Shilling', 'KSh', 2, true),
    ('TZS', 'Tanzanian Shilling', 'TSh', 0, true),
    ('UGX', 'Ugandan Shilling', 'USh', 0, true),
    ('ZAR', 'South African Rand', 'R', 2, true),
    ('ZMW', 'Zambian Kwacha', 'ZK', 2, true)
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    symbol = EXCLUDED.symbol,
    decimal_places = EXCLUDED.decimal_places,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Enable Row Level Security on all tables
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN 
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', 
                      t.table_schema, t.table_name);
    END LOOP;
END;
$$;

-- Create default RLS policies
-- Public read access for all tables
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN 
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    LOOP
        -- Drop existing policy if it exists
        EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all users" ON %I.%I', 
                      t.table_schema, t.table_name);
        
        -- Create read policy
        EXECUTE format('CREATE POLICY "Enable read access for all users" 
                      ON %I.%I 
                      FOR SELECT 
                      USING (true)', 
                      t.table_schema, t.table_name);
    END LOOP;
END;
$$;

-- Grant necessary permissions to database roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant read access to public tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Allow authenticated users to insert into certain tables
GRANT INSERT ON public.bookings, public.payments, public.pesapal_payments TO authenticated;

-- Allow authenticated users to update their own bookings and payments
GRANT UPDATE ON public.bookings TO authenticated;
GRANT UPDATE ON public.payments TO authenticated;

-- Set up realtime for relevant tables
ALTER PUBLICATION supabase_realtime 
ADD TABLE 
    public.tours,
    public.destinations,
    public.tour_categories,
    public.accommodations;
