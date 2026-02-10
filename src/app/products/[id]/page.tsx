"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { motion } from "framer-motion";

// Modular Components
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductSelectors from "@/components/products/ProductSelectors";
import ProductTabs from "@/components/products/ProductTabs";

const allProducts: Product[] = [
    {
        id: "1",
        name: "Classic Silk Hijab",
        price: 35.00,
        originalPrice: 45.00,
        category: "Premium Hijabs",
        image: "/images/silk-hijab.png",
        description: "Our Classic Silk Hijab is crafted from the finest mulberry silk, offering a luxurious sheen and a drape that is both graceful and effortless. Perfect for special occasions or adding a touch of elegance to your daily attire.",
        isNew: true,
        onSale: true,
        colors: ["Cream", "Midnight Blue", "Dusty Rose"],
        sizes: ["Standard", "Large"]
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
} as const;

export default function ProductDetailPage() {
    const params = useParams();
    const { addItem, updateQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);

    // Default product handling
    const product = allProducts.find(p => p.id === params.id) || allProducts[0];

    const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Cream");
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "Standard");

    const handleAddToCart = () => {
        addItem(product);
        if (quantity > 1) {
            updateQuantity(product.id, quantity);
        }
    };

    const galleryImages = [
        product.image,
        "/images/collection.png",
        product.image,
        "/images/collection.png"
    ];

    return (
        <div className="min-h-screen bg-neutral-cream font-body pt-24 text-primary-dark">
            <Navbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-4 py-16"
            >
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Image Gallery */}
                    <motion.div variants={itemVariants} className="lg:w-1/2">
                        <ProductGallery
                            images={galleryImages}
                            productName={product.name}
                            onSale={product.onSale}
                        />
                    </motion.div>

                    {/* Product Details Section */}
                    <div className="lg:w-1/2 flex flex-col">
                        <motion.div variants={itemVariants}>
                            <ProductInfo product={product} />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <ProductSelectors
                                product={product}
                                selectedColor={selectedColor}
                                setSelectedColor={setSelectedColor}
                                selectedSize={selectedSize}
                                setSelectedSize={setSelectedSize}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                handleAddToCart={handleAddToCart}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <ProductTabs />
                        </motion.div>
                    </div>
                </div>

                {/* Suggestions Section */}
                <motion.section variants={itemVariants} className="mt-40 border-t border-neutral-sand pt-24">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="space-y-2">
                            <span className="text-primary-gold uppercase tracking-[0.2em] text-xs font-bold">You Might Also Love</span>
                            <h2 className="font-display text-5xl text-primary-dark">Complete the Ensemble</h2>
                        </div>
                        <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-neutral-gray hover:text-primary-gold border-b border-primary-gold/30 pb-1">Explore All</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {allProducts.slice(0, 4).map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </motion.section>
            </motion.main>

            <Footer />
        </div>
    );
}
