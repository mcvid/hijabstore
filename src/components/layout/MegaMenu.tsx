"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Category } from "@/types/category";
import { ChevronRight } from "lucide-react";

interface MegaMenuProps {
    category: Category;
    isOpen: boolean;
    onMouseLeave?: () => void;
}

export default function MegaMenu({ category, isOpen, onMouseLeave }: MegaMenuProps) {
    if (!category.subcategories || category.subcategories.length === 0) return null;

    // Use is_featured flag from Supabase for featured subcategories
    const featuredSubcats = category.subcategories.some(sub => sub.is_featured)
        ? category.subcategories.filter(sub => sub.is_featured)
        : category.subcategories.slice(0, 4);

    const allSubcats = category.subcategories;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full bg-white border-t border-neutral-sand shadow-2xl z-40"
                    onMouseLeave={onMouseLeave}
                >
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-12 gap-12">
                            {/* Featured Categories (Images) */}
                            <div className="col-span-8">
                                <h3 className="font-display text-xl text-primary-dark mb-6">Featured {category.name}</h3>
                                <div className="grid grid-cols-4 gap-6">
                                    {featuredSubcats.map((sub) => (
                                        <Link
                                            key={sub.id}
                                            href={`/products?category=${sub.slug}`}
                                            className="group block text-center"
                                        >
                                            <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-neutral-sand">
                                                {sub.displaySettings.featuredImage ? (
                                                    <img
                                                        src={sub.displaySettings.featuredImage}
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-neutral-sand flex items-center justify-center text-neutral-dark/20">
                                                        No Image
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                            </div>
                                            <span className="font-medium text-sm text-primary-dark uppercase tracking-widest group-hover:text-primary-gold transition-colors">
                                                {sub.name}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* All Categories List */}
                            <div className="col-span-4 border-l border-neutral-sand pl-12">
                                <h3 className="font-display text-xl text-primary-dark mb-6">All Categories</h3>
                                <ul className="space-y-3">
                                    {allSubcats.map((sub) => (
                                        <li key={sub.id}>
                                            <Link
                                                href={`/products?category=${sub.slug}`}
                                                className="flex items-center text-neutral-gray hover:text-primary-gold hover:pl-2 transition-all duration-300 group"
                                            >
                                                <ChevronRight className="w-3 h-3 mr-2 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                                {sub.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                {/* Shop All CTA */}
                                <div className="mt-8 pt-8 border-t border-neutral-sand/50">
                                    <Link
                                        href={`/products?category=${category.slug}`}
                                        className="inline-flex items-center justify-center gap-2 group/cta text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark border border-primary-dark px-10 py-4 hover:bg-primary-dark hover:text-white transition-all duration-500"
                                    >
                                        Shop All {category.name}
                                        <ChevronRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
