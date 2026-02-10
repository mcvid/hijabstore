"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown, Send } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";

const faqs = [
    {
        question: "How do I track my luxury selection?",
        answer: "Once your order has been hand-inspected and dispatched, you will receive a confirmation email containing your tracking reference. You can also view the status of your selections in your Yasmin Fashions account dashboard."
    },
    {
        question: "What is your bespoke return policy?",
        answer: "We offer complimentary returns within 30 days of receipt. Items must be in their original, unworn condition with all tags and protective packaging intact. To initiate a return, please contact our concierge team."
    },
    {
        question: "Do you offer global shipping?",
        answer: "Yes, Yasmin Fashions provides complimentary express global shipping on all orders over AED 500. For orders under this amount, a standard premium shipping fee applies."
    },
    {
        question: "How can I ensure the perfect fit?",
        answer: "Each product page includes a detailed Size & Fit guide with specific measurements. Should you require further assistance, our styling concierge is available to provide personalized advice."
    }
];

export default function ContactPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body">
            <Navbar />

            <main className="container mx-auto px-4 py-24 md:py-32">
                <div className="text-center space-y-4 mb-24">
                    <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold">Concierge Service</span>
                    <h1 className="font-display text-5xl md:text-7xl">How May We Assist You?</h1>
                    <p className="text-neutral-gray text-lg font-light max-w-2xl mx-auto">
                        Whether you seek styling advice, have a query regarding your selection, or wish to visit a boutique, our team is at your service.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-10 md:p-16 border border-neutral-sand/30 shadow-sm space-y-12"
                    >
                        <h2 className="font-display text-4xl">Send a Message</h2>
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input label="Full Name" placeholder="ENTER YOUR NAME" />
                                <Input label="Email Address" placeholder="ENTER YOUR EMAIL" />
                            </div>
                            <Input label="Subject" placeholder="HOW CAN WE HELP?" />
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray ml-1">Your Inquiry</label>
                                <textarea
                                    rows={5}
                                    placeholder="TYPE YOUR MESSAGE HERE..."
                                    className="w-full bg-neutral-cream/20 border-b border-neutral-sand focus:border-primary-gold p-4 text-sm font-light transition-all outline-none resize-none"
                                />
                            </div>
                            <Button variant="primary" className="w-full py-6 group flex items-center justify-center gap-4">
                                <span className="uppercase tracking-[0.3em] text-[11px]">Dispatch Message</span>
                                <Send className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                            </Button>
                        </form>
                    </motion.div>

                    {/* FAQ & Info */}
                    <div className="space-y-24">
                        {/* FAQ Section */}
                        <div className="space-y-10">
                            <h2 className="font-display text-4xl">Common Inquiries</h2>
                            <div className="divide-y divide-neutral-sand/40">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="py-6">
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                                            className="w-full flex justify-between items-center text-left group"
                                        >
                                            <span className="text-sm font-bold uppercase tracking-widest group-hover:text-primary-gold transition-colors">
                                                {faq.question}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="pt-4 text-sm text-neutral-gray font-light leading-relaxed">
                                                        {faq.answer}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary-gold">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Flagship Boutique</span>
                                </div>
                                <div className="text-sm text-neutral-gray font-light leading-relaxed">
                                    <p className="font-bold text-primary-dark">Dubai Mall, Fashion Avenue</p>
                                    <p>Level 2, Unit 45-B</p>
                                    <p>Dubai, UAE</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary-gold">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Electronic Mail</span>
                                </div>
                                <div className="text-sm text-neutral-gray font-light leading-relaxed">
                                    <p>concierge@yasminfashions.com</p>
                                    <p>support@yasminfashions.com</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-primary-gold">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold">Telephony</span>
                                </div>
                                <div className="text-sm text-neutral-gray font-light leading-relaxed">
                                    <p>+971 4 000 0000</p>
                                    <p>Available 9AM - 9PM GST</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray ml-1">{label}</label>
            <input
                {...props}
                className="w-full bg-neutral-cream/20 border-b border-neutral-sand focus:border-primary-gold p-4 text-sm font-light transition-all outline-none"
            />
        </div>
    );
}
