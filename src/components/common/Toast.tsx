"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
    const icons = {
        success: <CheckCircle className="w-4 h-4 text-accent-emerald" />,
        error: <XCircle className="w-4 h-4 text-accent-terracotta" />,
        info: <Info className="w-4 h-4 text-primary-gold" />
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-center gap-4 bg-white border border-neutral-sand/30 shadow-2xl p-6 min-w-[320px] max-w-md group"
            layout
        >
            <div className={`p-2 rounded-full ${type === 'success' ? 'bg-accent-emerald/10' :
                    type === 'error' ? 'bg-accent-terracotta/10' : 'bg-primary-gold/10'
                }`}>
                {icons[type]}
            </div>

            <div className="flex-1">
                <p className="text-[11px] uppercase tracking-widest font-bold text-primary-dark">
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                className="text-neutral-gray/40 hover:text-primary-dark transition-colors"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Premium Progress Bar */}
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="absolute bottom-0 left-0 h-[2px] bg-primary-gold/30"
            />
        </motion.div>
    );
}
