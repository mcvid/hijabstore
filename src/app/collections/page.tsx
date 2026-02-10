"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/store/PageHero';

export default function CollectionsPage() {
    const collections = [
        {
            title: "Ramadan 2026",
            count: "45 Products",
            image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop",
            href: "/products?category=ramadan-2026",
            theme: "from-[#c9a961] to-[#2d5f4f]"
        },
        {
            title: "Eid Elegance",
            count: "32 Products",
            image: "https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?auto=format&fit=crop&q=80&w=800",
            href: "/products?category=eid-elegance",
            theme: "from-[#2d5f4f] to-[#c77d5b]"
        },
        {
            title: "Summer Modest",
            count: "28 Products",
            image: "https://images.unsplash.com/photo-1547881338-64674c07693b?auto=format&fit=crop&q=80&w=800",
            href: "/products?category=summer-modest",
            theme: "from-[#c77d5b] to-[#e8e3dc]"
        },
        {
            title: "Bridal Collection",
            count: "18 Products",
            image: "https://images.unsplash.com/photo-1655185497009-8b43f064f2ab?auto=format&fit=crop&q=80&w=800",
            href: "/products?category=bridal",
            theme: "from-[#e8e3dc] to-[#c9a961]"
        }
    ];

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body selection:bg-primary-gold selection:text-white">
            <Navbar />

            <PageHero
                title="Our Collections"
                subtitle="Curated selections that celebrate modesty, elegance, and timeless style."
                badge="Seasonal Editions"
            />

            <main className="container mx-auto px-4 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                    {collections.map((collection, index) => (
                        <Link
                            key={index}
                            href={collection.href}
                            className="group relative h-[600px] overflow-hidden bg-neutral-sand block animate-fade-in-up"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Image */}
                            <img
                                src={collection.image}
                                alt={collection.title}
                                className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${collection.theme} opacity-20 group-hover:opacity-30 transition-opacity duration-500 mix-blend-multiply`} />

                            {/* Content Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12 transition-all duration-500">
                                <h2 className="font-display text-4xl md:text-5xl text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">{collection.title}</h2>
                                <p className="text-neutral-sand text-sm uppercase tracking-[0.15em] mb-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">{collection.count}</p>

                                <span className="inline-flex items-center gap-2 text-white font-medium uppercase tracking-widest text-sm opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    Explore Collection
                                    <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
