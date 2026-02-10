"use client";
import React, { useEffect, useState } from 'react';
import { X, Heart, Star, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useQuickView } from '@/context/QuickViewContext';
import { useToast } from '@/context/ToastContext';

export default function QuickViewModal() {
    const { isOpen, product, closeQuickView } = useQuickView();
    const { showToast } = useToast();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleAddToCart = () => {
        if (product) {
            showToast(`${product.name} added to selection`, "success");
            // Here you would also call an addItem function if available
        }
    };

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setQuantity(1);
            const primary = product.images?.find(img => img.is_primary)?.url || product.images?.[0]?.url;
            setSelectedImage(primary || null);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const mainImage = selectedImage || '/images/placeholder-product.jpg';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeQuickView}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-white rounded-none shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh] md:h-auto">
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-[#1a1a1a] hover:text-white transition-all shadow-sm"
                >
                    <X size={20} />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 bg-[#f8f6f3] relative h-[40vh] md:h-auto overflow-hidden group">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Thumbnails (if multiple) */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img.url)}
                                    className={`w-16 h-16 flex-shrink-0 border-2 transition-all ${selectedImage === img.url ? 'border-[#c9a961]' : 'border-white/50 hover:border-white'}`}
                                >
                                    <img src={img.url} className="w-full h-full object-cover" alt={`View ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar bg-white flex flex-col">
                    <div className="mb-6">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#c9a961] mb-2 block">
                            {product.category?.name || 'Collection'}
                        </span>
                        <h2 className="font-display text-3xl md:text-4xl text-[#1a1a1a] mb-2 leading-tight">
                            {product.name}
                        </h2>
                        <div className="flex items-center gap-4 mt-3">
                            <span className="text-xl md:text-2xl font-medium text-[#1a1a1a]">
                                {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.base_price || 0)}
                            </span>
                            <div className="flex items-center gap-1 text-[#c9a961]">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-current" />)}
                                <span className="text-xs text-[#a0a0a0] ml-1">(New)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-[#6b6b6b] leading-relaxed mb-8 font-light text-sm md:text-base">
                        {product.description || "A masterpiece of craftsmanship, designed for the modern muse. Elegant, timeless, and effortlessly chic."}
                    </p>

                    {/* Quantity & Add to Cart */}
                    <div className="space-y-6 mt-auto">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-[#e8e3dc] h-12 w-32">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-full flex items-center justify-center hover:bg-[#f8f6f3]"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="flex-1 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-full flex items-center justify-center hover:bg-[#f8f6f3]"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 h-12 bg-[#1a1a1a] text-white uppercase tracking-widest text-xs font-bold hover:bg-[#c9a961] transition-all flex items-center justify-center gap-2"
                            >
                                Add to Cart
                            </button>
                            <button className="h-12 w-12 border border-[#e8e3dc] flex items-center justify-center hover:border-[#c9a961] hover:text-[#c9a961] transition-all">
                                <Heart size={20} />
                            </button>
                        </div>

                        <Link
                            href={`/product/${product.slug}`}
                            onClick={closeQuickView}
                            className="block text-center text-xs uppercase tracking-widest text-[#6b6b6b] hover:text-[#1a1a1a] underline underline-offset-4"
                        >
                            View Full Details
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
}
