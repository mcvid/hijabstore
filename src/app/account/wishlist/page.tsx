"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, TrendingDown, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { profileService, WishlistItem } from "@/lib/profileService";

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        loadWishlist();
    }, []);

    const loadWishlist = async () => {
        try {
            const data = await profileService.getWishlist();
            setWishlist(data);
        } catch (error) {
            console.error("Failed to load wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (itemId: string) => {
        setRemovingId(itemId);
        try {
            await profileService.removeFromWishlist(itemId);
            setWishlist(wishlist.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error("Failed to remove item:", error);
        } finally {
            setRemovingId(null);
        }
    };

    const getPriceDifference = (item: WishlistItem) => {
        if (!item.price_when_added || !item.product?.base_price) return null;
        const diff = item.product.base_price - item.price_when_added;
        if (diff === 0) return null;
        return diff;
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
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                            My Yasmin Wishlist
                        </h1>
                        <p className="text-neutral-gray text-sm">
                            {wishlist.length} {wishlist.length === 1 ? "Selection" : "Selections"} curated for your future collection
                        </p>
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => {
                            const priceDiff = getPriceDifference(item);
                            const primaryImage = item.product?.images?.find((img: any) => img.is_primary) || item.product?.images?.[0];

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-xl border border-neutral-sand overflow-hidden group hover:shadow-md transition-shadow"
                                >
                                    {/* Product Image */}
                                    <Link href={`/products/${item.product?.slug}`} className="block relative aspect-[4/5] bg-neutral-cream overflow-hidden">
                                        {primaryImage?.url ? (
                                            <img
                                                src={primaryImage.url}
                                                alt={item.product?.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Heart className="text-neutral-gray/20" size={48} strokeWidth={1} />
                                            </div>
                                        )}

                                        {/* Price Drop Badge */}
                                        {priceDiff && priceDiff < 0 && (
                                            <div className="absolute top-4 left-4 bg-primary-dark text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                                <TrendingDown size={14} strokeWidth={2.5} />
                                                ${Math.abs(priceDiff).toFixed(2)} Privilege
                                            </div>
                                        )}

                                        {/* Out of Stock Badge */}
                                        {item.product?.stock_quantity === 0 && (
                                            <div className="absolute inset-0 bg-primary-dark/40 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-white text-primary-dark px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">
                                                    Currently Unavailable
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <Link href={`/products/${item.product?.slug}`}>
                                            <h3 className="font-medium text-primary-dark mb-2 line-clamp-2 hover:text-primary-gold transition-colors">
                                                {item.product?.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-baseline gap-2 mb-4">
                                            <p className="text-xl font-semibold text-primary-dark">
                                                ${item.product?.base_price?.toLocaleString()}
                                            </p>
                                            {priceDiff && priceDiff < 0 && (
                                                <p className="text-sm text-neutral-gray line-through">
                                                    ${item.price_when_added?.toLocaleString()}
                                                </p>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                disabled={item.product?.stock_quantity === 0}
                                                className="flex-1 py-3 bg-primary-dark text-white rounded-xl hover:bg-black transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-lg"
                                            >
                                                <ShoppingCart size={16} strokeWidth={2} />
                                                <span>Acquire</span>
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                disabled={removingId === item.id}
                                                className="p-3 border border-neutral-sand rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all disabled:opacity-50"
                                            >
                                                {removingId === item.id ? (
                                                    <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full" />
                                                ) : (
                                                    <Trash2 size={18} strokeWidth={1.5} />
                                                )}
                                            </button>
                                        </div>

                                        {/* Notification Preferences */}
                                        <div className="mt-3 pt-3 border-t border-neutral-sand flex flex-col gap-2 text-xs text-neutral-gray">
                                            {item.notify_when_back_in_stock && (
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Back in stock alerts enabled
                                                </div>
                                            )}
                                            {item.notify_on_price_drop && (
                                                <div className="flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                    Price drop alerts enabled
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-neutral-sand p-12 text-center">
                        <Heart className="mx-auto mb-4 text-neutral-gray" size={64} />
                        <h2 className="font-display text-2xl text-primary-dark mb-2">Your Wishlist is Empty</h2>
                        <p className="text-neutral-gray mb-6">
                            Save your favorite items to create your perfect collection
                        </p>
                        <Link
                            href="/collections/new-arrivals"
                            className="inline-block px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-black transition-colors"
                        >
                            Explore Collections
                        </Link>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
}
