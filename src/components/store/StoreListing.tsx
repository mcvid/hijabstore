"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/store/PageHero';
import FilterBar from '@/components/store/FilterBar';
import ProductCard from '@/components/store/ProductCard';
import { DbProduct, productService } from '@/lib/products';

interface StoreListingProps {
    title: string;
    subtitle: string;
    categorySlug: string; // Used for "active" state or re-fetching if needed
    heroTheme?: 'light' | 'dark';
    initialProducts: DbProduct[];
    heroBadge?: string;
}

export default function StoreListing({
    title,
    subtitle,
    categorySlug,
    heroTheme = 'light',
    initialProducts,
    heroBadge
}: StoreListingProps) {
    const [products, setProducts] = useState<DbProduct[]>(initialProducts);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [sort, setSort] = useState('featured');
    const [isLoading, setIsLoading] = useState(false);

    // Filter Logic (Client-side for now)
    // In a real app, this might trigger a server action or API call
    useEffect(() => {
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
            default: // featured - assume initial order or specific logic
                break;
        }

        setProducts(sorted);
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
