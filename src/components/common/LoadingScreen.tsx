"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[10000] bg-primary-dark flex flex-col items-center justify-center overflow-hidden"
                >
                    <div className="relative flex flex-col items-center">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "200px" }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-[1px] bg-primary-gold mb-8"
                        />

                        <div className="overflow-hidden">
                            <motion.h2
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                className="font-display text-white text-4xl md:text-5xl tracking-[0.3em] uppercase"
                            >
                                Yasmin
                            </motion.h2>
                        </div>

                        <div className="overflow-hidden mt-2">
                            <motion.p
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                                className="font-accent text-primary-gold italic text-xl md:text-2xl"
                            >
                                Fashions
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
                            className="absolute -bottom-12 w-full h-[1px] bg-white/10 origin-left"
                        />
                    </div>

                    <div className="absolute bottom-10 flex gap-10 items-center justify-center w-full px-10">
                        <span className="text-white/20 text-[10px] uppercase font-bold tracking-[0.4em]">Establish 2026</span>
                        <div className="flex-1 h-[1px] bg-white/5" />
                        <span className="text-white/20 text-[10px] uppercase font-bold tracking-[0.4em]">Signature Modesty</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
