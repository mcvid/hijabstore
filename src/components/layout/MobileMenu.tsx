"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, ChevronRight, User, Search, HelpCircle } from "lucide-react";
import { Category } from "@/types/category";

interface MobileMenuProps {
    categories: Category[];
    isOpen: boolean;
    onClose: () => void;
    isAuthenticated: boolean;
    onAccountClick: () => void;
}

export default function MobileMenu({ categories, isOpen, onClose, isAuthenticated, onAccountClick }: MobileMenuProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
                    />

                    {/* Menu Panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 w-[85%] max-w-sm h-full bg-primary-dark text-neutral-cream z-[70] overflow-y-auto shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <span className="font-accent text-2xl font-semibold">
                                Yasmin <span className="text-primary-gold">Fashions</span>
                            </span>
                            <button onClick={onClose} className="p-2 hover:text-primary-gold transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="py-4">
                            {categories.filter(c => c.displaySettings.showInMobile).map((category) => (
                                <div key={category.id} className="border-b border-white/5 last:border-0">
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-display text-xl uppercase tracking-wider">{category.name}</span>
                                        <ChevronDown
                                            className={`transition-transform duration-300 ${expandedCategory === category.id ? "rotate-180 text-primary-gold" : ""
                                                }`}
                                            size={20}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {expandedCategory === category.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-black/20"
                                            >
                                                <div className="py-2 pb-4">
                                                    {category.subcategories?.map((sub) => (
                                                        <Link
                                                            key={sub.id}
                                                            href={`/products?category=${sub.slug}`}
                                                            onClick={onClose}
                                                            className="flex items-center px-8 py-3 text-sm text-neutral-sand/80 hover:text-primary-gold hover:pl-10 transition-all"
                                                        >
                                                            <ChevronRight size={14} className="mr-2 opacity-50" />
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href={`/products?category=${category.slug}`}
                                                        onClick={onClose}
                                                        className="block px-8 py-3 mt-2 text-xs font-bold text-primary-gold uppercase tracking-widest hover:underline"
                                                    >
                                                        Shop All {category.name}
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            {/* Additional Links */}
                            <div className="p-6 space-y-4 border-t border-white/10 mt-4">
                                <Link href="/new-arrivals" onClick={onClose} className="block font-display text-xl uppercase tracking-wider hover:text-primary-gold transition-colors">
                                    New Arrivals
                                </Link>
                                <Link href="/products?category=women" onClick={onClose} className="block font-display text-xl uppercase tracking-wider hover:text-primary-gold transition-colors">
                                    Women
                                </Link>
                                <Link href="/products?category=men" onClick={onClose} className="block font-display text-xl uppercase tracking-wider hover:text-primary-gold transition-colors">
                                    Men
                                </Link>
                                <Link href="/products?category=fragrance" onClick={onClose} className="block font-display text-xl uppercase tracking-wider hover:text-primary-gold transition-colors">
                                    Fragrance
                                </Link>
                                {isAuthenticated ? (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onAccountClick();
                                        }}
                                        className="flex items-center gap-4 text-neutral-sand hover:text-primary-gold transition-colors py-2 w-full text-left"
                                    >
                                        <User size={18} />
                                        My Account
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onClose();
                                            onAccountClick();
                                        }}
                                        className="flex items-center gap-4 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 px-6 py-4 rounded-xl hover:bg-primary-gold/20 transition-all w-full text-left group"
                                    >
                                        <div className="bg-primary-gold text-primary-dark p-2 rounded-lg group-hover:scale-110 transition-transform">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm tracking-widest">SIGN IN</p>
                                            <p className="text-[10px] text-primary-gold/60">OR CREATE ACCOUNT</p>
                                        </div>
                                    </button>
                                )}
                                <Link href="/search" onClick={onClose} className="flex items-center gap-4 text-neutral-sand hover:text-primary-gold transition-colors py-2">
                                    <Search size={18} />
                                    Search
                                </Link>
                                <Link href="/help" onClick={onClose} className="flex items-center gap-4 text-neutral-sand hover:text-primary-gold transition-colors py-2">
                                    <HelpCircle size={18} />
                                    Help & Support
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
