"use client";
import React from "react";
import { Lock, Shield, History, Key, EyeOff, Trash2 } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function PrivacyPage() {
    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                        Privacy & Sovereign Security
                    </h1>
                    <p className="text-neutral-gray text-sm">Oversee your digital footprint and account protection</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Security Actions */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-2xl border border-neutral-sand p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-primary-dark/5">
                                    <Key className="text-primary-dark" size={20} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-display text-lg font-semibold text-primary-dark">Access Control</h3>
                            </div>
                            <button className="w-full flex items-center justify-between p-4 rounded-xl border border-neutral-sand hover:border-[#d4af37]/50 transition-all group">
                                <div className="text-left">
                                    <p className="text-sm font-bold text-primary-dark mb-0.5">Change Password</p>
                                    <p className="text-[11px] text-neutral-gray">Last updated 2 months ago</p>
                                </div>
                                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" className="group-hover:translate-x-1 transition-transform">
                                    <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="mt-4 p-4 rounded-xl bg-neutral-cream/30 border border-neutral-sand/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-primary-dark mb-0.5">Two-Factor Auth</p>
                                        <p className="text-[11px] text-neutral-gray italic">Recommended for VIP members</p>
                                    </div>
                                    <div className="w-10 h-6 bg-neutral-sand rounded-full relative cursor-pointer">
                                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white rounded-2xl border border-neutral-sand p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-[#d4af37]/10">
                                    <Shield className="text-[#d4af37]" size={20} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-display text-lg font-semibold text-primary-dark">Data Autonomy</h3>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full py-3 bg-neutral-cream text-primary-dark text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-sand transition-colors">
                                    Export Personal Archive
                                </button>
                                <p className="text-[10px] text-neutral-gray text-center px-4 leading-relaxed">
                                    Download a comprehensive report of your interactions, purchases, and preferences in JSON format.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Login History */}
                    <div className="bg-white rounded-2xl border border-neutral-sand p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary-dark/5">
                                <History className="text-primary-dark" size={20} strokeWidth={1.5} />
                            </div>
                            <h3 className="font-display text-lg font-semibold text-primary-dark">Active Sessions</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { device: "MacBook Pro", location: "Dubai, UAE", time: "Active Now", current: true },
                                { device: "iPhone 15", location: "London, UK", time: "2 hours ago", current: false },
                                { device: "iPad Air", location: "Dubai, UAE", time: "3 days ago", current: false }
                            ].map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-neutral-cream/20 border border-neutral-sand/20">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-green-500' : 'bg-neutral-gray/40'}`} />
                                        <div>
                                            <p className="text-sm font-bold text-primary-dark">{session.device}</p>
                                            <p className="text-[10px] text-neutral-gray">{session.location} • {session.time}</p>
                                        </div>
                                    </div>
                                    {!session.current && (
                                        <button className="text-[10px] font-bold text-red-600 hover:underline uppercase tracking-widest">Terminate</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-neutral-sand/50">
                            <button className="flex items-center gap-2 text-red-600 group">
                                <Trash2 size={16} strokeWidth={1.5} />
                                <span className="text-xs font-bold uppercase tracking-widest group-hover:underline">Request Account Deletion</span>
                            </button>
                            <p className="text-[10px] text-neutral-gray mt-2 leading-relaxed">
                                Proceeding with this action will permanently remove your curated profile, loyalty points, and history across the Yasmin Collective.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
}
