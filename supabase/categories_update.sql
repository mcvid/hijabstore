-- Add ordering and rich settings to categories
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS display_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS mega_menu_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT FALSE;

-- Comment for clarity
-- display_settings stores: { showInMegaMenu: boolean, showInMobile: boolean, icon: string, featuredImage: string }
-- mega_menu_settings stores: { layout: 'mixed' | 'list', featuredSubcategories: uuid[], showAllLink: boolean }
