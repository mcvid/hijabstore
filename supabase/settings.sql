-- SETTINGS & CONFIGURATION SCHEMA

-- 1. Site Config (Generic Key-Value store for global settings)
CREATE TABLE public.site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- RLS POLICIES
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Public can view site config
CREATE POLICY "Public can view site config" ON public.site_config
FOR SELECT USING (true);

-- Only admins can modify site config (Assuming a role or specific user IDs for now)
-- For this prototype, we'll allow authenticated users to update if we don't have a roles table yet, 
-- but in production this would be restricted to service_role or admin users.
CREATE POLICY "Admins can manage site config" ON public.site_config
FOR ALL USING (auth.role() = 'authenticated');

-- INITIAL DATA
INSERT INTO public.site_config (key, value, description)
VALUES (
  'homepage_sections',
  '[
    {"id": "hero", "name": "Main Hero", "type": "Slideshow", "active": true},
    {"id": "selection", "name": "Personalized Selection", "type": "Product Grid", "active": true},
    {"id": "promo", "name": "Promotional Banner", "type": "Visual Assets", "active": false},
    {"id": "featured", "name": "Featured Collections", "type": "Category Tiles", "active": true},
    {"id": "footer", "name": "Footer Info", "type": "Content Block", "active": true}
  ]'::jsonb,
  'Configuration for homepage sections order and visibility'
) ON CONFLICT (key) DO NOTHING;
