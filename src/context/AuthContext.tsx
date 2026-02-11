"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Address } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email?: string, password?: string, captchaToken?: string) => Promise<void>;
    signup: (email: string, password: string, firstName: string, lastName: string, captchaToken?: string) => Promise<void>;
    signInWithOAuth: (provider: 'google' | 'apple') => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => Promise<void>;
    refreshProfile: () => Promise<void>;
    toggleWishlist: (productId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (userId: string, email: string) => {
        try {
            // Fetch profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            // Fetch addresses
            const { data: addresses, error: addrError } = await supabase
                .from('addresses')
                .select('*')
                .eq('user_id', userId);

            if (addrError) throw addrError;

            // Fetch wishlist (IDs only)
            const { data: wishlist, error: wishError } = await supabase
                .from('wishlist_items')
                .select('product_id')
                .eq('user_id', userId);

            if (wishError) {
                console.error("Error fetching wishlist items:", wishError);
                // Non-critical, continue without wishlist if it fails
            }

            // Map to App User type
            const userData: User = {
                id: userId,
                email: email,
                firstName: profile.first_name || '',
                lastName: profile.last_name || '',
                displayName: profile.display_name || `${profile.first_name} ${profile.last_name}`,
                phone: profile.phone || '',
                avatar: profile.avatar_url || profile.profile_photo_url || '',
                dateOfBirth: profile.date_of_birth,
                gender: profile.gender,
                memberSince: new Date(profile.created_at).toLocaleDateString(),
                tier: profile.tier || 'bronze',
                points: profile.points || 0,
                lifetimeSpent: profile.lifetime_spent || 0,
                totalOrders: profile.total_orders || 0,
                addresses: (addresses || []).map((addr: any) => ({
                    id: addr.id,
                    type: addr.address_type === 'shipping' ? 'Home' : addr.address_type === 'billing' ? 'Work' : 'Other',
                    isDefault: addr.is_default,
                    firstName: addr.recipient_name?.split(' ')[0] || '',
                    lastName: addr.recipient_name?.split(' ').slice(1).join(' ') || '',
                    street: addr.address_line_1,
                    apartment: addr.address_line_2,
                    city: addr.city,
                    state: addr.state_province || '',
                    zipCode: addr.postal_code,
                    country: addr.country,
                    phone: addr.phone,
                    deliveryInstructions: addr.delivery_instructions
                })),
                paymentMethods: [],
                preferences: {
                    newsletter: profile.newsletter_subscribed ?? true,
                    smsNotifications: profile.sms_notifications ?? false,
                    culturalMode: 'Standard',
                    currency: profile.currency || 'USD',
                    language: profile.language || 'en'
                },
                wishlist: (wishlist || []).map((w: any) => w.product_id),
                orderHistory: []
            };

            setUser(userData);
        } catch (error: unknown) {
            const err = error as any;
            console.error("Error fetching user profile:", {
                message: err.message,
                details: err.details,
                hint: err.hint,
                code: err.code,
                error: err
            });
            // Fallback: If profile doesn't exist yet but user is authenticated
            // This can happen briefly during signup or if DB sync failed
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                await fetchProfile(session.user.id, session.user.email || '');
            }
            setIsLoading(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                await fetchProfile(session.user.id, session.user.email || '');
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email?: string, password?: string, captchaToken?: string): Promise<void> => {
        if (!email || !password) return;
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
                options: { captchaToken }
            });
            if (error) throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithOAuth = async (provider: 'google' | 'apple') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/api/auth/callback`,
            }
        });
        if (error) throw error;
    };

    const signup = async (email: string, password: string, firstName: string, lastName: string, captchaToken?: string) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    captchaToken,
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        display_name: `${firstName} ${lastName.charAt(0)}.`
                    }
                }
            });

            if (error) throw error;

            // The handle_new_user trigger will create the profile automatically
            // This is just a fallback in case the trigger fails
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: data.user.id,
                        email: email,
                        display_name: `${firstName} ${lastName.charAt(0)}.`,
                        tier: 'bronze',
                        points: 0
                    }, {
                        onConflict: 'id'
                    });

                if (profileError) {
                    console.error("Error creating profile:", profileError);
                    // Don't throw - the trigger might have already created it
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const updateUser = async (updates: Partial<User>) => {
        if (!user) return;

        // Update database (subset of fields)
        const dbUpdates: any = {};
        if (updates.firstName) dbUpdates.first_name = updates.firstName;
        if (updates.lastName) dbUpdates.last_name = updates.lastName;
        if (updates.phone) dbUpdates.phone = updates.phone;
        if (updates.avatar) dbUpdates.avatar_url = updates.avatar;

        if (Object.keys(dbUpdates).length > 0) {
            const { error } = await supabase
                .from('profiles')
                .update(dbUpdates)
                .eq('id', user.id);
            if (error) throw error;
        }

        setUser({ ...user, ...updates });
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id, user.email);
        }
    };

    const toggleWishlist = async (productId: string) => {
        if (!user) return;

        const isWhishlisted = user.wishlist.includes(productId);

        if (isWhishlisted) {
            // Remove from DB
            const { error } = await supabase
                .from('wishlist_items')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
            if (error) throw error;
        } else {
            // Add to DB
            const { error } = await supabase
                .from('wishlist_items')
                .insert({ user_id: user.id, product_id: productId });
            if (error) throw error;
        }

        // Update local state
        const currentWishlist = [...user.wishlist];
        const index = currentWishlist.indexOf(productId);
        if (index > -1) {
            currentWishlist.splice(index, 1);
        } else {
            currentWishlist.push(productId);
        }
        setUser({ ...user, wishlist: currentWishlist });
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            signInWithOAuth,
            logout,
            updateUser,
            refreshProfile,
            toggleWishlist
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
