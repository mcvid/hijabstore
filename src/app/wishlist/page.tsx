"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
} as const;

export default function WishlistPage() {
    // In a real app, this would come from a WishlistContext or database
    // For now, we'll use some mock items to demonstrate the luxury UI
    const wishlistItems = [
        {
            id: "1",
            name: "Classic Silk Hijab",
            price: 35.00,
            image: "/images/silk-hijab.png",
            category: "Premium Hijabs",
        },
        {
            id: "2",
            name: "Modern Abaya",
            price: 150.00,
            image: "/images/collection.png",
            category: "Luxury Abayas",
        }
    ];

    const { addItem } = useCart();

    const handleAddToBag = (item: any) => {
        addItem({ ...item, quantity: 1, colors: ["Default"], sizes: ["Standard"] });
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-cream text-primary-dark">
                <Navbar />
                <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-12">
                    <div className="relative">
                        <Heart className="w-32 h-32 text-neutral-sand/30" />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <Heart className="w-8 h-8 text-primary-gold" />
                        </motion.div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="font-display text-5xl md:text-7xl">Your Boutique Curations</h1>
                        <p className="text-neutral-gray text-lg font-light max-w-md mx-auto">Discover and save the pieces that speak to your soul. Your curator space is currently waiting for its first masterpiece.</p>
                    </div>
                    <Link href="/products">
                        <Button variant="primary" className="px-12 py-5 uppercase tracking-[0.3em] text-xs">Explore the Collection</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body">
            <Navbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-4 py-24 md:py-32"
            >
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="space-y-4">
                        <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold">Yasmin Fashions / Curated</span>
                        <h1 className="font-display text-5xl md:text-8xl">Saved Selections</h1>
                    </div>
                    <p className="text-neutral-gray text-xs uppercase tracking-[0.2em] font-bold pb-2 border-b border-primary-gold/30">
                        {wishlistItems.length} Masterpieces
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    <AnimatePresence>
                        {wishlistItems.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                layout
                                className="group relative"
                            >
                                <div className="aspect-[3/4] bg-neutral-sand relative overflow-hidden shadow-2xl transition-transform duration-700 group-hover:-translate-y-4">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />

                                    {/* Actions Overlay */}
                                    <div className="absolute inset-0 bg-primary-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-6">
                                        <Button
                                            variant="primary"
                                            className="w-48 py-4 uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 bg-white text-primary-dark hover:bg-white/90"
                                            onClick={() => handleAddToBag(item)}
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Add to Selection
                                        </Button>
                                        <button className="text-white text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 hover:text-accent-terracotta transition-colors">
                                            <Trash2 className="w-4 h-4" /> Remove
                                        </button>
                                    </div>

                                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
                                        <div className="space-y-1">
                                            <span className="text-[8px] uppercase tracking-widest text-white/70 font-bold bg-primary-dark/20 px-2 py-1 backdrop-blur-sm">{item.category}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <Link href={`/products/${item.id}`} className="font-display text-3xl hover:text-primary-gold transition-colors">{item.name}</Link>
                                        <span className="font-display text-xl text-primary-gold">AED {item.price.toFixed(2)}</span>
                                    </div>
                                    <Link href={`/products/${item.id}`} className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray hover:text-primary-dark transition-colors group/link underline decoration-primary-gold/30 underline-offset-4">
                                        View Masterpiece <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
}
