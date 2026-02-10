"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
} as const;

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCart();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.05; // 5% VAT
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-cream text-primary-dark">
                <Navbar />
                <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <h1 className="font-display text-5xl md:text-7xl">Your Shopping Bag is Empty</h1>
                        <p className="text-neutral-gray text-lg font-light">The finest collections await your discovery.</p>
                    </motion.div>
                    <Link href="/products">
                        <Button variant="primary" className="px-12 py-5 uppercase tracking-[0.3em] text-xs">
                            Discover the Collection
                        </Button>
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
                <div className="mb-16">
                    <h1 className="font-display text-5xl md:text-7xl mb-4">Your Selection</h1>
                    <p className="text-neutral-gray text-xs uppercase tracking-[0.2em] font-bold">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'} in Bag
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={`${item.id}-${item.colors?.[0]}-${item.sizes?.[0]}`}
                                    variants={itemVariants}
                                    layout
                                    exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                                    className="flex gap-6 p-6 bg-white border border-neutral-sand/30 shadow-sm relative group"
                                >
                                    <div className="w-32 h-44 bg-neutral-sand flex-shrink-0 relative overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    </div>

                                    <div className="flex-1 flex flex-col pt-2">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-display text-2xl mb-1">{item.name}</h3>
                                                <p className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold">
                                                    {item.category}
                                                </p>
                                            </div>
                                            <span className="font-display text-xl text-primary-gold">
                                                AED {item.price.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest text-neutral-gray/60 font-bold font-light">Color</span>
                                                <span className="text-[11px] uppercase tracking-widest font-bold">{item.colors?.[0] || 'Default'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase tracking-widest text-neutral-gray/60 font-bold font-light">Size</span>
                                                <span className="text-[11px] uppercase tracking-widest font-bold">{item.sizes?.[0] || 'Standard'}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex justify-between items-end">
                                            <div className="flex items-center border border-neutral-sand/60 bg-neutral-cream/50 py-1 px-2">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-2 hover:text-primary-gold transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:text-primary-gold transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="flex items-center gap-2 text-neutral-gray/60 hover:text-accent-terracotta transition-colors group/trash"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-10 border border-neutral-sand/30 shadow-sm sticky top-32 space-y-10">
                            <h3 className="font-display text-3xl pb-6 border-b border-neutral-sand/30">Order Summary</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-gray font-light">Subtotal</span>
                                    <span>AED {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-gray font-light">Estimated Shipping</span>
                                    <span className={shipping === 0 ? 'text-accent-emerald uppercase tracking-widest text-[10px] font-bold' : ''}>
                                        {shipping === 0 ? 'Complimentary' : `AED ${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-gray font-light">VAT (5%)</span>
                                    <span>AED {tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-6 border-t border-neutral-sand/30 flex justify-between items-end">
                                    <span className="text-xs uppercase tracking-[0.2em] font-bold">Total Selection</span>
                                    <span className="font-display text-3xl text-primary-gold">AED {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-6 pt-4">
                                <Link href="/checkout">
                                    <Button variant="primary" className="w-full py-6 group flex items-center justify-center gap-4">
                                        <span className="uppercase tracking-[0.3em] text-[11px]">Proceed to Checkout</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </Button>
                                </Link>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray/60 ml-1">Promo Code</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="ENTER CODE"
                                            className="flex-1 bg-neutral-cream/50 border border-neutral-sand/60 p-4 text-[11px] tracking-[0.2em] uppercase focus:outline-none focus:border-primary-gold transition-colors"
                                        />
                                        <button className="px-8 border border-primary-dark text-primary-dark uppercase tracking-widest text-[10px] font-bold hover:bg-primary-dark hover:text-white transition-all duration-500">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 space-y-4">
                                <p className="text-[10px] text-neutral-gray/60 leading-relaxed font-light text-center italic">
                                    Payments are processed securely via Stripe. Complimentary exchange within 30 days is available.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.main>

            <Footer />
        </div>
    );
}
