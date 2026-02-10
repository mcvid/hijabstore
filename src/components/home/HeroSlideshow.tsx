"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/common/Button';

export interface SlideData {
    id: string;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    heading: string;
    subheading?: string;
    buttonText: string;
    buttonLink: string;
    badge?: string;
    overlayOpacity?: number;
}

const HERO_SLIDES: SlideData[] = [
    {
        id: "slide_01",
        mediaType: 'image', // Video would be ideal here if available
        mediaUrl: '/images/hero.png', // Fallback to hero image for now
        heading: 'Ramadan Collection 2026',
        subheading: 'Refined modesty for the holy month.',
        buttonText: 'Shop Collection',
        buttonLink: '/products?collection=ramadan',
        badge: 'New Collection',
        overlayOpacity: 0.3
    },
    {
        id: "slide_02",
        mediaType: 'image',
        mediaUrl: '/images/luxury-abaya.png',
        heading: 'The Art of Abayas',
        subheading: 'Hand-embroidered masterpieces.',
        buttonText: 'Explore Abayas',
        buttonLink: '/products?category=abayas',
        badge: 'Premium Selection',
        overlayOpacity: 0.4
    },
    {
        id: "slide_03",
        mediaType: 'image',
        mediaUrl: '/images/perfume.png',
        heading: 'Signature Scents',
        subheading: 'Fragrances that leave a lasting impression.',
        buttonText: 'Discover Scents',
        buttonLink: '/products?category=fragrances',
        badge: 'New Arrival',
        overlayOpacity: 0.3
    }
];

export default function HeroSlideshow() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const slideDuration = 6000; // 6 seconds
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Auto-advance logic
    useEffect(() => {
        if (isAutoPlaying) {
            intervalRef.current = setInterval(() => {
                setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
            }, slideDuration);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isAutoPlaying, currentSlideIndex]);

    const goToSlide = (index: number) => {
        setCurrentSlideIndex(index);
        setIsAutoPlaying(false); // Pause on manual interaction
        // Restart autoplay after a delay could be added here if desired
    };

    const nextSlide = () => {
        setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
        setIsAutoPlaying(false);
    };

    return (
        <section
            className="relative h-screen overflow-hidden bg-primary-dark"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <AnimatePresence mode="wait">
                {HERO_SLIDES.map((slide, index) => (
                    index === currentSlideIndex && (
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Media Background */}
                            <div className="absolute inset-0">
                                {slide.mediaType === 'video' ? (
                                    <video
                                        src={slide.mediaUrl}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={slide.mediaUrl}
                                        alt={slide.heading}
                                        className="w-full h-full object-cover animate-ken-burns"
                                    />
                                )}
                                <div
                                    className="absolute inset-0 bg-black transition-opacity duration-700"
                                    style={{ opacity: slide.overlayOpacity ?? 0.4 }}
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 w-full h-full flex items-center justify-center text-center px-4">
                                <div className="max-w-4xl space-y-6">
                                    <motion.div
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    >
                                        {slide.badge && (
                                            <span className="inline-block text-primary-gold uppercase tracking-[0.3em] text-xs font-bold mb-4 px-4 py-2 border border-primary-gold/30 bg-black/20 backdrop-blur-sm rounded-full">
                                                {slide.badge}
                                            </span>
                                        )}
                                        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-neutral-cream leading-[1.1] mb-6 drop-shadow-lg">
                                            {slide.heading}
                                        </h1>
                                        {slide.subheading && (
                                            <p className="text-lg md:text-2xl text-neutral-cream/90 font-light max-w-xl mx-auto mb-8 font-accent">
                                                {slide.subheading}
                                            </p>
                                        )}
                                        <Link href={slide.buttonLink}>
                                            <Button variant="primary" className="px-12 py-4 text-base shadow-xl hover:scale-105 transition-transform duration-300">
                                                {slide.buttonText}
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center gap-4">
                {HERO_SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlideIndex
                                ? "bg-primary-gold w-8"
                                : "bg-white/50 hover:bg-white"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Navigation Arrows (Desktop) */}
            <button
                onClick={prevSlide}
                className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/10 backdrop-blur-sm text-white items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all duration-300 z-20"
            >
                ←
            </button>
            <button
                onClick={nextSlide}
                className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 bg-black/10 backdrop-blur-sm text-white items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all duration-300 z-20"
            >
                →
            </button>
        </section>
    );
}
