-- ADMIN PERMISSIONS FOR CATALOG MANAGEMENT
-- Grant full access to anyone (Dev Mode)

-- 1. Categories Policies
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories" ON public.categories 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories" ON public.categories 
FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories" ON public.categories 
FOR DELETE USING (true);

-- 2. Products Policies
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products" ON public.products 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products" ON public.products 
FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products" ON public.products 
FOR DELETE USING (true);

-- 3. Variants Policies
DROP POLICY IF EXISTS "Admins can insert variants" ON public.product_variants;
CREATE POLICY "Admins can insert variants" ON public.product_variants 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update variants" ON public.product_variants;
CREATE POLICY "Admins can update variants" ON public.product_variants 
FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete variants" ON public.product_variants;
CREATE POLICY "Admins can delete variants" ON public.product_variants 
FOR DELETE USING (true);

-- 4. Images Policies
DROP POLICY IF EXISTS "Admins can insert images" ON public.product_images;
CREATE POLICY "Admins can insert images" ON public.product_images 
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update images" ON public.product_images;
CREATE POLICY "Admins can update images" ON public.product_images 
FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Admins can delete images" ON public.product_images;
CREATE POLICY "Admins can delete images" ON public.product_images 
FOR DELETE USING (true);
