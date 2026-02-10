"use client";
import React, { useEffect, useState } from "react";
import { Crown, Gift, TrendingUp, Users, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { profileService, Profile, LoyaltyTransaction } from "@/lib/profileService";

const tierBenefits = {
    bronze: ["Free shipping on orders over $50", "Earn 1 point per $ spent", "Birthday gift"],
    silver: ["Free shipping on all orders", "Earn 1.25 points per $ spent", "Early access to sales", "Birthday gift + surprise"],
    gold: ["Free express shipping", "Earn 1.5 points per $ spent", "VIP customer service", "Exclusive events access", "Premium birthday gift"],
    platinum: ["Free same-day delivery", "Earn 2 points per $ spent", "Personal stylist", "Private shopping events", "Luxury birthday gift", "Complimentary alterations"],
};

const tierColors = {
    bronze: "border-[#d4af37] text-primary-dark",
    silver: "border-[#c0c0c0] text-primary-dark",
    gold: "border-[#ffd700] text-primary-dark",
    platinum: "border-[#e5e4e2] text-primary-dark",
};

const tierGradients = {
    bronze: "from-amber-50 to-orange-50",
    silver: "from-gray-50 to-slate-50",
    gold: "from-yellow-50 to-amber-50",
    platinum: "from-slate-50 to-neutral-50",
};

export default function LoyaltyPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
    const [tierProgress, setTierProgress] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [referralCopied, setReferralCopied] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [profileData, transactionsData] = await Promise.all([
                profileService.getProfile(),
                profileService.getLoyaltyTransactions(20),
            ]);

            setProfile(profileData);
            setTransactions(transactionsData);

            if (profileData) {
                const progress = profileService.calculateTierProgress(
                    profileData.lifetime_spent,
                    profileData.tier
                );
                setTierProgress(progress);
            }
        } catch (error) {
            console.error("Failed to load loyalty data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyReferral = () => {
        const referralCode = `NUR${profile?.id.slice(0, 8).toUpperCase()}`;
        navigator.clipboard.writeText(`https://nurboutique.com/ref/${referralCode}`);
        setReferralCopied(true);
        setTimeout(() => setReferralCopied(false), 2000);
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

    const currentTier = profile?.tier || "bronze";

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                        Loyalty & Rewards
                    </h1>
                    <p className="text-neutral-gray">Track your points and unlock exclusive benefits</p>
                </div>

                {/* Tier Card */}
                <div className={`bg-gradient-to-br ${tierGradients[currentTier as keyof typeof tierGradients]} border-2 ${tierColors[currentTier as keyof typeof tierColors].split(' ')[0]} rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#d4af37]/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-full bg-white border border-[#d4af37]/20 flex items-center justify-center shadow-sm">
                                <Crown className="text-[#d4af37]" size={32} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="font-display text-3xl capitalize text-primary-dark">{currentTier} status</h2>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-gray font-bold">Yasmin Collective Member</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/60">
                                <p className="text-neutral-gray text-[10px] uppercase tracking-widest font-bold mb-1">Available Points</p>
                                <p className="text-4xl font-display text-primary-dark">{profile?.points?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/60">
                                <p className="text-neutral-gray text-[10px] uppercase tracking-widest font-bold mb-1">Lifetime Spent</p>
                                <p className="text-4xl font-display text-primary-dark">${profile?.lifetime_spent?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/40 backdrop-blur-md rounded-xl p-4 border border-white/60">
                                <p className="text-neutral-gray text-[10px] uppercase tracking-widest font-bold mb-1">Total Orders</p>
                                <p className="text-4xl font-display text-primary-dark">{profile?.total_orders}</p>
                            </div>
                        </div>

                        {tierProgress && tierProgress.nextTier && (
                            <div className="max-w-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] uppercase tracking-widest text-neutral-gray font-bold">Path to {tierProgress.nextTier}</span>
                                    <span className="text-xs font-bold text-primary-dark">{tierProgress.progress.toFixed(0)}%</span>
                                </div>
                                <div className="h-1.5 bg-neutral-sand/30 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${tierProgress.progress}%` }}
                                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#f2cf7e]"
                                    />
                                </div>
                                <p className="text-[11px] text-neutral-gray mt-3 font-medium">
                                    Invest <span className="text-primary-dark font-bold">${tierProgress.amountToNext.toLocaleString()}</span> more to unlock <span className="text-primary-dark font-bold capitalize">{tierProgress.nextTier}</span> privileges
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl border border-neutral-sand p-8 shadow-sm">
                    <h3 className="font-display text-xl font-semibold text-primary-dark mb-6 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#d4af37]/10">
                            <Gift className="text-[#d4af37]" size={20} />
                        </div>
                        Exclusive Privileges
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tierBenefits[currentTier as keyof typeof tierBenefits].map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-neutral-cream/30 border border-neutral-sand/50 group hover:border-[#d4af37]/30 transition-colors">
                                <div className="w-5 h-5 rounded-full bg-white border border-[#d4af37]/20 flex items-center justify-center shrink-0">
                                    <Check className="text-[#d4af37]" size={12} strokeWidth={3} />
                                </div>
                                <span className="text-sm text-primary-dark font-medium">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Referral Program */}
                <div className="bg-white rounded-xl border border-[#d4af37]/20 p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/5 -translate-y-1/2 translate-x-1/2 rounded-full" />

                    <div className="relative z-10">
                        <div className="max-w-xl mb-8">
                            <h3 className="font-display text-2xl font-semibold text-primary-dark mb-3 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-dark/5">
                                    <Users className="text-primary-dark" size={22} strokeWidth={1.5} />
                                </div>
                                The Yasmin Circle
                            </h3>
                            <p className="text-neutral-gray text-sm leading-relaxed">
                                Introduce your inner circle to Yasmin Fashions. They receive <span className="text-primary-dark font-bold">$10</span> on their first selection, and you'll receive <span className="text-primary-dark font-bold">100 premium points</span> as our gratitude.
                            </p>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex items-center gap-3 px-5 py-4 bg-neutral-cream rounded-xl border border-neutral-sand group transition-all hover:border-[#d4af37]/30">
                                <code className="text-sm text-primary-dark font-mono font-bold tracking-wider flex-1">
                                    YASMIN-{profile?.id.slice(0, 8).toUpperCase()}
                                </code>
                            </div>
                            <button
                                onClick={handleCopyReferral}
                                className="px-10 py-4 bg-primary-dark text-white rounded-xl hover:bg-black transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest"
                            >
                                {referralCopied ? (
                                    <>
                                        <Check size={18} />
                                        Invited
                                    </>
                                ) : (
                                    <>
                                        <Copy size={18} />
                                        Copy Invitation
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Points History */}
                <div className="bg-white rounded-xl border border-neutral-sand overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-sand">
                        <h3 className="font-display text-xl font-semibold text-primary-dark flex items-center gap-2">
                            <TrendingUp className="text-primary-gold" size={24} />
                            Points History
                        </h3>
                    </div>

                    {transactions.length > 0 ? (
                        <div className="divide-y divide-neutral-sand">
                            {transactions.map((transaction) => (
                                <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-primary-dark mb-1">{transaction.reason}</p>
                                        <p className="text-sm text-neutral-gray">
                                            {new Date(transaction.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`text-xl font-semibold ${transaction.transaction_type === "earned"
                                                ? "text-green-600"
                                                : transaction.transaction_type === "redeemed"
                                                    ? "text-red-600"
                                                    : "text-neutral-gray"
                                                }`}
                                        >
                                            {transaction.transaction_type === "earned" ? "+" : "-"}
                                            {Math.abs(transaction.points)}
                                        </p>
                                        <p className="text-xs text-neutral-gray">Balance: {transaction.balance_after}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-12 text-center">
                            <TrendingUp className="mx-auto mb-3 text-neutral-gray" size={48} />
                            <p className="text-neutral-gray">No transaction history yet</p>
                        </div>
                    )}
                </div>
            </div>
        </ProfileLayout>
    );
}
