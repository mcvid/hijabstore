"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface TabItem {
    id: string;
    title: string;
    content: React.ReactNode;
}

export default function ProductTabs() {
    const [activeTab, setActiveTab] = useState<string | null>("details");

    const tabs: TabItem[] = [
        {
            id: "details",
            title: "Details",
            content: (
                <div className="space-y-4 text-neutral-gray leading-relaxed font-light">
                    <p>
                        Crafted from luxurious fabric, this piece embodies timeless elegance and contemporary sophistication.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Premium 100% Mulberry Silk</li>
                        <li>Hand-finished edges for a refined look</li>
                        <li>Breathable and lightweight for all-day comfort</li>
                        <li>Ethically sourced and responsibly produced</li>
                    </ul>
                </div>
            )
        },
        {
            id: "size",
            title: "Size & Fit",
            content: (
                <div className="space-y-4">
                    <p className="text-neutral-gray font-light">Model is 175cm tall and is wearing a size Medium.</p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-neutral-sand/20">
                                    <th className="p-3 border border-neutral-sand/50 font-bold uppercase tracking-widest text-[10px]">Size</th>
                                    <th className="p-3 border border-neutral-sand/50 font-bold uppercase tracking-widest text-[10px]">Bust (cm)</th>
                                    <th className="p-3 border border-neutral-sand/50 font-bold uppercase tracking-widest text-[10px]">Length (cm)</th>
                                </tr>
                            </thead>
                            <tbody className="text-neutral-gray">
                                <tr>
                                    <td className="p-3 border border-neutral-sand/50">Small</td>
                                    <td className="p-3 border border-neutral-sand/50">88-92</td>
                                    <td className="p-3 border border-neutral-sand/50">140</td>
                                </tr>
                                <tr className="bg-neutral-sand/5">
                                    <td className="p-3 border border-neutral-sand/50">Medium</td>
                                    <td className="p-3 border border-neutral-sand/50">94-98</td>
                                    <td className="p-3 border border-neutral-sand/50">144</td>
                                </tr>
                                <tr>
                                    <td className="p-3 border border-neutral-sand/50">Large</td>
                                    <td className="p-3 border border-neutral-sand/50">100-104</td>
                                    <td className="p-3 border border-neutral-sand/50">148</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        },
        {
            id: "shipping",
            title: "Shipping & Returns",
            content: (
                <div className="space-y-4 text-neutral-gray font-light">
                    <div>
                        <h4 className="font-bold text-primary-dark uppercase tracking-widest text-[10px] mb-2">Global Shipping</h4>
                        <p>Complimentary standard shipping on all orders over AED 500. Express courier delivery available at checkout.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-primary-dark uppercase tracking-widest text-[10px] mb-2">Luxury Returns</h4>
                        <p>We accept returns within 30 days of receipt. Items must be in their original condition with all tags attached.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="border-t border-neutral-sand mt-12">
            {tabs.map((tab) => (
                <div key={tab.id} className="border-bottom border-neutral-sand">
                    <button
                        onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                        className="w-full py-6 flex justify-between items-center group transition-colors hover:text-primary-gold"
                    >
                        <span className="font-bold uppercase tracking-[0.3em] text-[11px]">
                            {tab.title}
                        </span>
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-500 ${activeTab === tab.id ? "rotate-180" : "rotate-0"
                                }`}
                        />
                    </button>
                    <AnimatePresence initial={false}>
                        {activeTab === tab.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                className="overflow-hidden"
                            >
                                <div className="pb-8 text-sm pt-2">
                                    {tab.content}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
