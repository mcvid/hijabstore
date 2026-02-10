"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle, Package, Calendar, Mail, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { motion } from "framer-motion";

export default function OrderConfirmationPage() {
    const orderNumber = "YF-" + Math.floor(100000 + Math.random() * 900000);

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body">
            <Navbar />

            <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl w-full text-center space-y-12"
                >
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
                                className="z-10"
                            >
                                <CheckCircle className="w-12 h-12" />
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 rounded-full border border-primary-gold/30"
                                animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                        <div className="space-y-4">
                            <h1 className="font-display text-5xl md:text-7xl">Order Confirmed</h1>
                            <p className="text-neutral-gray text-lg font-light">Thank you for choosing Yasmin Fashions. Your selection is being prepared.</p>
                        </div>
                    </div>

                    <div className="bg-white p-10 border border-neutral-sand/30 shadow-sm space-y-10">
                        <div className="flex flex-col md:flex-row justify-between gap-8 pb-8 border-b border-neutral-sand/20">
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold">Order Reference</span>
                                <p className="font-display text-3xl text-primary-gold">{orderNumber}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold">Estimated Arrival</span>
                                <p className="font-bold">3 - 5 Business Days</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary-gold">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Confirmation</span>
                                </div>
                                <p className="text-xs text-neutral-gray font-light leading-relaxed">A detailed summary has been sent to your registered email address.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary-gold">
                                    <Package className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Fulfillment</span>
                                </div>
                                <p className="text-xs text-neutral-gray font-light leading-relaxed">Our concierge team is carefully hand-inspecting each piece in your order.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary-gold">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Tracking</span>
                                </div>
                                <p className="text-xs text-neutral-gray font-light leading-relaxed">You will receive a notification as soon as your selection has been dispatched.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <Link href="/products">
                            <Button variant="primary" className="px-12 py-5 uppercase tracking-[0.3em] text-[11px] group flex items-center gap-3">
                                Return to Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/account/orders">
                            <button className="px-12 py-5 border border-primary-dark text-primary-dark uppercase tracking-widest text-[10px] font-bold hover:bg-primary-dark hover:text-white transition-all duration-500">
                                View Your Orders
                            </button>
                        </Link>
                    </div>

                    <p className="text-[10px] text-neutral-gray/60 italic font-light">
                        Should you require any assistance, our concierge is available at support@yasminfashions.com
                    </p>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
