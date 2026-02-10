"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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

export default function ResetPasswordForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (passwordStrength < 75) {
            setError("Please choose a stronger password");
            return;
        }

        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: formData.password,
            });

            if (updateError) throw updateError;

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login?reset=success");
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to reset password");
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
                <h2 className="font-display text-2xl text-primary-dark mb-2">Password Reset Successful!</h2>
                <p className="text-neutral-gray mb-4">
                    Your password has been changed successfully.
                </p>
                <p className="text-sm text-neutral-gray">
                    Redirecting you to login...
                </p>
            </motion.div>
        );
    }

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="font-display text-2xl text-primary-dark mb-2">Set New Password</h2>
                <p className="text-neutral-gray">
                    Choose a strong password for your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-primary-dark mb-2">
                        New Password
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
                        Confirm New Password
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
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
