"use client";
import React from "react";
import { motion } from "framer-motion";

export default function GeometricPattern() {
    return (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="islamic-grid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <motion.path
                            d="M50 0 L100 50 L50 100 L0 50 Z M0 0 L50 50 L0 100 M100 0 L50 50 L100 100"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#islamic-grid)" />
            </svg>
        </div>
    );
}
