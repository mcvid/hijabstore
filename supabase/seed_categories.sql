-- Seed core categories for Yasmin Fashions
INSERT INTO public.categories (name, slug, description, image_url, show_in_main_nav, show_on_homepage, order_index)
VALUES 
('Women', 'women', 'Luxury modest wear for the modern woman.', '/images/women-hero.png', true, true, 0),
('Men', 'men', 'Sophisticated attire for the modern gentleman.', '/images/men-hero.png', true, true, 1),
('Fragrance', 'fragrance', 'Exquisite scents and aromatic oils.', '/images/fragrance-hero.png', true, true, 2)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    show_in_main_nav = EXCLUDED.show_in_main_nav;

-- Get the parent IDs
-- (Assuming slugs are enough for linking in a script, but for SQL we need IDs or subqueries)

-- Add some subcategories for Women
INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Bridal Hijabs', 'bridal-hijabs', id, 0 FROM public.categories WHERE slug = 'women'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Chiffon Collection', 'chiffon-hijabs', id, 1 FROM public.categories WHERE slug = 'women'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Silk Essentials', 'silk-hijabs', id, 2 FROM public.categories WHERE slug = 'women'
ON CONFLICT (slug) DO NOTHING;

-- Add some subcategories for Men
INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Luxury Thobes', 'luxury-thobes', id, 0 FROM public.categories WHERE slug = 'men'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Casual Tunics', 'casual-tunics', id, 1 FROM public.categories WHERE slug = 'men'
ON CONFLICT (slug) DO NOTHING;

-- Add some subcategories for Fragrance
INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Oud & Musk', 'oud-musk', id, 0 FROM public.categories WHERE slug = 'fragrance'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Floral Oils', 'floral-oils', id, 1 FROM public.categories WHERE slug = 'fragrance'
ON CONFLICT (slug) DO NOTHING;
