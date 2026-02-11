"use client";
import React, { useEffect, useState, useRef } from "react";
import { Camera, User, Mail, Phone, Calendar, Save, CheckCircle } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { profileService } from "@/lib/profileService";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function SettingsPage() {
    const { user, refreshProfile, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const hcaptchaRef = useRef<HCaptcha>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        display_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        gender: "prefer_not_to_say", // Changed default to match button value
        language: "en",
        currency: "USD",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.firstName || "",
                last_name: user.lastName || "",
                display_name: user.displayName || "",
                email: user.email || "",
                phone: user.phone || "",
                date_of_birth: user.dateOfBirth || "",
                gender: user.gender || "prefer_not_to_say", // Changed default to match button value
                language: user.preferences?.language || "en",
                currency: user.preferences?.currency || "USD",
            });
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await profileService.uploadProfilePhoto(file);
            if (url) {
                await refreshProfile();
                alert("Profile photo updated");
            }
        } catch (error) {
            console.error("Failed to upload photo:", error);
            alert("Failed to upload photo");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!captchaToken) {
            alert("Please complete the CAPTCHA");
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch("/api/account/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ""}`,
                },
                body: JSON.stringify({
                    captchaToken,
                    updates: {
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        display_name: formData.display_name,
                        phone: formData.phone,
                        date_of_birth: formData.date_of_birth,
                        gender: formData.gender,
                        language: formData.language,
                        currency: formData.currency,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Update failed");
            }

            await refreshProfile();
            alert("Profile updated successfully");
            hcaptchaRef.current?.resetCaptcha();
            setCaptchaToken(null);
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <ProfileLayout>
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full" />
                </div>
            </ProfileLayout>
        );
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                        Personal Settings
                    </h1>
                    <p className="text-neutral-gray">Update your personal information and preferences</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* HCaptcha Integration */}
                    {/* We only require captcha for sensitive profile updates if desired, or always. 
                        Here we'll implement it as part of the form submission.
                    */}

                    {/* Profile Photo */}
                    <div className="bg-white rounded-xl border border-neutral-sand p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full bg-neutral-cream border-2 border-[#d4af37]/20 overflow-hidden shadow-inner group-hover:border-[#d4af37]/40 transition-colors">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-display text-3xl text-primary-dark">
                                            {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute bottom-1 right-1 w-8 h-8 bg-primary-dark text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#d4af37] transition-all shadow-lg scale-90 group-hover:scale-100">
                                    {isUploading ? (
                                        <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                        <Camera size={14} strokeWidth={2.5} />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="font-display text-lg font-semibold text-primary-dark mb-1">Profile Identity</h3>
                                <p className="text-xs text-neutral-gray mb-3 uppercase tracking-widest font-medium">Portrait & Avatar Settings</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[11px] text-neutral-gray">
                                    <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-[#d4af37]" /> High Resolution preferred</span>
                                    <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-[#d4af37]" /> Max 2MB size</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-xl border border-neutral-sand p-8 shadow-sm">
                        <h3 className="font-display text-lg font-semibold text-primary-dark mb-6">Personal Account Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    First Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray group-focus-within:text-[#d4af37] transition-colors" size={16} strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark placeholder:text-neutral-gray/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    Last Name
                                </label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray group-focus-within:text-[#d4af37] transition-colors" size={16} strokeWidth={1.5} />
                                    <input
                                        type="text"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark placeholder:text-neutral-gray/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark placeholder:text-neutral-gray/50"
                                    placeholder="How you'd like to be addressed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray/40" size={16} strokeWidth={1.5} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-cream/50 border border-neutral-sand rounded-xl cursor-not-allowed text-sm font-medium text-neutral-gray/60"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    Phone Number
                                </label>
                                <div className="relative group">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray group-focus-within:text-[#d4af37] transition-colors" size={16} strokeWidth={1.5} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark placeholder:text-neutral-gray/50"
                                        placeholder="+971 50 123 4567"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    Date of Birth
                                </label>
                                <div className="relative group">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray group-focus-within:text-[#d4af37] transition-colors" size={16} strokeWidth={1.5} />
                                    <input
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray">
                                    Gender
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {['female', 'male', 'prefer_not_to_say'].map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                            className={`px-6 py-2 rounded-full border text-xs font-semibold capitalize transition-all ${formData.gender === g
                                                ? 'bg-primary-dark text-white border-primary-dark'
                                                : 'bg-white text-neutral-gray border-neutral-sand hover:border-[#d4af37]/50'
                                                }`}
                                        >
                                            {g.replace(/_/g, ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white rounded-xl border border-neutral-sand p-6">
                        <h3 className="font-semibold text-primary-dark mb-4">Regional Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-dark mb-2">
                                    Language
                                </label>
                                <select
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold bg-white"
                                >
                                    <option value="en">English</option>
                                    <option value="ar">العربية (Arabic)</option>
                                    <option value="fr">Français (French)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary-dark mb-2">
                                    Currency
                                </label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-4 py-2 border border-neutral-sand rounded-lg focus:outline-none focus:border-primary-gold bg-white"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="AED">AED (د.إ)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Security Check */}
                    <div className="flex justify-start">
                        <HCaptcha
                            sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                            onVerify={(token) => setCaptchaToken(token)}
                            theme="light"
                        />
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 pb-12">
                        <button
                            type="submit"
                            disabled={isSaving || !captchaToken}
                            className="group relative px-12 py-4 bg-primary-dark text-white rounded-xl hover:bg-black transition-all shadow-sm hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 w-0 bg-[#d4af37] transition-all duration-300 group-hover:w-1" />
                            <div className="relative flex items-center justify-center gap-3">
                                {isSaving ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <Save size={18} strokeWidth={2} />
                                )}
                                <span className="text-sm font-bold uppercase tracking-[0.2em]">
                                    {isSaving ? "Finalizing..." : "Update Profile"}
                                </span>
                            </div>
                        </button>
                    </div>
                </form>
            </div>
        </ProfileLayout>
    );
}
