"use client";
import React from "react";
import { CreditCard, Plus, Shield } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";

export default function PaymentMethodsPage() {
    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                            Secure Payments
                        </h1>
                        <p className="text-neutral-gray text-sm">Manage your curated collection of payment instruments</p>
                    </div>
                    <button
                        className="px-8 py-3 bg-primary-dark text-white rounded-full hover:bg-black transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest shadow-sm hover:shadow-lg"
                    >
                        <Plus size={18} strokeWidth={2.5} />
                        Add Method
                    </button>
                </div>

                {/* Secure Notice */}
                <div className="bg-neutral-cream/30 border border-neutral-sand/50 rounded-2xl p-6 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-white border border-neutral-sand shadow-sm shrink-0">
                        <Shield className="text-[#d4af37]" size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-primary-dark uppercase tracking-wider mb-1">Privacy Focused Payments</h3>
                        <p className="text-xs text-neutral-gray leading-relaxed">
                            Yasmin Fashions uses industry-standard encryption. We never store your full card details on our servers. All sensitive information is handled by our secure boutique payment partners.
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                <div className="bg-white rounded-2xl border border-neutral-sand p-16 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-neutral-cream border border-neutral-sand flex items-center justify-center mx-auto mb-6">
                        <CreditCard className="text-neutral-gray/40" size={32} strokeWidth={1} />
                    </div>
                    <h2 className="font-display text-2xl text-primary-dark mb-2">No Payment Methods Saved</h2>
                    <p className="text-neutral-gray text-sm mb-8 max-w-sm mx-auto">
                        Elevate your checkout experience by securely saving your preferred method of transaction.
                    </p>
                    <button
                        className="px-10 py-4 bg-primary-dark text-white rounded-xl hover:bg-black transition-all shadow-sm hover:shadow-lg text-[10px] font-bold uppercase tracking-[0.2em]"
                    >
                        Authenticate New Card
                    </button>
                </div>
            </div>
        </ProfileLayout>
    );
}
