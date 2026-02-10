"use client";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";

// Mock Data (Ideally fetch from API/Context)
const allProducts: Product[] = [
    {
        id: "1",
        name: "Classic Silk Hijab - Midnight",
        price: 89,
        category: "Hijabs",
        image: "https://images.unsplash.com/photo-1594136975364-2d2dc859f6a8?q=80&w=1888&auto=format&fit=crop",
        description: "A luxurious silk hijab in a deep midnight hue.",
        isNew: true
    },
    {
        id: "2",
        name: "Embroidered Abaya - Sage",
        price: 249,
        originalPrice: 299,
        category: "Abayas",
        image: "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?q=80&w=1935&auto=format&fit=crop",
        description: "An elegantly embroidered abaya in sage green.",
        onSale: true
    },
    {
        id: "3",
        name: "Premium Jersey Wrap - Rose",
        price: 45,
        category: "Hijabs",
        image: "https://images.unsplash.com/photo-1621682372775-533449e5502c?q=80&w=1887&auto=format&fit=crop",
        description: "A soft jersey wrap in a beautiful rose shade."
    },
    {
        id: "4",
        name: "Luxe Evening Gown - Noir",
        price: 399,
        category: "Dresses",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1924&auto=format&fit=crop",
        description: "A stunning evening gown in classic noir.",
        isNew: true
    },
    {
        id: "5",
        name: "Pearl Detailed Chiffon - Vanilla",
        price: 59,
        category: "Hijabs",
        image: "https://images.unsplash.com/photo-1627931885501-591253457a4e?q=80&w=1887&auto=format&fit=crop",
        description: "A delicate chiffon hijab with pearl detailing."
    }
];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const filtered = allProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.category.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setHasSearched(true);
    };

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Search Header */}
                    <div className="text-center space-y-4">
                        <h1 className="font-display text-4xl md:text-5xl">Find Your Style</h1>
                        <p className="text-neutral-gray text-lg max-w-lg mx-auto">Explore our collection of premium modest fashion, from silk hijabs to luxury abayas.</p>
                    </div>

                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            placeholder="What are you looking for? (e.g., 'Abaya', 'Silk')"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-primary-dark/20 px-4 py-6 text-2xl md:text-3xl font-display focus:outline-none focus:border-primary-gold transition-colors placeholder:text-primary-dark/30"
                            autoFocus
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-dark/50 hover:text-primary-gold transition-colors">
                            <ArrowRight className="w-8 h-8" />
                        </button>
                    </form>

                    {/* Results or Empty State */}
                    {hasSearched ? (
                        <div className="space-y-8 animate-fade-in">
                            <h2 className="text-xs uppercase tracking-[0.2em] text-neutral-gray">
                                {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
                            </h2>
                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/50 border border-neutral-sand">
                                    <p className="text-xl text-neutral-gray mb-4">No matches found for "{query}"</p>
                                    <button onClick={() => { setQuery(""); setHasSearched(false) }} className="text-primary-gold underline hover:text-primary-dark transition-colors">Clear Search</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Suggested / Trending */
                        <div className="pt-8 border-t border-primary-dark/10">
                            <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-gray mb-6">Trending Now</h3>
                            <div className="flex flex-wrap gap-4">
                                {["Silk Hijabs", "Ramadan Collection", "Velvet Abayas", "Gift Sets", "Perfumes"].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => { setQuery(tag); handleSearch({ preventDefault: () => { } } as any); }}
                                        className="px-6 py-2 border border-primary-dark/20 rounded-full hover:bg-primary-dark hover:text-white transition-all duration-300 text-sm"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
