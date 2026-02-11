"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    Heart,
    MapPin,
    CreditCard,
    Crown,
    Settings,
    UserCircle,
    Shield,
    LogOut,
    Camera,
    Menu,
    X,
} from "lucide-react";
import { profileService } from "@/lib/profileService";
import { useAuth } from "@/context/AuthContext";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

const navigation = [
    { name: "Dashboard", href: "/account", icon: LayoutDashboard },
    { name: "Orders", href: "/account/orders", icon: Package },
    { name: "Wishlist", href: "/account/wishlist", icon: Heart },
    { name: "Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Payment Methods", href: "/account/payment-methods", icon: CreditCard },
    { name: "Loyalty & Rewards", href: "/account/loyalty", icon: Crown },
    { name: "Personal Settings", href: "/account/settings", icon: UserCircle },
    { name: "Preferences", href: "/account/preferences", icon: Settings },
    { name: "Privacy & Security", href: "/account/privacy", icon: Shield },
];

const getTierColor = (tier: string) => {
    switch (tier) {
        case "platinum": return "border-[#e5e4e2] text-slate-400";
        case "gold": return "border-[#ffd700] text-amber-500";
        case "silver": return "border-[#c0c0c0] text-gray-400";
        default: return "border-[#d4af37] text-[#d4af37]";
    }
};

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    const pathname = usePathname();
    const { user, isLoading, logout, refreshProfile } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingPhoto(true);
        try {
            await profileService.uploadProfilePhoto(file);
            await refreshProfile();
        } catch (error) {
            console.error("Failed to upload photo:", error);
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = "/";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-cream">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-neutral-sand px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-neutral-sand overflow-hidden">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.displayName || "Profile"}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-primary-dark">
                                    {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-medium text-primary-dark">{user?.displayName || `${user?.firstName} ${user?.lastName}`}</p>
                            <p className="text-xs text-neutral-gray capitalize">{user?.tier || 'Bronze'} Member</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 text-primary-dark"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-neutral-sand shadow-lg"
                    >
                        <nav className="p-4 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "bg-primary-dark text-white"
                                            : "text-primary-dark hover:bg-neutral-cream"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </nav>
                    </motion.div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 lg:flex lg:gap-8">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block lg:w-80 shrink-0">
                    <div className="sticky top-8 bg-white rounded-xl shadow-sm border border-neutral-sand p-6">
                        {/* Profile Header */}
                        <div className="text-center pb-6 border-b border-neutral-sand">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="w-full h-full rounded-full bg-neutral-sand overflow-hidden">
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.displayName || "Profile"}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-primary-dark">
                                            {(user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")}
                                        </div>
                                    )}
                                </div>
                                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white" size={24} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        disabled={isUploadingPhoto}
                                    />
                                </label>
                                {isUploadingPhoto && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                                    </div>
                                )}
                            </div>

                            <h2 className="font-display text-xl font-semibold text-primary-dark mb-2">
                                {user?.displayName || `${user?.firstName} ${user?.lastName}`}
                            </h2>

                            <div className={`inline-block px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ${getTierColor(user?.tier || 'bronze')}`}>
                                {user?.tier || 'Bronze'} Member
                            </div>

                            <p className="text-[11px] uppercase tracking-widest text-neutral-gray font-medium">
                                {user?.points?.toLocaleString() || 0} Points Collected
                            </p>
                        </div>

                        {/* Navigation */}
                        <nav className="mt-6 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "bg-primary-dark text-white"
                                            : "text-primary-dark hover:bg-neutral-cream"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Logout */}
                        <div className="mt-6 pt-6 border-t border-neutral-sand">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-sand z-40">
                <div className="flex items-center justify-around py-2">
                    {[
                        { icon: LayoutDashboard, href: "/account", label: "Dashboard" },
                        { icon: Package, href: "/account/orders", label: "Orders" },
                        { icon: Heart, href: "/account/wishlist", label: "Wishlist" },
                        { icon: Settings, href: "/account/settings", label: "Settings" },
                        { icon: UserCircle, href: "/account/settings", label: "Profile" },
                    ].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${isActive ? "text-[#d4af37]" : "text-neutral-gray hover:text-primary-dark"
                                    }`}
                            >
                                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                                <span className={`text-[9px] uppercase tracking-wider font-medium ${isActive ? "text-[#d4af37]" : "text-neutral-gray"}`}>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Spacer for mobile bottom nav */}
            <div className="lg:hidden h-20" />
        </div>
    );
}
