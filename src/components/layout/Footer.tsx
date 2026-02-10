import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary-dark text-neutral-cream pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="font-accent text-3xl font-semibold tracking-wider">
                            Yasmin <span className="text-primary-gold">Fashions</span>
                        </Link>
                        <p className="text-neutral-sand/80 font-light leading-relaxed max-w-xs">
                            Elevating modest fashion with contemporary design and timeless elegance. Crafted for the modern Muslim woman.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                                <Link key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary-gold hover:border-primary-gold transition-all duration-300">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="font-display text-xl mb-8 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary-gold">
                            Shop
                        </h4>
                        <ul className="space-y-4 text-neutral-sand/80 font-light text-sm">
                            {["New Arrivals", "Best Sellers", "Hijabs", "Abayas", "Accessories", "Fragrances"].map((item) => (
                                <li key={item}>
                                    <Link href={`/products?category=${item.toLowerCase()}`} className="hover:text-primary-gold transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className="font-display text-xl mb-8 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary-gold">
                            Support
                        </h4>
                        <ul className="space-y-4 text-neutral-sand/80 font-light text-sm">
                            {["Contact Us", "Shipping Policy", "Returns & Exchanges", "Size Guide", "Privacy Policy", "Terms of Service"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-primary-gold transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="font-display text-xl mb-8 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-primary-gold">
                            Newsletter
                        </h4>
                        <p className="text-neutral-sand/80 font-light text-sm mb-6">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary-gold transition-colors"
                            />
                            <button className="w-full bg-primary-gold text-white text-sm font-medium py-3 hover:bg-white hover:text-primary-dark transition-all duration-300 uppercase tracking-widest">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-xs font-light tracking-wider">
                    <p>&copy; {new Date().getFullYear()} YASMIN FASHIONS. ALL RIGHTS RESERVED.</p>
                    <p className="text-white/30">POWERED BY TAZON</p>
                    <div className="flex gap-6">
                        <span>SECURE PAYMENT:</span>
                        <span className="text-white/60">STRIPE • PAYPAL • APPLE PAY</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
