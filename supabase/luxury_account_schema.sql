-- ============================================
-- LUXURY USER ACCOUNT SYSTEM - DATABASE SCHEMA
-- Nūr Boutique E-Commerce Platform
-- ============================================

-- NOTE: This extends the existing profiles table and adds comprehensive user account features
-- Run this after the base profiles.sql migration

-- ============================================
-- 1. EXTEND PROFILES TABLE
-- ============================================

-- Add new columns to existing profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE,
  ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('female', 'male', 'prefer_not_to_say')),
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  
  -- Account Status
  ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'active' 
    CHECK (account_status IN ('active', 'suspended', 'deactivated')),
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
  
  -- Loyalty & Engagement (enhanced)
  ADD COLUMN IF NOT EXISTS lifetime_spent DECIMAL(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
  
  -- Preferences
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar', 'fr')),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_notifications BOOLEAN DEFAULT false,
  
  -- Marketing Preferences
  ADD COLUMN IF NOT EXISTS marketing_emails BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS promotional_sms BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS new_arrivals_alerts BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS back_in_stock_alerts BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS price_drop_alerts BOOLEAN DEFAULT true,
  
  -- Privacy
  ADD COLUMN IF NOT EXISTS profile_visibility TEXT DEFAULT 'private' 
    CHECK (profile_visibility IN ('private', 'public')),
  ADD COLUMN IF NOT EXISTS allow_reviews_display BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_photo_sharing BOOLEAN DEFAULT true,
  
  -- Metadata
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Normalize tier values to lowercase for consistency
UPDATE public.profiles SET tier = LOWER(tier) WHERE tier IN ('Blue', 'Gold', 'Platinum', 'VIP');
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_tier_check 
  CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum'));

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_loyalty_tier ON public.profiles(tier);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);


-- ============================================
-- 2. EXTEND ADDRESSES TABLE
-- ============================================

-- Add additional fields to addresses
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS address_type TEXT DEFAULT 'shipping' 
    CHECK (address_type IN ('shipping', 'billing', 'both')),
  ADD COLUMN IF NOT EXISTS label TEXT,
  ADD COLUMN IF NOT EXISTS recipient_name TEXT,
  ADD COLUMN IF NOT EXISTS delivery_instructions TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Safely rename columns for consistency (only if old names exist)
DO $$
BEGIN
  -- Rename street to address_line_1 if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'addresses' AND column_name = 'street') THEN
    ALTER TABLE public.addresses RENAME COLUMN street TO address_line_1;
  END IF;
  
  -- Rename apartment to address_line_2 if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'addresses' AND column_name = 'apartment') THEN
    ALTER TABLE public.addresses RENAME COLUMN apartment TO address_line_2;
  END IF;
  
  -- Rename state to state_province if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'addresses' AND column_name = 'state') THEN
    ALTER TABLE public.addresses RENAME COLUMN state TO state_province;
  END IF;
  
  -- Rename zip_code to postal_code if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'addresses' AND column_name = 'zip_code') THEN
    ALTER TABLE public.addresses RENAME COLUMN zip_code TO postal_code;
  END IF;
END $$;


-- Update recipient name from first_name + last_name if null
UPDATE public.addresses 
SET recipient_name = CONCAT(first_name, ' ', last_name) 
WHERE recipient_name IS NULL;

-- Ensure only one default address per user per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_default_address 
  ON public.addresses(user_id, address_type, is_default) 
  WHERE is_default = true;


-- ============================================
-- 3. LOYALTY TRANSACTIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Transaction Details
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired', 'adjusted')),
  reason TEXT NOT NULL,
  
  -- Related Entities
  order_id UUID,
  coupon_id UUID,
  
  -- Balance Tracking
  balance_after INTEGER NOT NULL,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Index for user's transaction history
CREATE INDEX IF NOT EXISTS idx_loyalty_user_created 
  ON public.loyalty_transactions(user_id, created_at DESC);


-- ============================================
-- 4. SAVED PAYMENT METHODS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.saved_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment Method
  payment_type TEXT NOT NULL CHECK (payment_type IN ('card', 'wallet', 'bank_transfer')),
  is_default BOOLEAN DEFAULT false,
  
  -- Card Details (tokenized - never store full card!)
  stripe_payment_method_id TEXT UNIQUE,
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  
  -- Billing Address
  billing_address_id UUID REFERENCES public.addresses(id),
  
  -- Metadata
  nickname TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure only one default payment method per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_default_payment 
  ON public.saved_payment_methods(user_id, is_default) 
  WHERE is_default = true;


-- ============================================
-- 5. WISHLIST ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID NOT NULL,
  variant_id UUID,
  
  -- Preferences
  notify_when_back_in_stock BOOLEAN DEFAULT true,
  notify_on_price_drop BOOLEAN DEFAULT true,
  
  -- Metadata
  price_when_added DECIMAL(10,2),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist_items(user_id, added_at DESC);


-- ============================================
-- 6. RECENTLY VIEWED TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID NOT NULL,
  
  -- Metadata
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_recently_viewed_user 
  ON public.recently_viewed(user_id, viewed_at DESC);


-- ============================================
-- 7. USER PREFERENCES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Size Preferences
  preferred_size_abayas TEXT,
  preferred_size_hijabs TEXT,
  preferred_size_thobes TEXT,
  
  -- Style Preferences (from quiz)
  style_preferences JSONB,
  preferred_colors JSONB,
  price_range TEXT CHECK (price_range IN ('budget', 'mid-range', 'luxury')),
  
  -- Shopping Preferences
  favorite_categories JSONB,
  occasion_preferences JSONB,
  
  -- Custom Measurements (for tailored items)
  measurements JSONB,
  
  -- Cultural/Religious Preferences
  show_prayer_times BOOLEAN DEFAULT false,
  prayer_location TEXT,
  ramadan_mode_auto BOOLEAN DEFAULT true,
  
  -- Updated
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- 1. Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_first_name TEXT;
  extracted_last_name TEXT;
  extracted_avatar_url TEXT;
  full_name TEXT;
BEGIN
  -- Extract metadata from social providers (Google/Apple)
  full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name');
  extracted_avatar_url := COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture');
  
  -- Attempt to split full name if specific fields are missing
  extracted_first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'given_name',
    split_part(full_name, ' ', 1),
    split_part(NEW.email, '@', 1) -- last resort fallback
  );
  
  extracted_last_name := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'family_name',
    substring(full_name from ' .*'), -- everything after first space
    ''
  );

  INSERT INTO public.profiles (
    id, 
    email, 
    first_name,
    last_name,
    display_name,
    profile_photo_url,
    email_verified, 
    tier, 
    points,
    account_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    TRIM(extracted_first_name),
    TRIM(extracted_last_name),
    COALESCE(full_name, TRIM(extracted_first_name || ' ' || extracted_last_name)),
    extracted_avatar_url,
    NEW.email_confirmed_at IS NOT NULL,
    'bronze',
    0,
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    display_name = COALESCE(EXCLUDED.display_name, profiles.display_name),
    profile_photo_url = COALESCE(EXCLUDED.profile_photo_url, profiles.profile_photo_url),
    email_verified = EXCLUDED.email_verified;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- 2. Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON public.addresses;
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON public.saved_payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.saved_payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- 3. Update last_login_at on login
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_login_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_login ON auth.users;
CREATE TRIGGER on_user_login
  AFTER UPDATE OF last_sign_in_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at)
  EXECUTE FUNCTION public.update_last_login();


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Loyalty Transactions: Users can only view their own transactions
DROP POLICY IF EXISTS "Users can view own loyalty transactions" ON public.loyalty_transactions;
CREATE POLICY "Users can view own loyalty transactions"
  ON public.loyalty_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Payment Methods: Users can only manage their own
DROP POLICY IF EXISTS "Users can view own payment methods" ON public.saved_payment_methods;
CREATE POLICY "Users can view own payment methods"
  ON public.saved_payment_methods FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own payment methods" ON public.saved_payment_methods;
CREATE POLICY "Users can insert own payment methods"
  ON public.saved_payment_methods FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own payment methods" ON public.saved_payment_methods;
CREATE POLICY "Users can update own payment methods"
  ON public.saved_payment_methods FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own payment methods" ON public.saved_payment_methods;
CREATE POLICY "Users can delete own payment methods"
  ON public.saved_payment_methods FOR DELETE
  USING (auth.uid() = user_id);

-- Wishlist: Users can only manage their own
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist_items;
CREATE POLICY "Users can view own wishlist"
  ON public.wishlist_items FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can insert own wishlist items"
  ON public.wishlist_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can update own wishlist items"
  ON public.wishlist_items FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own wishlist items" ON public.wishlist_items;
CREATE POLICY "Users can delete own wishlist items"
  ON public.wishlist_items FOR DELETE
  USING (auth.uid() = user_id);

-- Recently Viewed: Users can only manage their own
DROP POLICY IF EXISTS "Users can view own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can view own recently viewed"
  ON public.recently_viewed FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can insert own recently viewed"
  ON public.recently_viewed FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can update own recently viewed"
  ON public.recently_viewed FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own recently viewed" ON public.recently_viewed;
CREATE POLICY "Users can delete own recently viewed"
  ON public.recently_viewed FOR DELETE
  USING (auth.uid() = user_id);

-- User Preferences: Users can only manage their own
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own preferences" ON public.user_preferences;
CREATE POLICY "Users can delete own preferences"
  ON public.user_preferences FOR DELETE
  USING (auth.uid() = user_id);



-- ============================================
-- INITIAL DATA & CLEANUP
-- ============================================

-- Create user_preferences record for existing users
INSERT INTO public.user_preferences (user_id)
SELECT id FROM public.profiles
ON CONFLICT (user_id) DO NOTHING;

-- Set default tier to bronze for existing users if null
UPDATE public.profiles SET tier = 'bronze' WHERE tier IS NULL;

-- ============================================
-- COMPLETED: Luxury Account Schema
-- ============================================
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Verify all tables are created
-- 3. Test RLS policies with test user
-- 4. Set up Supabase Storage bucket for profile photos
