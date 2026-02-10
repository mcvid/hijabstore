"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, ShieldCheck, Truck, CheckCircle2, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Link from "next/link";

const trackerSteps = [
    { id: "ordered", title: "Selection Received", icon: Package, date: "Feb 12, 10:30 AM" },
    { id: "processing", title: "Concierge Fulfillment", icon: Clock, date: "Feb 12, 02:45 PM" },
    { id: "inspection", title: "Quality Authentication", icon: ShieldCheck, date: "Feb 13, 11:20 AM" },
    { id: "transit", title: "In Transit", icon: Truck, date: "Estimate: Feb 15" },
    { id: "delivered", title: "Delivered", icon: CheckCircle2, date: "Estimate: Feb 17" },
];

export default function OrderTrackingPage() {
    const [orderRef, setOrderRef] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [orderFound, setOrderFound] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSearching(true);
        // Simulate API search
        setTimeout(() => {
            setIsSearching(false);
            setOrderFound(true);
        }, 1200);
    };

    const currentStepIndex = 2; // Mocking current progress at 'Quality Authentication'

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body">
            <Navbar />

            <main className="container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-4xl mx-auto space-y-24">
                    <div className="text-center space-y-6">
                        <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold">Yasmin Fashions / Trace</span>
                        <h1 className="font-display text-5xl md:text-7xl">Track Your Selection</h1>
                        <p className="text-neutral-gray text-lg font-light max-w-xl mx-auto">Enter your order reference to view the meticulous progress of your masterpieces.</p>
                    </div>

                    {/* Search Interface */}
                    <motion.form
                        onSubmit={handleSearch}
                        className="bg-white p-10 md:p-16 border border-neutral-sand/30 shadow-sm flex flex-col md:flex-row gap-6 items-end"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex-1 space-y-4 w-full">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray ml-1">Order Reference</label>
                            <input
                                type="text"
                                value={orderRef}
                                onChange={(e) => setOrderRef(e.target.value)}
                                placeholder="E.G. YF-123456"
                                className="w-full bg-neutral-cream/20 border-b border-neutral-sand focus:border-primary-gold p-4 text-sm font-bold tracking-[0.1em] transition-all outline-none uppercase"
                                required
                            />
                        </div>
                        <Button
                            variant="primary"
                            className="w-full md:w-auto px-12 py-5 uppercase tracking-[0.3em] text-[11px] group flex items-center justify-center gap-3"
                            disabled={isSearching}
                        >
                            {isSearching ? 'Searching...' : 'Search'} <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </Button>
                    </motion.form>

                    {/* Results / Progress Timeline */}
                    <AnimatePresence>
                        {orderFound && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-16"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-neutral-sand/20 pb-8">
                                    <div className="space-y-2">
                                        <p className="font-display text-3xl">Ref: {orderRef || 'YF-123456'}</p>
                                        <p className="text-xs text-neutral-gray font-light">Status: <span className="font-bold text-primary-gold uppercase tracking-widest ml-1">Quality Inspection</span></p>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold">Estimated Dispatch: tomorrow, Feb 15</p>
                                </div>

                                <div className="relative pt-12">
                                    {/* Timeline Line */}
                                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-neutral-sand/40 md:-translate-x-1/2" />

                                    <div className="space-y-24">
                                        {trackerSteps.map((s, idx) => {
                                            const isActive = idx === currentStepIndex;
                                            const isCompleted = idx < currentStepIndex;

                                            return (
                                                <motion.div
                                                    key={s.id}
                                                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    className={`relative flex flex-col md:flex-row gap-8 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                                >
                                                    {/* Step Icon */}
                                                    <div className={`absolute left-[7px] md:left-1/2 -top-1 md:top-1/2 w-[26px] h-[26px] rounded-full border-2 z-10 bg-white md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center transition-all duration-700 ${isActive ? 'border-primary-gold shadow-[0_0_15px_rgba(201,169,97,0.4)] scale-125' :
                                                        isCompleted ? 'border-primary-gold bg-primary-gold text-white' : 'border-neutral-sand text-neutral-gray/40'
                                                        }`}>
                                                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className={`w-3 h-3 ${isActive ? 'text-primary-gold' : ''}`} />}
                                                    </div>

                                                    {/* Content */}
                                                    <div className={`flex-1 w-full pl-12 md:pl-0 ${idx % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                                                        <div className={`space-y-2 ${isActive ? 'scale-105' : ''} transition-transform`}>
                                                            <h3 className={`font-display text-2xl ${isActive ? 'text-primary-dark' : isCompleted ? 'text-primary-dark/80' : 'text-neutral-gray/40'}`}>
                                                                {s.title}
                                                            </h3>
                                                            <p className="text-[10px] uppercase tracking-widest text-primary-gold font-bold">{s.date}</p>
                                                            {isActive && (
                                                                <p className="text-xs text-neutral-gray font-light max-w-xs md:ml-auto md:mr-0 inline-block">
                                                                    Our quality experts are currently examining every thread to ensure your selection meets our excellence standards.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Spacing for opposite side */}
                                                    <div className="flex-1 hidden md:block"></div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="text-center pt-8">
                                    <p className="text-sm text-neutral-gray/60 font-light italic">
                                        For bespoke inquiries regarding your shipment, please contact our <Link href="/contact" className="text-primary-gold hover:underline font-bold underline-offset-4 decoration-primary-gold/30">concierge</Link>.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
