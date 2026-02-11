/**
 * PROFILE SERVICE LAYER
 * Luxury User Account System
 * Handles all profile, wishlist, address, payment, and loyalty operations
 */

import { supabase } from "./supabase";

// Type Definitions
export interface Profile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    display_name: string | null;
    phone: string | null;
    date_of_birth: string | null;
    gender: string | null;
    avatar_url: string | null;
    account_status: string;
    email_verified: boolean;
    phone_verified: boolean;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    points: number;
    lifetime_spent: number;
    total_orders: number;
    language: string;
    currency: string;
    newsletter_subscribed: boolean;
    sms_notifications: boolean;
    whatsapp_notifications: boolean;
    marketing_emails: boolean;
    promotional_sms: boolean;
    new_arrivals_alerts: boolean;
    back_in_stock_alerts: boolean;
    price_drop_alerts: boolean;
    profile_visibility: string;
    allow_reviews_display: boolean;
    allow_photo_sharing: boolean;
    created_at: string;
    updated_at: string;
    last_login_at: string | null;
}

export interface Address {
    id: string;
    user_id: string;
    address_type: 'shipping' | 'billing' | 'both';
    label: string | null;
    is_default: boolean;
    recipient_name: string;
    phone: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    state_province: string | null;
    postal_code: string;
    country: string;
    delivery_instructions: string | null;
    created_at: string;
    updated_at: string;
}

export interface LoyaltyTransaction {
    id: string;
    user_id: string;
    points: number;
    transaction_type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
    reason: string;
    order_id: string | null;
    coupon_id: string | null;
    balance_after: number;
    created_at: string;
    expires_at: string | null;
}

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    variant_id: string | null;
    notify_when_back_in_stock: boolean;
    notify_on_price_drop: boolean;
    price_when_added: number | null;
    added_at: string;
    product?: any; // Will be populated with product data
}

export interface SavedPaymentMethod {
    id: string;
    user_id: string;
    payment_type: 'card' | 'wallet' | 'bank_transfer';
    is_default: boolean;
    stripe_payment_method_id: string | null;
    card_brand: string | null;
    card_last4: string | null;
    card_exp_month: number | null;
    card_exp_year: number | null;
    billing_address_id: string | null;
    nickname: string | null;
    created_at: string;
}

export interface UserPreferences {
    user_id: string;
    preferred_size_abayas: string | null;
    preferred_size_hijabs: string | null;
    preferred_size_thobes: string | null;
    style_preferences: string[] | null;
    preferred_colors: string[] | null;
    price_range: 'budget' | 'mid-range' | 'luxury' | null;
    favorite_categories: string[] | null;
    occasion_preferences: string[] | null;
    measurements: any | null;
    show_prayer_times: boolean;
    prayer_location: string | null;
    ramadan_mode_auto: boolean;
    updated_at: string;
}

// Tier Thresholds (in AED)
const TIER_THRESHOLDS = {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    platinum: 15000,
};

const TIER_POINTS_MULTIPLIER = {
    bronze: 1,
    silver: 1.25,
    gold: 1.5,
    platinum: 2,
};

class ProfileService {
    // ============================================
    // PROFILE OPERATIONS
    // ============================================

    async getProfile(userId?: string): Promise<Profile | null> {
        try {
            const uid = userId || (await this.getCurrentUserId());
            if (!uid) return null;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", uid)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error fetching profile:", error);
            return null;
        }
    }

    async updateProfile(updates: Partial<Profile>): Promise<Profile | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("profiles")
                .update(updates)
                .eq("id", uid)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    async uploadProfilePhoto(file: File): Promise<string | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            const fileExt = file.name.split(".").pop();
            const fileName = `${uid}/${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            // Update profile with new photo URL
            await this.updateProfile({ avatar_url: data.publicUrl });

            return data.publicUrl;
        } catch (error) {
            console.error("Error uploading profile photo:", error);
            return null;
        }
    }

    // ============================================
    // ADDRESS OPERATIONS
    // ============================================

    async getAddresses(): Promise<Address[]> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) return [];

            const { data, error } = await supabase
                .from("addresses")
                .select("*")
                .eq("user_id", uid)
                .order("is_default", { ascending: false })
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching addresses:", error);
            return [];
        }
    }

    async addAddress(address: Omit<Address, "id" | "user_id" | "created_at" | "updated_at">): Promise<Address | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            // If this is set as default, unset other defaults of the same type
            if (address.is_default) {
                await supabase
                    .from("addresses")
                    .update({ is_default: false })
                    .eq("user_id", uid)
                    .eq("address_type", address.address_type);
            }

            const { data, error } = await supabase
                .from("addresses")
                .insert({ ...address, user_id: uid })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error adding address:", error);
            throw error;
        }
    }

    async updateAddress(addressId: string, updates: Partial<Address>): Promise<Address | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            // If setting as default, unset other defaults of the same type
            if (updates.is_default && updates.address_type) {
                await supabase
                    .from("addresses")
                    .update({ is_default: false })
                    .eq("user_id", uid)
                    .eq("address_type", updates.address_type);
            }

            const { data, error } = await supabase
                .from("addresses")
                .update(updates)
                .eq("id", addressId)
                .eq("user_id", uid)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    }

    async deleteAddress(addressId: string): Promise<boolean> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("addresses")
                .delete()
                .eq("id", addressId)
                .eq("user_id", uid);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error deleting address:", error);
            return false;
        }
    }

    // ============================================
    // WISHLIST OPERATIONS
    // ============================================

    async getWishlist(): Promise<WishlistItem[]> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) return [];

            const { data, error } = await supabase
                .from("wishlist_items")
                .select(`
          *,
          product:products(
            id,
            name,
            slug,
            base_price,
            images:product_images(url, is_primary)
          )
        `)
                .eq("user_id", uid)
                .order("added_at", { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error("Error fetching wishlist:", error?.message || error || JSON.stringify(error));
            return [];
        }
    }

    async addToWishlist(productId: string, variantId?: string): Promise<WishlistItem | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            // Get current product price
            const { data: product } = await supabase
                .from("products")
                .select("base_price")
                .eq("id", productId)
                .single();

            const { data, error } = await supabase
                .from("wishlist_items")
                .insert({
                    user_id: uid,
                    product_id: productId,
                    variant_id: variantId || null,
                    price_when_added: product?.base_price || null,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            throw error;
        }
    }

    async removeFromWishlist(wishlistItemId: string): Promise<boolean> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("wishlist_items")
                .delete()
                .eq("id", wishlistItemId)
                .eq("user_id", uid);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            return false;
        }
    }

    // ============================================
    // LOYALTY & REWARDS
    // ============================================

    async getLoyaltyTransactions(limit = 50): Promise<LoyaltyTransaction[]> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) return [];

            const { data, error } = await supabase
                .from("loyalty_transactions")
                .select("*")
                .eq("user_id", uid)
                .order("created_at", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching loyalty transactions:", error);
            return [];
        }
    }

    calculateTierProgress(lifetimeSpent: number, currentTier: string) {
        const tierThresholds = {
            bronze: 0,
            silver: 270,       // $270
            gold: 1350,        // $1,350
            platinum: 4050,    // $4,050
        };

        const tiers = ['bronze', 'silver', 'gold', 'platinum'];
        const currentIndex = tiers.indexOf(currentTier);
        const nextTier = tiers[currentIndex + 1];

        if (!nextTier) {
            return { currentTier, nextTier: null, progress: 100, amountToNext: 0 };
        }

        const currentThreshold = tierThresholds[currentTier as keyof typeof tierThresholds];
        const nextThreshold = tierThresholds[nextTier as keyof typeof tierThresholds];

        const progress = ((lifetimeSpent - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
        const amountToNext = nextThreshold - lifetimeSpent;

        return {
            currentTier,
            nextTier,
            progress: Math.min(Math.max(progress, 0), 100),
            amountToNext: Math.max(amountToNext, 0),
        };
    }

    // ============================================
    // SAVED PAYMENT METHODS
    // ============================================

    async getPaymentMethods(): Promise<SavedPaymentMethod[]> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) return [];

            const { data, error } = await supabase
                .from("saved_payment_methods")
                .select("*")
                .eq("user_id", uid)
                .order("is_default", { ascending: false })
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching payment methods:", error);
            return [];
        }
    }

    // ============================================
    // USER PREFERENCES
    // ============================================

    async getPreferences(): Promise<UserPreferences | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) return null;

            const { data, error } = await supabase
                .from("user_preferences")
                .select("*")
                .eq("user_id", uid)
                .single();

            if (error) {
                // Create preferences if they don't exist
                const { data: newPrefs } = await supabase
                    .from("user_preferences")
                    .insert({ user_id: uid })
                    .select()
                    .single();
                return newPrefs;
            }

            return data;
        } catch (error) {
            console.error("Error fetching preferences:", error);
            return null;
        }
    }

    async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) throw new Error("Not authenticated");

            const { data, error } = await supabase
                .from("user_preferences")
                .upsert({ user_id: uid, ...updates })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error("Error updating preferences:", error);
            throw error;
        }
    }

    // ============================================
    // ORDERS (Integration point)
    // ============================================

    async getOrders(limit = 20): Promise<any[]> {
        try {
            const uid = await this.getCurrentUserId();
            if (!uid) return [];

            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          items:order_items(
            *,
            product:products(name, slug, images:product_images(url, is_primary))
          ),
          address:addresses!shipping_address_id(*)
        `)
                .eq("user_id", uid)
                .order("created_at", { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error: any) {
            console.error("Error fetching orders:", error?.message || error || JSON.stringify(error));
            return [];
        }
    }

    // ============================================
    // HELPER METHODS
    // ============================================

    private async getCurrentUserId(): Promise<string | null> {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || null;
    }
}

export const profileService = new ProfileService();
