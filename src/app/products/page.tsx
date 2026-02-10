"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";

const allProducts: Product[] = [
    {
        id: "1",
        name: "Classic Silk Hijab",
        price: 35.00,
        originalPrice: 45.00,
        category: "Premium Hijabs",
        image: "/images/silk-hijab.png",
        description: "Elegant silk hijab with a soft sheen.",
        isNew: true,
        onSale: true,
    },
    {
        id: "2",
        name: "Embroidered Abaya",
        price: 120.00,
        category: "Abayas",
        image: "/images/luxury-abaya.png",
        description: "Luxurious abaya with intricate embroidery.",
    },
    {
        id: "3",
        name: "Essential Chiffon",
        price: 24.00,
        category: "Essentials",
        image: "/images/collection.png",
        description: "Lightweight chiffon for daily wear.",
        isNew: true,
    },
    {
        id: "4",
        name: "Luxury Musk Parfum",
        price: 85.00,
        category: "Fragrances",
        image: "/images/perfume.png",
        description: "High-end musk with floral notes.",
    },
    {
        id: "5",
        name: "Cotton Comfort Hijab",
        price: 18.00,
        category: "Essentials",
        image: "/images/collection.png",
        description: "Breathable cotton for all-day comfort.",
    },
    {
        id: "6",
        name: "Evening Sparkle Abaya",
        price: 150.00,
        category: "Abayas",
        image: "/images/luxury-abaya.png",
        description: "Hand-stitched sequence work on premium fabric.",
    },
    {
        id: "7",
        name: "Rose & Oud Attar",
        price: 45.00,
        category: "Fragrances",
        image: "/images/perfume.png",
        description: "Classic blend of Taif rose and Cambodian oud.",
    },
    {
        id: "8",
        name: "Magnetic Undercap",
        price: 12.00,
        category: "Accessories",
        image: "/images/collection.png",
        description: "Non-slip magnetic closure undercap.",
    },
    {
        id: "9",
        name: "Gold-Plated Hijab Pins",
        price: 15.00,
        category: "Accessories",
        image: "/images/collection.png",
        description: "Set of 4 luxury hijab pins.",
    }
];

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState("All Products");

    const filteredProducts = activeCategory === "All Products"
        ? allProducts
        : allProducts.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]));

    return (
        <div className="min-h-screen bg-neutral-cream font-body pt-24 text-primary-dark">
            <Navbar />
            <div className="container mx-auto px-4 py-12">
                <header className="mb-20 text-center">
                    <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">The Collection</span>
                    <h1 className="font-display text-5xl md:text-7xl mb-8">Refined Modesty</h1>
                    <p className="max-w-2xl mx-auto text-neutral-gray font-light text-lg leading-relaxed">
                        Explore our curated selection of premium modest wear, designed for elegance,
                        comfort, and the contemporary Muslim lifestyle.
                    </p>
                </header>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 flex-shrink-0 space-y-12">
                        <div>
                            <h3 className="font-display text-2xl mb-8 text-primary-dark">Categories</h3>
                            <ul className="space-y-4 text-xs font-semibold tracking-widest text-neutral-gray uppercase">
                                {["All Products", "Premium Hijabs", "Abayas", "Essentials", "Accessories", "Fragrances"].map((c) => (
                                    <li
                                        key={c}
                                        onClick={() => setActiveCategory(c)}
                                        className={`cursor-pointer transition-all duration-300 flex items-center justify-between group hover:text-primary-gold ${activeCategory === c ? 'text-primary-dark border-l-2 border-primary-gold pl-4' : ''}`}
                                    >
                                        {c}
                                        <span className={`transition-all duration-300 ${activeCategory === c ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>&rarr;</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-8 border-t border-neutral-sand">
                            <h3 className="font-display text-2xl mb-8 text-primary-dark">Palette</h3>
                            <div className="grid grid-cols-5 gap-4">
                                {["#1a1a1a", "#c9a961", "#2d5f4f", "#c77d5b", "#f8f6f3", "#e8e3dc", "#6b6b6b"].map(c => (
                                    <button
                                        key={c}
                                        className="w-8 h-8 rounded-full border border-neutral-gray/10 hover:scale-125 transition-transform shadow-sm"
                                        style={{ backgroundColor: c }}
                                        aria-label={`Select color ${c}`}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-neutral-sand">
                            <h3 className="font-display text-2xl mb-8 text-primary-dark">Price</h3>
                            <div className="space-y-6">
                                <input type="range" className="w-full accent-primary-gold" min="0" max="500" />
                                <div className="flex justify-between items-center text-xs font-bold tracking-widest text-neutral-gray uppercase">
                                    <span>$0</span>
                                    <span>$500</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {/* Sort Bar */}
                        <div className="flex justify-between items-center mb-12 pb-6 border-b border-neutral-sand">
                            <p className="text-[10px] text-neutral-gray uppercase tracking-[0.2em] font-bold">{filteredProducts.length} Pieces Found</p>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] text-neutral-gray uppercase tracking-[0.2em] font-bold">Sort By:</span>
                                <select className="bg-transparent text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer text-primary-dark">
                                    <option>Relevance</option>
                                    <option>Price: Low-High</option>
                                    <option>Price: High-Low</option>
                                    <option>Newest</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="mt-24 flex justify-center items-center gap-4">
                            <button className="text-neutral-gray hover:text-primary-dark transition-colors uppercase tracking-[0.3em] text-[10px] font-bold">&larr; Prev</button>
                            <div className="flex gap-2">
                                {[1, 2, 3].map((page) => (
                                    <button
                                        key={page}
                                        className={`w-10 h-10 flex items-center justify-center transition-all duration-300 font-bold text-xs ${page === 1 ? 'bg-primary-dark text-white shadow-xl' : 'text-neutral-gray hover:text-primary-gold'}`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button className="text-neutral-gray hover:text-primary-dark transition-colors uppercase tracking-[0.3em] text-[10px] font-bold">Next &rarr;</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
