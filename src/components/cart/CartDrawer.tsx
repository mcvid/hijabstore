"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/common/Button";
import Link from "next/link";

export default function CartDrawer() {
    const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, subtotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-neutral-cream shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-sand flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-primary-gold" />
                                <h2 className="font-display text-2xl text-primary-dark">Shopping Bag</h2>
                                <span className="text-sm text-neutral-gray bg-white border border-neutral-sand px-2 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-white transition-colors rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 bg-neutral-sand/30 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-10 h-10 text-neutral-gray/40" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-display text-primary-dark mb-2">Your bag is empty</p>
                                        <p className="text-neutral-gray text-sm font-light">
                                            Looks like you haven&apos;t added anything yet.
                                        </p>
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => setIsCartOpen(false)}
                                    >
                                        Start Shopping
                                    </Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group">
                                        {/* Item Image */}
                                        <div className="w-24 h-32 bg-neutral-sand flex-shrink-0 relative overflow-hidden">
                                            {/* Image placeholder */}
                                            <div className="absolute inset-0 bg-neutral-gray/10"></div>
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] text-neutral-gray uppercase tracking-widest mb-1">
                                                        {item.category}
                                                    </p>
                                                    <h3 className="font-display text-lg leading-tight hover:text-primary-gold transition-colors cursor-pointer">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                <p className="font-medium text-primary-gold">${item.price.toFixed(2)}</p>
                                            </div>

                                            <div className="flex justify-between items-end pt-2">
                                                {/* Quantity Selector */}
                                                <div className="flex items-center border border-neutral-sand bg-white px-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1.5 hover:text-primary-gold"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1.5 hover:text-primary-gold"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-neutral-gray hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-neutral-sand space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-neutral-gray">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-neutral-gray">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-display text-primary-dark pt-2 border-t border-neutral-sand mt-2">
                                        <span>Total</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/checkout" className="block w-full">
                                        <Button variant="primary" className="w-full py-4 tracking-[0.2em] text-sm">
                                            Checkout
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={() => setIsCartOpen(false)}
                                        className="w-full text-center text-xs text-neutral-gray uppercase tracking-widest font-medium hover:text-primary-dark transition-colors py-2"
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
