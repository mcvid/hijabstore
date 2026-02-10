"use client";
import React from "react";
import { Star, Share2, Instagram, Link as LinkIcon, MessageCircle } from "lucide-react";
import { Product } from "@/types";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductInfoProps {
    product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const savePercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="space-y-8">
            {/* Breadcrumbs & Share */}
            <div className="flex justify-between items-center">
                <nav className="text-[10px] items-baseline uppercase tracking-[0.2em] text-neutral-gray/60 flex items-center gap-3">
                    <Link href="/" className="hover:text-primary-gold transition-colors font-light">Home</Link>
                    <span className="text-[8px] opacity-40">•</span>
                    <Link href={`/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary-gold transition-colors font-light">
                        {product.category}
                    </Link>
                </nav>
                <div className="flex gap-3">
                    {[
                        { icon: MessageCircle, label: "WhatsApp" },
                        { icon: Instagram, label: "Instagram" },
                        { icon: LinkIcon, label: "Copy Link" }
                    ].map((item, i) => (
                        <button
                            key={i}
                            className="w-9 h-9 border border-neutral-sand flex items-center justify-center text-primary-dark hover:bg-primary-dark hover:text-white transition-all duration-300 rounded-full"
                            title={item.label}
                        >
                            <item.icon className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Title & Rating */}
            <div className="space-y-4">
                <h1 className="font-display text-4xl md:text-6xl text-primary-dark leading-tight">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center text-primary-gold gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                    </div>
                    <span className="text-xs uppercase tracking-widest font-bold text-neutral-gray">
                        4.9 (24 Reviews)
                    </span>
                    <button className="text-[10px] uppercase font-bold tracking-widest text-primary-dark border-b border-primary-dark hover:text-primary-gold hover:border-primary-gold transition-colors ml-2">
                        Write Review
                    </button>
                </div>
            </div>

            {/* Price section */}
            <div className="py-8 border-y border-neutral-sand space-y-3">
                <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-display font-semibold text-primary-gold">
                        AED {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <>
                            <span className="text-lg text-neutral-gray line-through decoration-primary-gold/30">
                                AED {product.originalPrice.toFixed(2)}
                            </span>
                            <span className="bg-accent-terracotta text-white text-[10px] font-bold px-2 py-1 tracking-wider uppercase">
                                Save {savePercentage}%
                            </span>
                        </>
                    )}
                </div>
                <p className="text-xs text-neutral-gray font-light">
                    or 4 interest-free payments of <span className="font-bold text-primary-dark">AED {(product.price / 4).toFixed(2)}</span> with <span className="text-black font-bold">Tabby</span>
                </p>
            </div>

            {/* Description */}
            <p className="text-neutral-gray text-lg font-light leading-relaxed max-w-xl">
                {product.description}
            </p>
        </div>
    );
}
