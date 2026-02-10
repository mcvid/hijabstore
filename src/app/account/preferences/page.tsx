"use client";
import React from "react";
import { Sliders, Bell, Globe, Sparkles } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function PreferencesPage() {
    return (
        <ProfileLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                        Tailored Preferences
                    </h1>
                    <p className="text-neutral-gray text-sm">Curate your Yasmin experience with personalized choices</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Communications */}
                    <div className="bg-white rounded-2xl border border-neutral-sand p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-[#d4af37]/10">
                                <Bell className="text-[#d4af37]" size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-primary-dark">Journal & Updates</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: "The Yasmin Journal", desc: "Weekly editorials on modest luxury and style." },
                                { title: "Boutique Alerts", desc: "Exclusive early access to limited edition drops." },
                                { title: "Order Concierge", desc: "Status updates regarding your recent selections." }
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-neutral-cream/20 border border-neutral-sand/20">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-primary-dark mb-0.5">{pref.title}</p>
                                        <p className="text-[11px] text-neutral-gray">{pref.desc}</p>
                                    </div>
                                    <div className="w-10 h-6 bg-[#d4af37] rounded-full relative cursor-pointer">
                                        <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personal Style */}
                    <div className="bg-white rounded-2xl border border-neutral-sand p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary-dark/5">
                                <Sparkles className="text-primary-dark" size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-primary-dark">Style Profile</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray mb-3">Preferred Aesthetic</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Minimalist', 'Classic', 'Avant-Garde', 'Bohemian'].map(tag => (
                                        <span key={tag} className="px-4 py-2 rounded-lg bg-neutral-cream text-[11px] font-bold text-primary-dark border border-neutral-sand/50">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray mb-3">Sizing System</p>
                                <div className="flex gap-3">
                                    {['EU', 'US', 'UK'].map(size => (
                                        <button key={size} className={`px-5 py-2 rounded-lg text-xs font-bold border transition-all ${size === 'EU' ? 'border-[#d4af37] text-[#d4af37] bg-[#d4af37]/5' : 'border-neutral-sand text-neutral-gray'}`}>
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
}
