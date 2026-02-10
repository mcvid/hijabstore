-- Seed premium products for Yasmin Fashions

-- 1. Ensure subcategories exist
INSERT INTO public.categories (name, slug, parent_id, order_index)
SELECT 'Luxury Abayas', 'luxury-abayas', id, 0 FROM public.categories WHERE slug = 'women'
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Products
-- We use DO UPDATE or ON CONFLICT to avoid duplicates

-- Women's Products
INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Midnight Velvet Abaya', 
    'midnight-velvet-abaya', 
    'A masterpiece of elegance, crafted from premium midnight blue velvet with intricate gold embroidery. Features a flattering A-line silhouette and hidden pockets.',
    189.00,
    id,
    true,
    true
FROM public.categories WHERE slug = 'luxury-abayas'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Silk Rose Hijab', 
    'silk-rose-hijab', 
    'Made from 100% Habotai silk, this hijab offers a luxurious sheen and incredibly soft touch. The dusty rose hue complements all skin tones.',
    45.00,
    id,
    true,
    false
FROM public.categories WHERE slug = 'silk-hijabs'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Chiffon Dream Scarf', 
    'chiffon-dream-scarf', 
    'Our signature chiffon scarf, lightweight and breathable. Perfect for everyday elegance and easy styling.',
    29.00,
    id,
    true,
    false
FROM public.categories WHERE slug = 'chiffon-hijabs'
ON CONFLICT (slug) DO NOTHING;

-- Men's Products
INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Emirati Black Thobe', 
    'emirati-black-thobe', 
    'A classic Emirati style thobe tailored from high-grade Japanese fabric. Features meticulous hand-stitching and a modern mandarin collar.',
    149.00,
    id,
    true,
    true
FROM public.categories WHERE slug = 'luxury-thobes'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Linen Summer Tunic', 
    'linen-summer-tunic', 
    'Breathable premium linen tunic in sand beige. Ideal for warmer climates and sophisticated casual wear.',
    79.00,
    id,
    true,
    false
FROM public.categories WHERE slug = 'casual-tunics'
ON CONFLICT (slug) DO NOTHING;

-- Fragrance Products
INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Royal Oud Intense', 
    'royal-oud-intense', 
    'An opulent blend of Cambodian Oud, aged leather, and spicy saffron. A scent that commands respect and leaves a lasting impression.',
    120.00,
    id,
    true,
    true
FROM public.categories WHERE slug = 'oud-musk'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, description, base_price, category_id, is_active, is_featured)
SELECT 
    'Jasmine Silk Oil', 
    'jasmine-silk-oil', 
    'Pure concentrated perfume oil extracted from the finest nocturnal jasmine blooms. Delicate, lingering, and alcohol-free.',
    65.00,
    id,
    true,
    false
FROM public.categories WHERE slug = 'floral-oils'
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Variants (Simple Size/Color associations)
-- Use subqueries to link to newly created products
INSERT INTO public.product_variants (product_id, name, sku, price_override, stock_quantity)
SELECT id, 'Small', 'ABY-MID-S', NULL, 15 FROM public.products WHERE slug = 'midnight-velvet-abaya'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, sku, price_override, stock_quantity)
SELECT id, 'Medium', 'ABY-MID-M', NULL, 25 FROM public.products WHERE slug = 'midnight-velvet-abaya'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, sku, price_override, stock_quantity)
SELECT id, 'Large', 'ABY-MID-L', NULL, 10 FROM public.products WHERE slug = 'midnight-velvet-abaya'
ON CONFLICT DO NOTHING;

-- Thobe Variants
INSERT INTO public.product_variants (product_id, name, sku, price_override, stock_quantity)
SELECT id, '54L', 'THB-EMR-54L', NULL, 20 FROM public.products WHERE slug = 'emirati-black-thobe'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_variants (product_id, name, sku, price_override, stock_quantity)
SELECT id, '56L', 'THB-EMR-56L', NULL, 30 FROM public.products WHERE slug = 'emirati-black-thobe'
ON CONFLICT DO NOTHING;

-- 4. Seed Placeholder Images
-- We'll use high-quality placeholder paths that look professional
INSERT INTO public.product_images (product_id, url, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1585487000160-32df9c2c622a?auto=format&fit=crop&q=80&w=800', true, 0 
FROM public.products WHERE slug = 'midnight-velvet-abaya'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?auto=format&fit=crop&q=80&w=800', true, 0 
FROM public.products WHERE slug = 'silk-rose-hijab'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1590633651111-e6e8729c193e?auto=format&fit=crop&q=80&w=800', true, 0 
FROM public.products WHERE slug = 'emirati-black-thobe'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, url, is_primary, display_order)
SELECT id, 'https://images.unsplash.com/photo-1547881338-64674c07693b?auto=format&fit=crop&q=80&w=800', true, 0 
FROM public.products WHERE slug = 'royal-oud-intense'
ON CONFLICT DO NOTHING;
