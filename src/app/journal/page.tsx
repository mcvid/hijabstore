"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NextLink from "next/link";

const articles = [
    {
        id: "1",
        title: "The Art of Silk: A Masterclass in Drapery",
        excerpt: "Discover the centuries-old techniques used by our artisans to create the perfect sheen and drape for our signature silk hijabs.",
        image: "/images/journal-silk.png",
        category: "Craftsmanship",
        date: "Feb 12, 2026",
        featured: true
    },
    {
        id: "2",
        title: "Ramadan 2026: The Elegance of Moonlight",
        excerpt: "Explore our curated collection for the holy month, where traditional silhouettes meet contemporary sophistication.",
        image: "/images/collection.png",
        category: "Collections",
        date: "Feb 08, 2026",
    },
    {
        id: "3",
        title: "Bespoke Modesty: Beyond the Veil",
        excerpt: "An intimate interview with our Creative Director on the philosophy of modest fashion in the modern world.",
        image: "/images/journal-interview.png",
        category: "Editorial",
        date: "Jan 28, 2026",
    },
    {
        id: "4",
        title: "Sustainability in Luxury: Our Promise",
        excerpt: "How Yasmin Fashions is leading the way in ethical production and eco-conscious heritage fabrics.",
        image: "/images/silk-hijab.png",
        category: "Vision",
        date: "Jan 15, 2026",
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
} as const;

export default function JournalPage() {
    const { scrollY } = useScroll();
    const yHero = useTransform(scrollY, [0, 800], [0, 150]);
    const [activeCategory, setActiveCategory] = useState("All");
    const categories = ["All", "Collections", "Craftsmanship", "Editorial", "Vision"];

    const featuredArticle = articles.find(a => a.featured) || articles[0];
    const gridArticles = articles.filter(a => !a.featured && (activeCategory === "All" || a.category === activeCategory));

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body">
            <Navbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="container mx-auto px-4 py-24 md:py-32"
            >
                {/* Header & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <div className="space-y-6">
                        <span className="text-primary-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Yasmin Journal</span>
                        <h1 className="font-display text-6xl md:text-9xl tracking-tight leading-[0.9]">Editorial<br />Insights</h1>
                    </div>

                    <div className="flex flex-wrap gap-6 border-b border-neutral-sand/40 pb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${activeCategory === cat ? 'text-primary-gold scale-110' : 'text-neutral-gray hover:text-primary-dark'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Masterpiece */}
                <motion.section variants={itemVariants} className="mb-32">
                    <NextLink href={`/journal/${featuredArticle.id}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <motion.div
                            style={{ y: yHero }}
                            className="aspect-[16/10] bg-neutral-sand overflow-hidden relative shadow-2xl"
                        >
                            <img src={featuredArticle.image} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-primary-dark/5 group-hover:bg-transparent transition-colors duration-700"></div>
                        </motion.div>
                        <div className="space-y-10 pr-12">
                            <div className="space-y-4">
                                <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold">Featured Story</span>
                                <h2 className="font-display text-4xl md:text-6xl leading-[1.1] group-hover:text-primary-gold transition-colors">{featuredArticle.title}</h2>
                            </div>
                            <p className="text-neutral-gray text-xl font-light leading-relaxed">{featuredArticle.excerpt}</p>
                            <div className="flex items-center gap-6">
                                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray/60">{featuredArticle.date}</span>
                                <div className="h-px w-12 bg-neutral-sand/60"></div>
                                <span className="text-[11px] uppercase tracking-[0.3em] font-bold group-hover:translate-x-2 transition-transform">Read Insights</span>
                            </div>
                        </div>
                    </NextLink>
                </motion.section>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
                    {gridArticles.map((article) => (
                        <motion.div key={article.id} variants={itemVariants}>
                            <NextLink href={`/journal/${article.id}`} className="group space-y-8 block">
                                <div className="aspect-[4/5] bg-neutral-sand overflow-hidden shadow-xl">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary-gold uppercase tracking-[0.3em] text-[8px] font-bold px-3 py-1 border border-primary-gold/30">{article.category}</span>
                                        <span className="text-[9px] uppercase tracking-widest text-neutral-gray/60">{article.date}</span>
                                    </div>
                                    <h3 className="font-display text-3xl leading-tight group-hover:text-primary-gold transition-colors">{article.title}</h3>
                                    <p className="text-neutral-gray text-sm font-light leading-relaxed line-clamp-2">{article.excerpt}</p>
                                    <div className="pt-4 flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold group-hover:gap-6 transition-all">
                                        <span>Continue Reading</span>
                                        <ArrowRight className="w-3 h-3 text-primary-gold" />
                                    </div>
                                </div>
                            </NextLink>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter Subscription */}
                <motion.section variants={itemVariants} className="mt-40 bg-white p-16 md:p-24 border border-neutral-sand/20 text-center space-y-12">
                    <div className="max-w-xl mx-auto space-y-4">
                        <span className="text-primary-gold uppercase tracking-[0.4em] text-[10px] font-bold">The Inner Circle</span>
                        <h2 className="font-display text-5xl">Sublime Stories Delivered</h2>
                        <p className="text-neutral-gray text-lg font-light">Join our curated list to receive exclusive early access to collections and editorial insights.</p>
                    </div>
                    <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="YOUR EMAIL ADDRESS"
                            className="flex-1 bg-neutral-cream/20 border-b border-neutral-sand/60 p-4 text-[10px] tracking-[0.2em] font-bold focus:outline-none focus:border-primary-gold transition-colors"
                        />
                        <button className="px-12 py-5 bg-primary-dark text-white uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-primary-gold transition-colors duration-500 shadow-xl">
                            Subscribe
                        </button>
                    </form>
                </motion.section>
            </motion.main>

            <Footer />
        </div>
    );
}
