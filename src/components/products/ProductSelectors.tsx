"use client";
import React from "react";
import { Minus, Plus, Heart, Share2 } from "lucide-react";
import { Product } from "@/types";
import Button from "@/components/common/Button";
import { useToast } from "@/context/ToastContext";

interface ProductSelectorsProps {
    product: Product;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    quantity: number;
    setQuantity: (qty: number | ((q: number) => number)) => void;
    handleAddToCart: () => void;
}

const colorMap: Record<string, string> = {
    "Cream": "#f8f6f3",
    "Midnight Blue": "#1a1a2e",
    "Dusty Rose": "#d8a892",
    "Black": "#000000",
    "Charcoal": "#2d2d2d",
    "Forest Green": "#2d5f4f",
    "Navy": "#1a3a52"
};

export default function ProductSelectors({
    product,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    handleAddToCart
}: ProductSelectorsProps) {
    const { showToast } = useToast();

    const onAdd = () => {
        handleAddToCart();
        showToast(`${product.name} added to your selection`, "success");
    };
    return (
        <div className="space-y-10 pt-6">
            {/* Color Selection */}
            <div className="space-y-4">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-gray">
                    Color: <span className="text-primary-dark">{selectedColor}</span>
                </span>
                <div className="flex gap-4">
                    {product.colors?.map(color => (
                        <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${selectedColor === color
                                ? 'border-primary-gold scale-110 p-1'
                                : 'border-transparent hover:border-neutral-sand'
                                }`}
                        >
                            <div
                                className="w-full h-full rounded-full shadow-inner"
                                style={{ backgroundColor: colorMap[color] || '#ccc' }}
                            ></div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-gray">
                        Size: <span className="text-primary-dark">{selectedSize}</span>
                    </span>
                    <button className="text-[10px] uppercase font-bold tracking-widest text-primary-gold hover:underline">
                        Size Guide
                    </button>
                </div>
                <div className="flex gap-3">
                    {product.sizes?.map(size => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`flex-1 py-4 border text-xs font-bold tracking-widest transition-all duration-300 ${selectedSize === size
                                ? 'bg-primary-dark text-white border-primary-dark shadow-lg'
                                : 'border-neutral-sand hover:border-primary-gold'
                                }`}
                        >
                            {size.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-6 pt-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center border border-neutral-sand bg-white py-2">
                        <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="px-4 hover:text-primary-gold transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-sm tracking-widest">{quantity}</span>
                        <button
                            onClick={() => setQuantity(q => q + 1)}
                            className="px-4 hover:text-primary-gold transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="p-4 border border-neutral-sand hover:text-primary-gold hover:border-primary-gold transition-all duration-300 group">
                        <Heart className="w-5 h-5 group-hover:fill-primary-gold transition-colors" />
                    </button>
                    <button className="p-4 border border-neutral-sand hover:text-primary-gold hover:border-primary-gold transition-all duration-300">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        className="w-full py-6 text-sm tracking-[0.4em] uppercase"
                        onClick={onAdd}
                        data-cursor-text="ADD TO BAG"
                    >
                        Add to Shopping Bag
                    </Button>
                    <p className="text-center text-[10px] uppercase tracking-widest text-neutral-gray font-bold">
                        Only 8 left in stock - Join 12 others browsing
                    </p>
                </div>
            </div>

            {/* Benefits Mini-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {[
                    { icon: '✓', text: "Complimentary Global Delivery" },
                    { icon: '↺', text: "30-Day Luxury Returns" },
                    { icon: '🔒', text: "Secure Couture Checkout" },
                    { icon: '📦', text: "Arrives in Branded Packaging" }
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-neutral-gray bg-neutral-sand/20 p-3 rounded">
                        <span className="text-primary-gold">{item.icon}</span>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
