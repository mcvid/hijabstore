"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ForgotPasswordFormProps {
    onBack?: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) throw resetError;

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send password reset email");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600" size={32} />
                </div>
                <h2 className="font-display text-2xl text-primary-dark mb-2">Check Your Email</h2>
                <p className="text-neutral-gray mb-6">
                    We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-neutral-gray mb-6">
                    The link will expire in 1 hour for security reasons.
                </p>
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-primary-gold hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to Login
                </button>
            </motion.div>
        );
    }

    return (
        <div>
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 text-neutral-gray hover:text-primary-dark mb-6"
            >
                <ArrowLeft size={16} />
                Back to Login
            </button>

            <div className="text-center mb-8">
                <h2 className="font-display text-2xl text-primary-dark mb-2">Forgot Password?</h2>
                <p className="text-neutral-gray">
                    Enter your email and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                            placeholder="sarah@example.com"
                            required
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
                    >
                        <X className="text-red-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-sm text-red-700">{error}</p>
                    </motion.div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-primary-dark text-white font-medium rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>
        </div>
    );
}
