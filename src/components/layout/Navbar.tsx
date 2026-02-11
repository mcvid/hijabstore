"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, LogOut, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import MegaMenu from "@/components/layout/MegaMenu";
import MobileMenu from "@/components/layout/MobileMenu";
import SearchResults from "@/components/layout/SearchResults";
import { adminService } from "@/lib/admin";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const { setIsCartOpen, totalItems } = useCart();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleOpenAuthModal = () => setAuthModalOpen(true);
        window.addEventListener('open-auth-modal', handleOpenAuthModal);
        return () => window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await adminService.getStructuredCategories();

                // Map Supabase fields to the Category type expected by components
                const mappedCategories = data.map((cat: any) => ({
                    ...cat,
                    displaySettings: {
                        showInMainNav: cat.show_in_main_nav ?? true,
                        showInMegaMenu: true,
                        showInMobile: true,
                        featuredImage: cat.display_settings?.featuredImage || cat.image_url
                    },
                    subcategories: (cat.subcategories || []).map((sub: any) => ({
                        ...sub,
                        displaySettings: {
                            showInMainNav: sub.show_in_main_nav ?? true,
                            showInMegaMenu: true,
                            showInMobile: true,
                            featuredImage: sub.display_settings?.featuredImage || sub.image_url
                        }
                    }))
                }));
                setCategories(mappedCategories);
            } catch (error: any) {
                console.error("Failed to fetch categories:", error?.message || error || JSON.stringify(error));
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    const handleAccountClick = () => {
        if (isAuthenticated) {
            window.location.href = "/account";
        } else {
            setAuthModalOpen(true);
        }
    };

    const handleSearch = async (query: string) => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await adminService.searchProducts(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

            {/* Mobile Navigation Menu */}
            <MobileMenu
                categories={categories}
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 border-b border-neutral-sand ${scrolled
                    ? "bg-neutral-cream/95 backdrop-blur-md shadow-sm py-2"
                    : "bg-neutral-cream/95 py-4"
                    } animate-slide-down`}
                onMouseLeave={() => setActiveCategory(null)}
            >
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <Link href="/" className="font-accent text-3xl font-semibold tracking-wider text-primary-dark cursor-pointer z-50">
                        Yasmin <span className="text-primary-gold font-accent">Fashions</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex gap-8 items-center h-full">
                        {/* Core Categories */}
                        <Link
                            href="/new-arrivals"
                            className="text-[11px] uppercase font-medium tracking-[0.15em] text-primary-dark/70 hover:text-primary-gold transition-colors relative group py-4"
                        >
                            New Arrivals
                            <span className="absolute bottom-3 left-0 w-0 h-[1px] bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        {/* Core Categories with Hover/MegaMenu Support */}
                        {['women', 'men', 'fragrance'].map(slug => {
                            const category = categories.find(c => c.slug === slug);
                            if (!category) return (
                                <Link
                                    key={slug}
                                    href={`/products?category=${slug}`}
                                    className="text-[11px] uppercase font-medium tracking-[0.15em] text-primary-dark/70 hover:text-primary-gold transition-colors relative group py-4"
                                >
                                    {slug.charAt(0).toUpperCase() + slug.slice(1)}
                                    <span className="absolute bottom-3 left-0 w-0 h-[1px] bg-primary-gold transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            );

                            return (
                                <div key={category.id}>
                                    <Link
                                        href={`/products?category=${category.slug}`}
                                        className={`text-[11px] uppercase font-medium tracking-[0.15em] transition-colors relative group py-4 block ${activeCategory === category.id ? "text-primary-gold" : "text-primary-dark/70 hover:text-primary-gold"
                                            }`}
                                        onMouseEnter={() => setActiveCategory(category.id)}
                                    >
                                        {category.name}
                                        <span className={`absolute bottom-3 left-0 h-[1px] bg-primary-gold transition-all duration-300 ${activeCategory === category.id ? "w-full" : "w-0 group-hover:w-full"
                                            }`}></span>
                                    </Link>

                                    <MegaMenu
                                        category={category}
                                        isOpen={activeCategory === category.id}
                                    />
                                </div>
                            );
                        })}

                        {/* Additional Dynamic Categories (excluding the cores) */}
                        {categories.filter(c => c.show_in_main_nav && !['women', 'men', 'fragrance'].includes(c.slug)).map((category) => (
                            <div key={category.id}>
                                <Link
                                    href={`/products?category=${category.slug}`}
                                    className={`text-[11px] uppercase font-medium tracking-[0.15em] transition-colors relative group py-4 block ${activeCategory === category.id ? "text-primary-gold" : "text-primary-dark/70 hover:text-primary-gold"
                                        }`}
                                    onMouseEnter={() => setActiveCategory(category.id)}
                                >
                                    {category.name}
                                    <span className={`absolute bottom-3 left-0 h-[1px] bg-primary-gold transition-all duration-300 ${activeCategory === category.id ? "w-full" : "w-0 group-hover:w-full"
                                        }`}></span>
                                </Link>

                                <MegaMenu
                                    category={category}
                                    isOpen={activeCategory === category.id}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="lg:hidden z-[60] relative w-8 h-8 flex flex-col justify-center gap-1.5 group"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span className={`block w-full h-[2px] transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2 bg-neutral-cream" : "bg-primary-dark"}`}></span>
                        <span className={`block w-full h-[2px] transition-all duration-300 ${mobileMenuOpen ? "opacity-0 bg-neutral-cream" : "bg-primary-dark"}`}></span>
                        <span className={`block w-full h-[2px] transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2 bg-neutral-cream" : "bg-primary-dark"}`}></span>
                    </button>

                    {/* Icons */}
                    <div className="flex items-center gap-4 md:gap-6 text-primary-dark z-50">
                        {/* Mobile Account Button */}
                        <button onClick={handleAccountClick} className="lg:hidden hover:text-primary-gold transition-colors relative group">
                            {isAuthenticated && user ? (
                                <div className="w-6 h-6 rounded-full bg-primary-gold flex items-center justify-center text-[10px] text-white font-bold border-2 border-transparent group-hover:border-primary-dark transition-all">
                                    {user.firstName?.[0] || user.email?.[0] || 'U'}
                                </div>
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </button>
                        {/* Search Bar */}
                        <div className="relative hidden md:flex items-center">
                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 300, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute right-0 flex items-center bg-white border border-neutral-sand/50 shadow-sm"
                                    >
                                        <input
                                            autoFocus
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                handleSearch(e.target.value);
                                            }}
                                            placeholder="Silk, Abaya, Oud..."
                                            className="w-full bg-transparent px-4 py-2 text-xs font-medium focus:outline-none placeholder:text-neutral-gray/50"
                                        />
                                        <button
                                            onClick={() => {
                                                setIsSearchOpen(false);
                                                setSearchQuery("");
                                                setSearchResults([]);
                                            }}
                                            className="px-3 text-neutral-gray hover:text-primary-dark transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {!isSearchOpen && (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="hover:text-primary-gold transition-colors"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            )}

                            <SearchResults
                                isVisible={isSearchOpen && searchQuery.length >= 2}
                                results={searchResults}
                                isLoading={isSearching}
                                onClose={() => {
                                    setIsSearchOpen(false);
                                    setSearchQuery("");
                                }}
                            />
                        </div>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="hover:text-primary-gold transition-colors relative"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <button onClick={handleAccountClick} className="hidden lg:block hover:text-primary-gold transition-colors relative group">
                            {isAuthenticated && user ? (
                                <div className="w-6 h-6 rounded-full bg-primary-gold flex items-center justify-center text-[10px] text-white font-bold border-2 border-transparent group-hover:border-primary-dark transition-all">
                                    {user.firstName[0]}
                                </div>
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}
