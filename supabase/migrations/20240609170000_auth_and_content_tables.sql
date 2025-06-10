-- Migration for authentication, roles, permissions, and content management

-- 1. Create roles table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create user_roles junction table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- 3. Create permissions table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(resource, action)
);

-- 4. Create role_permissions junction table
CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (role_id, permission_id)
);

-- 5. Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
    published_at TIMESTAMPTZ,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    seo_title TEXT,
    seo_description TEXT,
    seo_keywords TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create blog categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Blog to category relationship
CREATE TABLE IF NOT EXISTS public.blog_category_relations (
    blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, category_id)
);

-- 8. Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Create translations table
CREATE TABLE IF NOT EXISTS public.translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    namespace TEXT NOT NULL,
    key TEXT NOT NULL,
    locale TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(namespace, key, locale)
);

-- 10. Create languages table
CREATE TABLE IF NOT EXISTS public.languages (
    code CHAR(2) PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Create audit logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON public.blogs(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON public.blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_translations_key ON public.translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_locale ON public.translations(locale);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all new tables
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('roles', 'user_roles', 'permissions', 'role_permissions', 
                         'blogs', 'blog_categories', 'settings', 'translations', 'languages')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %I', t.table_name, t.table_name);
        EXECUTE format('CREATE TRIGGER update_%s_updated_at
                      BEFORE UPDATE ON %I
                      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
                      t.table_name, t.table_name);
    END LOOP;
END;
$$;

-- Insert default roles
INSERT INTO public.roles (id, name, description, is_system, created_at, updated_at)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'super_admin', 'Super Administrator with full access', true, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'admin', 'Administrator with full content access', true, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'editor', 'Can create and edit content', true, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000004', 'author', 'Can create and manage their own content', true, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000005', 'customer', 'Registered customer', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    is_system = EXCLUDED.is_system,
    updated_at = NOW();

-- Insert default permissions
WITH perms AS (
    INSERT INTO public.permissions (name, description, resource, action, created_at, updated_at)
    VALUES 
        ('users:read', 'View users', 'users', 'read', NOW(), NOW()),
        ('users:create', 'Create users', 'users', 'create', NOW(), NOW()),
        ('users:update', 'Update users', 'users', 'update', NOW(), NOW()),
        ('users:delete', 'Delete users', 'users', 'delete', NOW(), NOW()),
        ('roles:read', 'View roles', 'roles', 'read', NOW(), NOW()),
        ('roles:create', 'Create roles', 'roles', 'create', NOW(), NOW()),
        ('roles:update', 'Update roles', 'roles', 'update', NOW(), NOW()),
        ('roles:delete', 'Delete roles', 'roles', 'delete', NOW(), NOW()),
        ('tours:read', 'View tours', 'tours', 'read', NOW(), NOW()),
        ('tours:create', 'Create tours', 'tours', 'create', NOW(), NOW()),
        ('tours:update', 'Update tours', 'tours', 'update', NOW(), NOW()),
        ('tours:delete', 'Delete tours', 'tours', 'delete', NOW(), NOW()),
        ('destinations:read', 'View destinations', 'destinations', 'read', NOW(), NOW()),
        ('destinations:create', 'Create destinations', 'destinations', 'create', NOW(), NOW()),
        ('destinations:update', 'Update destinations', 'destinations', 'update', NOW(), NOW()),
        ('destinations:delete', 'Delete destinations', 'destinations', 'delete', NOW(), NOW()),
        ('blogs:read', 'View blogs', 'blogs', 'read', NOW(), NOW()),
        ('blogs:create', 'Create blogs', 'blogs', 'create', NOW(), NOW()),
        ('blogs:update', 'Update blogs', 'blogs', 'update', NOW(), NOW()),
        ('blogs:delete', 'Delete blogs', 'blogs', 'delete', NOW(), NOW()),
        ('settings:read', 'View settings', 'settings', 'read', NOW(), NOW()),
        ('settings:update', 'Update settings', 'settings', 'update', NOW(), NOW())
    ON CONFLICT (resource, action) DO UPDATE SET 
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        updated_at = NOW()
    RETURNING id, resource, action
)
-- Assign all permissions to super_admin role
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT '00000000-0000-0000-0000-000000000001', id, NOW()
FROM perms
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Insert default languages
INSERT INTO public.languages (code, name, native_name, is_default, is_active, created_at, updated_at)
VALUES 
    ('en', 'English', 'English', true, true, NOW(), NOW()),
    ('sw', 'Swahili', 'Kiswahili', false, true, NOW(), NOW())
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name,
    native_name = EXCLUDED.native_name,
    is_default = EXCLUDED.is_default,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert default settings
INSERT INTO public.settings (key, value, description, is_public, created_at, updated_at)
VALUES 
    ('site.title', '"Nyika Safaris"'::jsonb, 'Site title', true, NOW(), NOW()),
    ('site.description', '"Experience the best safaris in Africa"'::jsonb, 'Site description', true, NOW(), NOW()),
    ('site.logo', '"/images/logo.png"'::jsonb, 'Site logo URL', true, NOW(), NOW()),
    ('site.favicon', '"/favicon.ico"'::jsonb, 'Favicon URL', true, NOW(), NOW()),
    ('site.contact_email', '"info@nyikasafaris.com"'::jsonb, 'Contact email', true, NOW(), NOW()),
    ('site.contact_phone', '"+255 123 456 789"'::jsonb, 'Contact phone', true, NOW(), NOW()),
    ('site.address', '{"line1": "123 Safari Street", "city": "Arusha", "country": "Tanzania"}'::jsonb, 'Physical address', true, NOW(), NOW()),
    ('social.facebook', '"https://facebook.com/nyikasafaris"'::jsonb, 'Facebook URL', true, NOW(), NOW()),
    ('social.instagram', '"https://instagram.com/nyikasafaris"'::jsonb, 'Instagram URL', true, NOW(), NOW()),
    ('social.twitter', '"https://twitter.com/nyikasafaris"'::jsonb, 'Twitter URL', true, NOW(), NOW()),
    ('seo.meta_title', '"Nyika Safaris | Best Safari Tours in Africa"'::jsonb, 'Default meta title', true, NOW(), NOW()),
    ('seo.meta_description', '"Experience the best safari tours in Africa with Nyika Safaris. Book your adventure today!"'::jsonb, 'Default meta description', true, NOW(), NOW()),
    ('seo.meta_keywords', '["safari", "africa", "tanzania", "tours", "travel"]'::jsonb, 'Default meta keywords', true, NOW(), NOW())
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    is_public = EXCLUDED.is_public,
    updated_at = NOW();

-- Enable RLS on all new tables
DO $$
DECLARE
    t RECORD;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('roles', 'user_roles', 'permissions', 'role_permissions', 
                         'blogs', 'blog_categories', 'settings', 'translations', 'languages', 'audit_logs')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t.table_name);
    END LOOP;
END;
$$;

-- Create default RLS policies for new tables
DO $$
BEGIN
    -- Public read access for languages and translations
    CREATE POLICY "Enable read access for all users" ON public.languages
        FOR SELECT USING (true);
        
    CREATE POLICY "Enable read access for all users" ON public.translations
        FOR SELECT USING (true);
        
    -- Authenticated users can read public settings
    CREATE POLICY "Enable read access for authenticated users" ON public.settings
        FOR SELECT TO authenticated USING (is_public = true);
        
    -- Admin users have full access to all tables
    -- We'll create individual policies for each table instead of using ALL TABLES
    CREATE POLICY "Enable all access for admin users" ON public.roles
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.user_roles
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.permissions
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.role_permissions
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.blogs
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.blog_categories
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.settings
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.translations
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.languages
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    CREATE POLICY "Enable all access for admin users" ON public.audit_logs
        TO authenticated USING (EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid() AND r.name IN ('super_admin', 'admin')
        ));
        
    -- Blog authors can manage their own posts
    CREATE POLICY "Enable authors to manage their own blogs" ON public.blogs
        FOR ALL USING (author_id = auth.uid())
        WITH CHECK (author_id = auth.uid());
        
EXCEPTION WHEN duplicate_object THEN
    -- Policies already exist, do nothing
    NULL;
END $$;

-- Grant necessary permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO service_role;
