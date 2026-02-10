"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { motion } from "framer-motion";
import { adminService } from "@/lib/admin";
import { Loader2 } from "lucide-react";

// Modular Components
import ProductGallery from "@/components/products/ProductGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductSelectors from "@/components/products/ProductSelectors";
import ProductTabs from "@/components/products/ProductTabs";

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
    const id = params?.id as string;
    const { addItem, updateQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadProduct(id);
        }
    }, [id]);

    const loadProduct = async (productId: string) => {
        try {
            setIsLoading(true);
            const data = await adminService.getProductById(productId);
            // Map DB structure to what components expect
            const mappedProduct = {
                ...data,
                price: data.base_price,
                category: data.category?.name || "Premium Collection",
                image: data.images?.find((img: any) => img.is_primary)?.url || data.images?.[0]?.url || "/images/silk-hijab.png",
                images: data.images?.map((img: any) => img.url) || []
            };
            setProduct(mappedProduct);
        } catch (error) {
            console.error("Failed to load product", error);
        } finally {
            setIsLoading(false);
        }
    };

    const [selectedColor, setSelectedColor] = useState("Cream");
    const [selectedSize, setSelectedSize] = useState("Standard");

    const handleAddToCart = () => {
        if (!product) return;
        addItem(product);
        if (quantity > 1) {
            updateQuantity(product.id, quantity);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-cream pt-24 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-gold" size={40} />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-neutral-cream pt-24 text-center">
                <h1 className="text-2xl font-display">Product not found</h1>
                <Link href="/products" className="text-primary-gold hover:underline">Return to Store</Link>
            </div>
        );
    }

    const galleryImages = product.images.length > 0 ? product.images : [product.image];

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

                {/* Suggestions Section - Potentially load related products here later */}
            </motion.main>

            <Footer />
        </div>
    );
}
