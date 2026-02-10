"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import Button from "@/components/common/Button";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import HorizontalGallery from "@/components/common/HorizontalGallery";
import ParallaxSection from "@/components/common/ParallaxSection";
import ScrollReveal from "@/components/common/ScrollReveal";
import GeometricPattern from "@/components/common/GeometricPattern";
import { Product } from "@/types";
import { motion } from "framer-motion";

import { adminService } from "@/lib/admin";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          adminService.getFeaturedProducts(),
          adminService.getFeaturedCategories()
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-neutral-cream text-primary-dark font-body selection:bg-primary-gold selection:text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Horizontal Scroll Showcase */}
      <div className="relative">
        <GeometricPattern />
        <HorizontalGallery title="Signature Picks" subtitle="Featured">
          {products.map((product) => (
            <div key={product.id} className="w-[300px] md:w-[450px] flex-shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </HorizontalGallery>
      </div>

      {/* Editorial Split Section */}
      <section className="py-32 bg-primary-dark text-neutral-cream overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-20">
          <ParallaxSection offset={80} className="h-[700px]">
            <div className="relative group overflow-hidden h-[860px] -mt-[80px]">
              <img
                src="/images/collection.png"
                alt="The Craftsmanship"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-125"
              />
              <div className="absolute inset-0 border-[20px] border-white/5 group-hover:border-white/20 transition-all duration-700"></div>
            </div>
          </ParallaxSection>
          <div className="space-y-10">
            <ScrollReveal>
              <span className="text-primary-gold uppercase tracking-[0.3em] text-xs font-bold">Our Heritage</span>
              <h2 className="font-display text-5xl md:text-7xl leading-tight text-white mt-4">The Art of <br /> Fine Draping</h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-neutral-sand/60 text-lg font-light leading-relaxed max-w-md">
                Each piece in the Yasmin Fashions collection is a testiment to centuries of garment-making traditions,
                refined for the discerning modern woman. We source the world&apos;s most precious silks and chiffons
                to ensure every drape is a masterpiece.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <Link href="/about" className="inline-block group">
                <span className="text-sm uppercase tracking-widest font-bold text-primary-gold pb-1 border-b border-primary-gold/30 group-hover:border-primary-gold transition-all">Read Our Story</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Collection Grid */}
      <section className="py-32 bg-white relative">
        <GeometricPattern />
        <div className="container mx-auto px-4">
          <ScrollReveal className="text-center mb-24 space-y-4">
            <h2 className="font-display text-5xl md:text-7xl text-primary-dark">Categories</h2>
            <p className="text-neutral-gray uppercase tracking-[0.3em] text-[10px] font-bold">Explore our departments</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.id} delay={i * 0.15}>
                <Link href={`/products?category=${cat.slug}`} className="relative h-[500px] overflow-hidden group block">
                  <img
                    src={cat.image_url || "/images/collection.png"}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white font-display text-4xl uppercase tracking-tighter group-hover:scale-125 transition-transform duration-700">{cat.name}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
