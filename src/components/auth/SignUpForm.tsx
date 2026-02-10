"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface SignUpFormProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

interface PasswordRequirement {
    label: string;
    test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "One number", test: (p) => /\d/.test(p) },
];

export default function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const getPasswordStrength = (password: string): number => {
        const passedCount = passwordRequirements.filter((req) => req.test(password)).length;
        return (passedCount / passwordRequirements.length) * 100;
    };

    const getStrengthLabel = (strength: number): string => {
        if (strength === 0) return "";
        if (strength < 50) return "Weak";
        if (strength < 75) return "Medium";
        return "Strong";
    };

    const getStrengthColor = (strength: number): string => {
        if (strength < 50) return "bg-red-500";
        if (strength < 75) return "bg-yellow-500";
        return "bg-green-500";
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

    const handleSocialLogin = async (provider: "google" | "apple") => {
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/account`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || `Failed to sign in with ${provider}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (!formData.firstName || !formData.lastName) {
            setError("Please enter your full name");
            return;
        }

        if (!isEmailValid) {
            setError("Please enter a valid email address");
            return;
        }

        if (passwordStrength < 75) {
            setError("Please choose a stronger password");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        if (!acceptedTerms) {
            setError("Please accept the terms and conditions");
            return;
        }

        setIsLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        display_name: `${formData.firstName} ${formData.lastName.charAt(0)}.`,
                    },
                },
            });

            if (signUpError) {
                if (signUpError.message.includes("rate limit")) {
                    throw new Error("You've tried too many times within a short period. Please wait a few minutes before trying again or use Social Sign In below.");
                }
                throw signUpError;
            }

            // Update profile with names
            if (data.user) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .update({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        display_name: `${formData.firstName} ${formData.lastName.charAt(0)}.`,
                    })
                    .eq("id", data.user.id);

                if (profileError) console.error("Profile update error:", profileError);
            }

            setSuccess(true);
            if (onSuccess) {
                setTimeout(() => onSuccess(), 2000);
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during sign up");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
            >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-600" size={32} />
                </div>
                <h2 className="font-display text-2xl text-primary-dark mb-2">Welcome to Yasmin Fashions!</h2>
                <p className="text-neutral-gray mb-4">
                    Please check your email to verify your account.
                </p>
                <p className="text-sm text-neutral-gray">
                    We've sent a verification link to <strong>{formData.email}</strong>
                </p>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                        First Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                            placeholder="Sarah"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                        Last Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                            placeholder="Ahmed"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                        placeholder="sarah@example.com"
                        required
                    />
                    {formData.email && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {isEmailValid ? (
                                <Check className="text-green-500" size={18} />
                            ) : (
                                <X className="text-red-500" size={18} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                        placeholder="Create a strong password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-dark"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                    <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-neutral-gray">Password Strength</span>
                            <span className={`text-xs font-medium ${passwordStrength < 50 ? "text-red-500" :
                                passwordStrength < 75 ? "text-yellow-500" :
                                    "text-green-500"
                                }`}>
                                {getStrengthLabel(passwordStrength)}
                            </span>
                        </div>
                        <div className="h-2 bg-neutral-cream rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${passwordStrength}%` }}
                                className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                            />
                        </div>

                        {/* Requirements Checklist */}
                        <div className="mt-3 space-y-1">
                            {passwordRequirements.map((req, idx) => {
                                const passed = req.test(formData.password);
                                return (
                                    <div key={idx} className="flex items-center gap-2 text-xs">
                                        {passed ? (
                                            <Check size={14} className="text-green-500" />
                                        ) : (
                                            <X size={14} className="text-neutral-gray" />
                                        )}
                                        <span className={passed ? "text-green-600" : "text-neutral-gray"}>
                                            {req.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                    Confirm Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray" size={18} />
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-12 py-3 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold transition-colors"
                        placeholder="Confirm your password"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray hover:text-primary-dark"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    {formData.confirmPassword && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2">
                            {passwordsMatch ? (
                                <Check className="text-green-500" size={18} />
                            ) : (
                                <X className="text-red-500" size={18} />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary-gold border-neutral-sand rounded focus:ring-primary-gold"
                />
                <label htmlFor="terms" className="text-sm text-neutral-gray">
                    I agree to the{" "}
                    <a href="/terms" className="text-primary-gold hover:underline">
                        Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-primary-gold hover:underline">
                        Privacy Policy
                    </a>
                </label>
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
                {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Switch to Login */}
            <div className="text-center">
                <p className="text-sm text-neutral-gray">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-primary-gold hover:underline font-medium"
                    >
                        Sign In
                    </button>
                </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-sand" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-neutral-gray">Or continue with</span>
                </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center gap-2 py-3 border border-neutral-sand rounded-lg hover:bg-neutral-cream transition-colors font-medium text-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </button>
                <button
                    type="button"
                    onClick={() => handleSocialLogin("apple")}
                    className="flex items-center justify-center gap-2 py-3 border border-neutral-sand rounded-lg hover:bg-neutral-cream transition-colors font-medium text-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                </button>
            </div>
        </form>
    );
}
