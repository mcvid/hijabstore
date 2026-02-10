-- PRODUCTS & CATALOG SCHEMA

-- 1. Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  show_in_main_nav BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  base_price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sku_base TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Product Variants (Size, Color, etc.)
CREATE TABLE public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT, -- e.g. "Medium / Black"
  price_override DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  attributes JSONB -- e.g. {"size": "M", "color": "Black"}
);

-- 4. Product Images
CREATE TABLE public.product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

-- RLS POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public can view active products/categories
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view variants" ON public.product_variants FOR SELECT USING (TRUE);
CREATE POLICY "Public can view images" ON public.product_images FOR SELECT USING (TRUE);

-- Admin only edits (assuming an 'admin' role or specific UIDs)
-- For now, let's keep it simple - this would be restricted in production
