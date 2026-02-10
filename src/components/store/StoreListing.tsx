"use client";
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/store/PageHero';
import FilterBar from '@/components/store/FilterBar';
import ProductCard from '@/components/store/ProductCard';
import { DbProduct } from '@/lib/products';

interface StoreListingProps {
    title: string;
    subtitle: string;
    categorySlug: string;
    heroTheme?: 'light' | 'dark';
    initialProducts: DbProduct[];
    heroBadge?: string;
    subcategories?: any[];
}

export default function StoreListing({
    title,
    subtitle,
    categorySlug,
    heroTheme = 'light',
    initialProducts,
    heroBadge,
    subcategories = []
}: StoreListingProps) {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sort, setSort] = useState('featured');

    const products = useMemo(() => {
        let sorted = [...initialProducts];

        switch (sort) {
            case 'newest':
                sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
            case 'price-asc':
                sorted.sort((a, b) => a.base_price - b.base_price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.base_price - a.base_price);
                break;
            default: // featured
                break;
        }
        return sorted;
    }, [sort, initialProducts]);

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body selection:bg-primary-gold selection:text-white">
            <Navbar />

            <PageHero
                title={title}
                subtitle={subtitle}
                badge={heroBadge}
                theme={heroTheme}
            />

            {/* Subcategories Grid */}
            {subcategories.length > 0 && (
                <div className="container mx-auto px-4 mb-20 animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div className="space-y-1">
                            <span className="text-primary-gold uppercase tracking-[0.2em] text-[10px] font-bold">Refine Collection</span>
                            <h2 className="font-display text-3xl text-primary-dark">Explore Specialized Styles</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                        {subcategories.map((sub) => (
                            <Link
                                key={sub.id}
                                href={`/products?category=${sub.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-square mb-3 overflow-hidden bg-neutral-sand shadow-sm transition-all duration-300 group-hover:shadow-md">
                                    {sub.image_url ? (
                                        <img
                                            src={sub.image_url}
                                            alt={sub.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-neutral-sand flex items-center justify-center text-neutral-dark/10 font-display italic">
                                            {sub.name}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                </div>
                                <span className="font-medium text-[11px] text-primary-dark uppercase tracking-widest group-hover:text-primary-gold transition-colors block text-center">
                                    {sub.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <FilterBar
                count={products.length}
                onSortChange={setSort}
                onViewChange={setView}
                currentView={view}
            />

            <main className="container mx-auto px-4 pb-24">
                {products.length === 0 ? (
                    <div className="text-center py-24 animate-fade-in">
                        <div className="text-6xl mb-4 opacity-20">Empty</div>
                        <h3 className="font-display text-2xl mb-2">No products found</h3>
                        <p className="text-neutral-gray">Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div className={`grid gap-x-8 gap-y-12 ${view === 'grid'
                        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                        : 'grid-cols-1 max-w-3xl mx-auto'
                        }`}>
                        {products.map((product, i) => (
                            <div key={product.id} className={`transition-all duration-500`} style={{ animationDelay: `${i * 100}ms` }}>
                                <ProductCard
                                    product={product}
                                    priority={i < 4}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
