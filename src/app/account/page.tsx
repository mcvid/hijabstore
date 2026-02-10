"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    TrendingUp,
    Package,
    Heart,
    Clock,
    ArrowRight,
    Sparkles,
    MapPin,
    CreditCard,
    Crown,
    Settings,
} from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { profileService, Profile } from "@/lib/profileService";

export default function AccountDashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [tierProgress, setTierProgress] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [profileData, ordersData, wishlistData] = await Promise.all([
                profileService.getProfile(),
                profileService.getOrders(3), // Last 3 orders
                profileService.getWishlist(),
            ]);

            setProfile(profileData);
            setOrders(ordersData);
            setWishlistCount(wishlistData.length);

            if (profileData) {
                const progress = profileService.calculateTierProgress(
                    profileData.lifetime_spent,
                    profileData.tier
                );
                setTierProgress(progress);
            }
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    if (isLoading) {
        return (
            <ProfileLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full" />
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-primary-dark to-black text-white rounded-xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <h1 className="font-display text-3xl mb-2">
                            {getGreeting()}, {profile?.first_name}! <Sparkles className="inline-block ml-2" size={28} />
                        </h1>
                        <p className="text-white/80">
                            Welcome back to your personal boutique experience
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/30 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors">
                                <Package className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-gray font-medium">All Time</span>
                        </div>
                        <p className="font-display text-3xl text-primary-dark mb-1">
                            {profile?.total_orders || 0}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-neutral-gray">Total Orders</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/30 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors">
                                <TrendingUp className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-gray font-medium">Lifetime</span>
                        </div>
                        <p className="font-display text-3xl text-primary-dark mb-1">
                            ${profile?.lifetime_spent?.toLocaleString() || '0'}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-neutral-gray">Total Spent</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/30 transition-colors group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center group-hover:border-[#d4af37]/50 transition-colors">
                                <Heart className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                            </div>
                            <Link
                                href="/account/wishlist"
                                className="text-[10px] uppercase tracking-widest text-[#d4af37] hover:underline font-semibold"
                            >
                                View All
                            </Link>
                        </div>
                        <p className="font-display text-3xl text-primary-dark mb-1">
                            {wishlistCount}
                        </p>
                        <p className="text-xs uppercase tracking-wider text-neutral-gray">Wishlist Items</p>
                    </div>
                </div>

                {/* Tier Progress */}
                {tierProgress && tierProgress.nextTier && (
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-display text-xl font-semibold text-primary-dark mb-1">
                                    Loyalty Progress
                                </h3>
                                <p className="text-sm text-neutral-gray mb-1">
                                    You're ${tierProgress.amountToNext.toLocaleString()} away from {" "}
                                    <span className="capitalize font-semibold text-amber-700">
                                        {tierProgress.nextTier}
                                    </span> tier!
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-amber-700">
                                    {profile?.points?.toLocaleString()}
                                </p>
                                <p className="text-xs text-neutral-gray">Points</p>
                            </div>
                        </div>

                        <div className="relative h-3 bg-white rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${tierProgress.progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                            />
                        </div>

                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-neutral-gray capitalize">{tierProgress.currentTier}</span>
                            <span className="text-xs font-semibold text-amber-700 capitalize">
                                {tierProgress.nextTier}
                            </span>
                        </div>
                    </div>
                )}

                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-neutral-sand shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-sand flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-primary-dark">
                            Recent Orders
                        </h3>
                        <Link
                            href="/account/orders"
                            className="text-sm text-primary-gold hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {orders.length > 0 ? (
                        <div className="divide-y divide-neutral-sand">
                            {orders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/account/orders/${order.id}`}
                                    className="block px-6 py-4 hover:bg-neutral-cream transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-neutral-sand overflow-hidden">
                                                {order.items?.[0]?.product?.images?.[0]?.url ? (
                                                    <img
                                                        src={order.items[0].product.images[0].url}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="text-neutral-gray" size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-primary-dark mb-1">
                                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                                </p>
                                                <p className="text-sm text-neutral-gray">
                                                    {new Date(order.created_at).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-neutral-gray mb-1">Total</p>
                                            <p className="text-xl font-semibold text-primary-dark">
                                                ${order.total_amount?.toLocaleString()}
                                            </p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <Clock className="mx-auto mb-3 text-neutral-gray" size={48} />
                            <p className="text-neutral-gray font-medium mb-2">No orders yet</p>
                            <p className="text-sm text-neutral-gray mb-4">
                                Start shopping to see your orders here
                            </p>
                            <Link
                                href="/collections/new-arrivals"
                                className="inline-block px-6 py-2 bg-primary-dark text-white rounded-lg hover:bg-black transition-colors"
                            >
                                Shop Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        href="/account/addresses"
                        className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/50 transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center mx-auto mb-4 group-hover:bg-[#d4af37]/5 transition-colors">
                            <MapPin className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs uppercase tracking-widest font-semibold text-primary-dark">Addresses</p>
                    </Link>

                    <Link
                        href="/account/payment-methods"
                        className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/50 transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center mx-auto mb-4 group-hover:bg-[#d4af37]/5 transition-colors">
                            <CreditCard className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs uppercase tracking-widest font-semibold text-primary-dark">Payments</p>
                    </Link>

                    <Link
                        href="/account/loyalty"
                        className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/50 transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center mx-auto mb-4 group-hover:bg-[#d4af37]/5 transition-colors">
                            <Crown className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs uppercase tracking-widest font-semibold text-primary-dark">Rewards</p>
                    </Link>

                    <Link
                        href="/account/settings"
                        className="bg-white rounded-xl p-6 border border-neutral-sand shadow-sm hover:border-[#d4af37]/50 transition-all text-center group"
                    >
                        <div className="w-12 h-12 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center mx-auto mb-4 group-hover:bg-[#d4af37]/5 transition-colors">
                            <Settings className="text-primary-dark group-hover:text-[#d4af37] transition-colors" size={20} strokeWidth={1.5} />
                        </div>
                        <p className="text-xs uppercase tracking-widest font-semibold text-primary-dark">Settings</p>
                    </Link>
                </div>
            </div>
        </ProfileLayout>
    );
}
