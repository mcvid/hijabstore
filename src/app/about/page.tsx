"use client";
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2
        }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
} as const;

export default function AboutPage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <div className="min-h-screen bg-neutral-cream font-body text-primary-dark overflow-x-hidden">
            <Navbar />

            <motion.main
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Hero / Story Section */}
                <section className="min-h-screen flex items-center py-24 px-4 overflow-hidden">
                    <div className="container mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
                            <motion.div
                                variants={itemVariants}
                                style={{ y: y1 }}
                                className="aspect-[3/4] bg-neutral-sand relative overflow-hidden group shadow-2xl"
                            >
                                <motion.img
                                    style={{ scale }}
                                    src="/images/about-hero.png"
                                    alt="Our Beginning"
                                    className="w-full h-full object-cover transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-primary-dark/5 group-hover:bg-transparent transition-colors duration-700"></div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-8 max-w-xl">
                                <div className="space-y-4">
                                    <span className="text-primary-gold uppercase tracking-[0.3em] text-[10px] font-bold">
                                        Our Story
                                    </span>
                                    <h1 className="font-display text-5xl md:text-7xl text-primary-dark leading-[1.1]">
                                        Celebrating Modesty, Embracing Elegance
                                    </h1>
                                </div>
                                <p className="text-neutral-gray text-lg font-light leading-relaxed">
                                    Yasmin Fashions was born from a simple belief: that modest fashion should never compromise on style, quality, or elegance. Founded in 2020, we set out to create a space where Muslim women and men could find clothing that honors their values while celebrating contemporary design.
                                </p>
                                <p className="text-neutral-gray text-lg font-light leading-relaxed">
                                    Every piece in our collection is thoughtfully curated, blending traditional craftsmanship with modern aesthetics. From the souks of Dubai to the ateliers of Istanbul, we work with artisans who share our commitment to excellence.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Founder Section */}
                <section className="bg-white py-32 px-4 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                    <div className="container mx-auto max-w-4xl">
                        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                            <div className="w-48 h-48 rounded-full bg-neutral-sand overflow-hidden shadow-xl border-4 border-neutral-cream flex-shrink-0">
                                <img src="/images/founder.png" alt="Sarah Al-Hassan" className="w-full h-full object-cover" />
                            </div>
                            <div className="space-y-6">
                                <p className="font-accent italic text-3xl text-primary-dark leading-relaxed">
                                    <span className="text-primary-gold text-6xl font-serif leading-[0] mr-2">“</span>
                                    Modesty is not about hiding—it's about revealing the beauty of character, the elegance of purpose, and the strength of faith.
                                </p>
                                <div>
                                    <h4 className="font-bold text-xl uppercase tracking-widest text-primary-dark">Sarah Al-Hassan</h4>
                                    <p className="text-primary-gold text-xs uppercase tracking-[0.2em] mt-1">Founder & Creative Director</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Timeline / Journey */}
                <section className="py-32 px-4">
                    <div className="container mx-auto max-w-2xl text-center space-y-24">
                        <motion.h2 variants={itemVariants} className="font-display text-5xl text-primary-dark">
                            Our Journey
                        </motion.h2>

                        <div className="relative space-y-32 before:absolute before:left-[-20px] md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-neutral-sand/50">
                            {[
                                { year: "2020", title: "The Beginning", text: "Started with 12 abayas, a vision, and unwavering faith. Our first customer became our biggest advocate." },
                                { year: "2022", title: "Expansion", text: "Opened our first physical boutique in Dubai. Added men's collection and fragrances to our offerings." },
                                { year: "2024", title: "Global Reach", text: "Now serving customers across 45 countries. Partnered with local artisans in 8 countries." },
                                { year: "2026", title: "The Future", text: "Launching sustainable modest fashion initiative. Opening design studio in Istanbul." }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className={`relative flex flex-col md:flex-row gap-8 items-center ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                >
                                    <div className="flex-1 text-center md:text-right w-full">
                                        {i % 2 === 0 ? (
                                            <div className="text-left md:text-right">
                                                <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                                                <p className="text-neutral-gray font-light text-sm">{item.text}</p>
                                            </div>
                                        ) : (
                                            <span className="font-display text-7xl text-neutral-sand/40 leading-none select-none">{item.year}</span>
                                        )}
                                    </div>

                                    <div className="w-4 h-4 rounded-full bg-primary-gold shadow-[0_0_15px_rgba(201,169,97,0.5)] z-10 flex-shrink-0"></div>

                                    <div className="flex-1 text-center md:text-left w-full">
                                        {i % 2 === 0 ? (
                                            <span className="font-display text-7xl text-neutral-sand/40 leading-none select-none">{item.year}</span>
                                        ) : (
                                            <div className="text-left">
                                                <h3 className="font-display text-2xl mb-2">{item.title}</h3>
                                                <p className="text-neutral-gray font-light text-sm">{item.text}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-32 px-4 bg-neutral-sand/10">
                    <div className="container mx-auto">
                        <motion.h2 variants={itemVariants} className="text-center font-display text-4xl mb-20 text-primary-dark">
                            What We Stand For
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { icon: "🌙", title: "Faith-Centered", text: "Every design honors Islamic principles while embracing contemporary aesthetics." },
                                { icon: "✨", title: "Quality First", text: "Premium fabrics, meticulous craftsmanship, and attention to every detail." },
                                { icon: "🌍", title: "Ethical & Sustainable", text: "Fair wages for artisans, eco-conscious materials, responsible production." }
                            ].map((value, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="bg-white p-12 text-center space-y-6 shadow-sm hover:shadow-xl transition-shadow duration-500 rounded-px"
                                >
                                    <div className="text-5xl">{value.icon}</div>
                                    <h3 className="font-display text-2xl text-primary-dark">{value.title}</h3>
                                    <p className="text-neutral-gray font-light leading-relaxed text-sm">{value.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </motion.main>

            <Footer />
        </div>
    );
}
