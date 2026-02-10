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
                .from('wishlists')
                .select('product_id')
                .eq('user_id', userId);

            if (wishError) throw wishError;

            // Map to App User type
            const userData: User = {
                id: userId,
                email: email,
                firstName: profile.first_name || '',
                lastName: profile.last_name || '',
                phone: profile.phone,
                avatar: profile.avatar_url,
                memberSince: new Date(profile.created_at).toLocaleDateString(),
                tier: profile.tier || 'bronze',
                points: profile.points || 0,
                addresses: (addresses || []).map((addr: any) => ({
                    id: addr.id,
                    type: addr.type,
                    isDefault: addr.is_default,
                    firstName: addr.first_name,
                    lastName: addr.last_name,
                    street: addr.street,
                    apartment: addr.apartment,
                    city: addr.city,
                    state: addr.state,
                    zipCode: addr.zip_code,
                    country: addr.country,
                    phone: addr.phone
                })),
                paymentMethods: [], // Handle later
                preferences: {
                    newsletter: true,
                    smsNotifications: false,
                    culturalMode: 'Standard',
                    currency: 'USD',
                    language: 'en'
                },
                wishlist: (wishlist || []).map((w: any) => w.product_id),
                orderHistory: [] // To be fetched separately or joined
            };

            setUser(userData);
        } catch (error) {
            console.error("Error fetching user profile:", error);
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
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
            options: { captchaToken }
        });
        if (error) throw error;
    };

    const signInWithOAuth = async (provider: 'google' | 'apple') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.host === 'localhost:3000' ? 'http://localhost:3000' : 'https://' + window.location.host}/account`,
            }
        });
        if (error) throw error;
    };

    const signup = async (email: string, password: string, firstName: string, lastName: string, captchaToken?: string) => {
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
                .from('wishlists')
                .delete()
                .eq('user_id', user.id)
                .eq('product_id', productId);
            if (error) throw error;
        } else {
            // Add to DB
            const { error } = await supabase
                .from('wishlists')
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
