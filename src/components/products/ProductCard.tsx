"use client";
import React from "react";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addItem } = useCart();
    const { user, toggleWishlist, isAuthenticated } = useAuth();
    const isInWishlist = user?.wishlist?.some(id => id === product.id);

    return (
        <div className="group cursor-pointer relative">
            <div className="aspect-[3/4] bg-white relative overflow-hidden transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
                <Link href={`/products/${product.id}`} className="absolute inset-0 z-0 block" data-cursor-text="VIEW">
                    {/* Product Image */}
                    {product.image ? (
                        <div className="w-full h-full relative overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-neutral-gray/10 group-hover:bg-neutral-gray/5 transition-colors duration-500"></div>
                    )}
                </Link>

                {/* Wishlist Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        if (isAuthenticated) {
                            toggleWishlist(product.id);
                        } else {
                            // Dispatch custom event to open auth modal (handled in Navbar or globally)
                            window.dispatchEvent(new CustomEvent('open-auth-modal'));
                        }
                    }}
                    className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-primary-dark hover:bg-white hover:text-primary-gold transition-all duration-300 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                >
                    <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-primary-gold text-primary-gold' : ''}`} />
                </button>

                {/* Badges */}
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 items-start">
                    {product.isNew && (
                        <span className="bg-primary-gold text-white text-[10px] uppercase font-medium px-3 py-1 tracking-[0.1em]">
                            New Arrival
                        </span>
                    )}
                    {product.onSale && (
                        <span className="bg-primary-dark text-white text-[10px] uppercase font-medium px-3 py-1 tracking-[0.1em]">
                            Sale
                        </span>
                    )}
                </div>

                {/* Quick View Link */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    <Link href={`/products/${product.id}`} className="bg-white text-primary-dark px-8 py-3 text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-primary-gold hover:text-white transition-colors duration-300 whitespace-nowrap shadow-lg block">
                        Quick View
                    </Link>
                </div>
            </div>

            <div className="text-center space-y-2">
                <p className="text-[10px] text-neutral-gray uppercase tracking-[0.2em] font-medium">
                    {product.category}
                </p>
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-display text-xl text-primary-dark group-hover:text-primary-gold transition-colors duration-300">
                        {product.name}
                    </h3>
                </Link>
                <div className="flex justify-center items-center gap-3">
                    {product.originalPrice && (
                        <span className="text-sm text-neutral-gray line-through font-light">
                            ${(product.originalPrice || 0).toFixed(2)}
                        </span>
                    )}
                    <span className="text-primary-gold font-medium text-lg">
                        ${(product.price || 0).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
