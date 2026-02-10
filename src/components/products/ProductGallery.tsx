"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
    images: string[];
    productName: string;
    onSale?: boolean;
}

export default function ProductGallery({ images, productName, onSale }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="space-y-6">
            <div className="aspect-[3/4] bg-neutral-sand relative overflow-hidden group shadow-2xl">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        src={images[activeIndex]}
                        alt={productName}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>
                {onSale && (
                    <span className="absolute top-6 left-6 bg-primary-gold text-white text-xs font-bold px-4 py-2 tracking-[0.2em] shadow-xl z-10">
                        SALE
                    </span>
                )}
            </div>

            <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveIndex(i)}
                        className={`aspect-square bg-neutral-sand border transition-all duration-300 cursor-pointer group overflow-hidden ${activeIndex === i ? 'border-primary-gold ring-1 ring-primary-gold' : 'border-neutral-sand hover:border-primary-gold/50'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`${productName} thumbnail ${i + 1}`}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${activeIndex === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                                }`}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
