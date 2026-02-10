"use client";
import React from 'react';

interface PageHeroProps {
    title: string;
    subtitle: string;
    badge?: string;
    theme?: 'light' | 'dark'; // 'light' is default (for women's/collections), 'dark' for men's
}

export default function PageHero({ title, subtitle, badge, theme = 'light' }: PageHeroProps) {
    const isDark = theme === 'dark';

    return (
        <section
            className={`relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden mb-12 md:mb-24 ${isDark
                ? 'bg-gradient-to-br from-[#2d5f4f] to-[#1a1a1a]'
                : 'bg-gradient-to-br from-[#e8e3dc] to-[#f8f6f3]'}`}
        >
            {/* Background Pattern */}
            <div className={`absolute inset-0 pointer-events-none animate-float-shape opacity-10 ${isDark ? 'mix-blend-overlay' : ''}`}
                style={{
                    backgroundImage: `url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="1" fill="%23c9a961" opacity="1"/></svg>')`
                }}
            />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
                {badge && (
                    <span className="inline-block px-4 py-2 mb-6 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] bg-[#c9a961] text-white rounded-sm shadow-sm">
                        {badge}
                    </span>
                )}

                <h1 className={`font-display text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-[1.1] ${isDark ? 'text-[#f8f6f3]' : 'text-[#1a1a1a]'}`}>
                    {title}
                </h1>

                <p className={`text-base md:text-lg lg:text-xl font-light max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-[#e8e3dc]' : 'text-[#6b6b6b]'}`}>
                    {subtitle}
                </p>
            </div>

            {/* Decorative decorative squiggle or line if needed? Let's keep it clean as per "Generous White Space" principle */}
        </section>
    );
}
