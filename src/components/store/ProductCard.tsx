"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { DbProduct } from '@/lib/products';
import { useQuickView } from '@/context/QuickViewContext';
import { motion, Variants } from 'framer-motion';

interface ProductCardProps {
    product: DbProduct;
    priority?: boolean;
    index?: number;
}

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
};

export default function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { openQuickView } = useQuickView();

    // Helper to get primary image
    const primaryImage = product.images?.find(img => img.is_primary)?.url
        || product.images?.[0]?.url
        || '/images/placeholder-product.jpg';

    // Helper to calculate if "New" (e.g. within last 14 days)
    const isNew = new Date(product.created_at).getTime() > Date.now() - (14 * 24 * 60 * 60 * 1000);

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            className="group relative bg-white overflow-hidden transition-shadow duration-500 hover:shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            data-cursor-text="VIEW"
        >
            {/* Image Wrapper */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e3dc]">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading={priority ? "eager" : "lazy"}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {isNew && (
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-[#c9a961]">
                            New Arrival
                        </span>
                    )}
                    {/* Placeholder for Sale badge logic if added later */}
                </div>

                {/* Side Actions */}
                <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 z-10 
                    lg:opacity-0 lg:translate-x-2 lg:group-hover:opacity-100 lg:group-hover:translate-x-0
                    opacity-100 translate-x-0`}>
                    <button className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-none flex items-center justify-center text-[#1a1a1a] hover:bg-[#c9a961] hover:text-white transition-colors shadow-sm" title="Add to Wishlist">
                        <Heart size={16} />
                    </button>
                    <button
                        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-none flex items-center justify-center text-[#1a1a1a] hover:bg-[#c9a961] hover:text-white transition-colors shadow-sm"
                        title="Quick View"
                        onClick={() => openQuickView(product)}
                    >
                        <Eye size={16} />
                    </button>
                </div>

                {/* Quick Add Button */}
                <button
                    onClick={() => openQuickView(product)}
                    className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-white py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 shadow-md
                        lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0
                        opacity-100 translate-y-0`}
                >
                    Quick Add
                </button>
            </div>

            {/* Info */}
            <div className="p-6">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] mb-2">
                    {product.category?.name || 'Collection'}
                </div>
                <h3 className="font-display text-lg text-[#1a1a1a] mb-2 leading-tight">
                    <Link href={`/product/${product.slug}`} className="hover:text-[#c9a961] transition-colors">
                        {product.name}
                    </Link>
                </h3>
                <div className="flex items-center gap-3">
                    <span className="font-medium text-[#c9a961]">
                        {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.base_price || 0)}
                    </span>
                    {/* Placeholder for Sale Price logic */}
                </div>

                {/* Rating - Placeholder for now until reviews system */}
                <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={10} className="fill-[#c9a961] text-[#c9a961]" />
                    ))}
                    <span className="text-[10px] text-[#6b6b6b] ml-1">(New)</span>
                </div>
            </div>
        </motion.div>
    );
}
