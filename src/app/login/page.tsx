"use client";
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Link from "next/link";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useState } from "react";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const { login, signInWithOAuth } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!captchaToken) {
            setError("Please verify you are human.");
            return;
        }
        setIsLoading(true);
        try {
            await login(formData.email, formData.password, captchaToken);
            window.location.href = "/account";
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setIsLoading(false);
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
        <div className="min-h-screen bg-neutral-cream font-body pt-24 text-primary-dark">
            <Navbar />

            <main className="container mx-auto px-4 py-20 flex justify-center">
                <div className="w-full max-w-md bg-white border border-neutral-sand shadow-2xl p-10 md:p-14 space-y-12 animate-fade-in">
                    <div className="text-center space-y-4">
                        <span className="text-primary-gold uppercase tracking-[0.4em] text-[10px] font-bold">Welcome Back</span>
                        <h1 className="font-display text-4xl md:text-5xl text-primary-dark tracking-tight">Login</h1>
                        <p className="text-neutral-gray text-sm font-light">Please enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-gray group-focus-within:text-primary-gold transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray/50 group-focus-within:text-primary-gold transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-transparent border-b border-neutral-sand py-3 pl-8 text-sm focus:outline-none focus:border-primary-gold transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-gray group-focus-within:text-primary-gold transition-colors">Password</label>
                                    <Link href="/forgot-password" className="text-[10px] font-bold text-primary-gold hover:underline uppercase tracking-widest">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-gray/50 group-focus-within:text-primary-gold transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-transparent border-b border-neutral-sand py-3 pl-8 text-sm focus:outline-none focus:border-primary-gold transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <HCaptcha
                                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                                onVerify={(token) => setCaptchaToken(token)}
                                onExpire={() => setCaptchaToken(null)}
                            />
                        </div>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 text-sm tracking-[0.3em] flex items-center justify-center gap-3"
                        >
                            {isLoading ? "Signing In..." : <>Sign In <LogIn className="w-4 h-4" /></>}
                        </Button>
                    </form>

                    <div className="text-center space-y-6">
                        <p className="text-xs text-neutral-gray font-light">
                            Don&apos;t have an account?
                            <Link href="/register" className="text-primary-gold font-bold ml-2 hover:underline uppercase tracking-widest">Sign Up</Link>
                        </p>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-neutral-sand"></div>
                            <span className="flex-shrink mx-4 text-[10px] uppercase tracking-widest text-neutral-gray/50 font-bold">Or Continue With</span>
                            <div className="flex-grow border-t border-neutral-sand"></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSocialLogin('google')}
                                className="flex items-center justify-center gap-2 py-3 border border-neutral-sand hover:bg-neutral-sand/20 transition-colors text-[10px] font-bold uppercase tracking-widest"
                            >
                                Google
                            </button>
                            <button
                                onClick={() => handleSocialLogin('apple')}
                                className="flex items-center justify-center gap-2 py-3 border border-neutral-sand hover:bg-neutral-sand/20 transition-colors text-[10px] font-bold uppercase tracking-widest"
                            >
                                Apple
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

