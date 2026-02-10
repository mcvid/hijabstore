"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface HorizontalGalleryProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
}

export default function HorizontalGallery({ children, title, subtitle }: HorizontalGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let animationFrameId: number;

        const scroll = () => {
            if (!isHovered) {
                container.scrollLeft += 1; // Slow scroll speed
                // Reset scroll if we've reached the end to loop (or just let it flow if infinite content isn't set up yet)
                // For a true infinite loop we'd need to duplicate children, but "slowly one by one" implies just linear scroll
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
                    container.scrollLeft = 0;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered]);

    return (
        <section className="relative py-20 bg-neutral-cream overflow-hidden">
            {/* Section Title - Sticky/Absolute on Desktop */}
            <div className="container mx-auto px-4 mb-12 flex items-center justify-between">
                <div>
                    {subtitle && <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">{subtitle}</span>}
                    {title && <h2 className="font-display text-4xl lg:text-5xl text-primary-dark">{title}</h2>}
                </div>
                {/* Manual Scroll Hint */}
                <div className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-gray">
                    Drag to explore <span className="text-primary-gold">→</span>
                </div>
            </div>

            {/* Main Content - Auto Scroll Container */}
            <div
                ref={containerRef}
                className="flex overflow-x-auto gap-8 pb-12 px-4 lg:px-[10vw] no-scrollbar cursor-grab active:cursor-grabbing"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ scrollBehavior: 'auto' }} // Ensure smooth manual scroll doesn't fight js
            >
                {/* We render children directly. To make it feel infinite/fuller, page.tsx should pass enough items */}
                {children}
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
