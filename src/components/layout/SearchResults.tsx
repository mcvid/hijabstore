"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";

interface SearchResultsProps {
    results: Product[];
    isVisible: boolean;
    onClose: () => void;
    isLoading: boolean;
}

export default function SearchResults({ results, isVisible, onClose, isLoading }: SearchResultsProps) {
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-full right-0 mt-4 w-[400px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-sand/30 z-[100] overflow-hidden"
            >
                <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-gold">Search Results</span>
                        {isLoading && (
                            <motion.div
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-[9px] uppercase tracking-widest text-neutral-gray"
                            >
                                Finding Masterpieces...
                            </motion.div>
                        )}
                    </div>

                    {results.length > 0 ? (
                        <div className="space-y-6">
                            {results.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Link
                                        href={`/products/${product.id}`}
                                        onClick={onClose}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-16 h-20 bg-neutral-sand overflow-hidden flex-shrink-0">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-1">
                                            <span className="text-[8px] uppercase tracking-widest text-neutral-gray">{product.category}</span>
                                            <h4 className="text-sm font-display text-primary-dark group-hover:text-primary-gold transition-colors line-clamp-1">{product.name}</h4>
                                            <span className="text-[10px] font-bold text-primary-dark">
                                                AED {(product.price || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                            <div className="pt-4 border-t border-neutral-sand/20">
                                <Link
                                    href="/products"
                                    onClick={onClose}
                                    className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-dark hover:text-primary-gold transition-colors flex items-center justify-center gap-2"
                                >
                                    View All Collections &rarr;
                                </Link>
                            </div>
                        </div>
                    ) : (
                        !isLoading && (
                            <div className="py-12 text-center space-y-4">
                                <p className="text-sm text-neutral-gray font-light">No matches found in our treasury.</p>
                                <button
                                    onClick={onClose}
                                    className="text-[10px] uppercase tracking-widest font-bold text-primary-gold"
                                >
                                    Clear Search
                                </button>
                            </div>
                        )
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
