"use client";
import React, { useState } from 'react';
import { ChevronDown, Grid, List, X } from 'lucide-react';

interface FilterBarProps {
    count: number;
    onSortChange: (value: string) => void;
    onViewChange: (view: 'grid' | 'list') => void;
    currentView: 'grid' | 'list';
}

export default function FilterBar({ count, onSortChange, onViewChange, currentView }: FilterBarProps) {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const toggleFilter = (filterName: string) => {
        setActiveFilter(activeFilter === filterName ? null : filterName);
    };

    return (
        <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-[#e9ecef] mb-12 transition-all duration-300">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Filter Groups */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {['Category', 'Price', 'Size', 'Color'].map((filter) => (
                            <div key={filter} className="relative">
                                <button
                                    onClick={() => toggleFilter(filter)}
                                    className={`flex items-center gap-2 px-4 py-2 border rounded-none text-xs font-medium uppercase tracking-wider transition-all duration-200 ${activeFilter === filter
                                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]'
                                            : 'bg-transparent text-[#1a1a1a] border-[#e8e3dc] hover:border-[#1a1a1a]'
                                        }`}
                                >
                                    {filter}
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeFilter === filter ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Content (Placeholder) */}
                                {activeFilter === filter && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#e8e3dc] shadow-lg p-4 animate-fade-in z-40">
                                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#f8f6f3]">
                                            <span className="text-[10px] uppercase font-bold text-[#c9a961]">{filter}</span>
                                            <button onClick={() => setActiveFilter(null)}><X size={12} /></button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] cursor-pointer">
                                                <input type="checkbox" className="accent-[#c9a961]" /> Option 1
                                            </label>
                                            <label className="flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] cursor-pointer">
                                                <input type="checkbox" className="accent-[#c9a961]" /> Option 2
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Meta Controls */}
                    <div className="flex items-center justify-between w-full md:w-auto gap-6">
                        <span className="hidden md:inline-block text-xs font-medium text-[#6b6b6b] uppercase tracking-widest">
                            {count} Products
                        </span>

                        <div className="flex items-center gap-4">
                            <select
                                onChange={(e) => onSortChange(e.target.value)}
                                className="bg-transparent text-xs font-medium uppercase tracking-wider border-none focus:ring-0 cursor-pointer text-[#1a1a1a]"
                            >
                                <option value="featured">Sort: Featured</option>
                                <option value="newest">Sort: Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>

                            <div className="flex items-center border border-[#e8e3dc]">
                                <button
                                    onClick={() => onViewChange('grid')}
                                    className={`p-2 transition-colors ${currentView === 'grid' ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#1a1a1a]'}`}
                                >
                                    <Grid size={16} />
                                </button>
                                <button
                                    onClick={() => onViewChange('list')}
                                    className={`p-2 transition-colors ${currentView === 'list' ? 'bg-[#1a1a1a] text-white' : 'text-[#6b6b6b] hover:text-[#1a1a1a]'}`}
                                >
                                    <List size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
