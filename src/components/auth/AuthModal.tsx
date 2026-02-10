"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Mail, Lock, User, Github } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import HCaptcha from '@hcaptcha/react-hcaptcha';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: "login" | "signup";
}

export default function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const { login, signup, signInWithOAuth, isLoading } = useAuth();

    // Form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const captchaRef = useRef<HCaptcha>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!captchaToken) {
            setError("Please verify you are human.");
            return;
        }

        try {
            if (mode === "login") {
                await login(email, password, captchaToken);
            } else {
                const nameParts = name.trim().split(" ");
                const firstName = nameParts[0] || "User";
                const lastName = nameParts.slice(1).join(" ") || "";
                await signup(email, password, firstName, lastName, captchaToken);
            }
            onClose();
        } catch (err: any) {
            console.error("Authentication failed", err);
            if (err.message?.includes("rate limit")) {
                setError("Email rate limit exceeded. Please try again in 5 minutes or use a social login below.");
            } else {
                setError(err.message || "Authentication failed. Please check your details.");
            }
        } finally {
            setCaptchaToken(null);
            captchaRef.current?.resetCaptcha();
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        setError(null);
        try {
            await signInWithOAuth(provider);
        } catch (err: any) {
            setError(err.message || `Failed to sign in with ${provider}`);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-[80] pointer-events-none p-4"
                    >
                        <div className="bg-white pointer-events-auto w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] max-h-[90vh]">

                            {/* Visual Side (Left/Right based on mode? keeping simple for now) */}
                            <div className="hidden md:block w-1/2 relative overflow-hidden bg-[#0f1419]">
                                <div className="absolute inset-0 opacity-60">
                                    <img
                                        src="/images/hero-fashion-muslimah.jpg"
                                        alt="Luxury Modesty"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute bottom-12 left-12 right-12 text-white">
                                    <h2 className="font-display text-4xl leading-tight mb-4">
                                        Elevate Your <br />
                                        <span className="text-[#d4af37]">Daily Elegance</span>
                                    </h2>
                                    <p className="text-white/80 font-light leading-relaxed">
                                        Join our exclusive community for early access to new collections, personalized recommendations, and member-only rewards.
                                    </p>
                                </div>
                            </div>

                            {/* Form Side */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 relative flex flex-col justify-center bg-white overflow-y-auto">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-[#0f1419] transition-colors rounded-full hover:bg-neutral-100"
                                >
                                    <X size={24} />
                                </button>

                                <div className="mb-8">
                                    <h3 className="font-display text-3xl text-[#0f1419] mb-2">
                                        {mode === "login" ? "Welcome Back" : "Create Account"}
                                    </h3>
                                    <p className="text-[#6c757d]">
                                        {mode === "login"
                                            ? "Enter your details to access your account."
                                            : "Begin your journey with Yasmin Fashions."}
                                    </p>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {mode === "signup" && (
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase font-bold tracking-wider text-[#0f1419]/60">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Sarah Admin"
                                                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <label className="text-xs uppercase font-bold tracking-wider text-[#0f1419]/60">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="sarah@example.com"
                                                className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs uppercase font-bold tracking-wider text-[#0f1419]/60">Password</label>
                                            {mode === "login" && (
                                                <button type="button" className="text-xs text-[#d4af37] hover:underline">Forgot?</button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg focus:outline-none focus:border-[#d4af37] focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* hCaptcha Widget */}
                                    <div className="flex justify-center py-2">
                                        <HCaptcha
                                            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                                            onVerify={(token) => setCaptchaToken(token)}
                                            onExpire={() => setCaptchaToken(null)}
                                            ref={captchaRef}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 bg-[#0f1419] text-white rounded-lg font-medium text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                {mode === "login" ? "Sign In" : "Create Account"} <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 flex flex-col gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100"></div></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-white text-neutral-400 tracking-widest">Or continue with</span></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handleSocialLogin('google')}
                                            className="flex items-center justify-center gap-2 py-2.5 border border-[#e9ecef] rounded-lg hover:bg-neutral-50 transition-all text-sm font-medium text-[#0f1419]"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            Google
                                        </button>
                                        <button
                                            onClick={() => handleSocialLogin('apple')}
                                            className="flex items-center justify-center gap-2 py-2.5 border border-[#e9ecef] rounded-lg hover:bg-neutral-50 transition-all text-sm font-medium text-[#0f1419]"
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                            </svg>
                                            Apple
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#e9ecef] text-center">
                                    <p className="text-sm text-[#6c757d]">
                                        {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                                        <button
                                            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                                            className="ml-2 font-bold text-[#0f1419] hover:text-[#d4af37] transition-colors"
                                        >
                                            {mode === "login" ? "Sign up" : "Log in"}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
