"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    BarChart3,
    Settings,
    Navigation,
    Image as ImageIcon,
    LogOut,
    X,
    Tag,
    Palette
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: Navigation },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Design", href: "/admin/design", icon: Palette },
    { name: "Sales & Marketing", href: "/admin/marketing", icon: Tag },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-[70] bg-[#0a0e14] text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-2xl ${isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
                    }`}
            >
                <div className="flex flex-col h-full border-r border-white/10">
                    {/* Brand */}
                    <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                        <Link
                            href="/admin"
                            className={`font-display text-xl tracking-wider transition-opacity duration-300 whitespace-nowrap ${!isOpen && "lg:opacity-0 lg:hidden"
                                }`}
                        >
                            Yasmin <span className="text-[#d4af37]">Admin</span>
                        </Link>
                        {/* Mobile Close */}
                        <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        {/* Collapsed Brand Icon (Desktop only) */}
                        <div className={`hidden lg:flex items-center justify-center w-full ${isOpen && "lg:hidden"}`}>
                            <span className="font-display text-xl text-[#d4af37]">Y</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${isActive
                                        ? "bg-[#d4af37] text-white shadow-lg shadow-[#d4af37]/20"
                                        : "text-white/70 hover:bg-white/10 hover:text-white"
                                        }`}
                                    title={!isOpen ? item.name : undefined}
                                >
                                    <Icon
                                        size={20}
                                        className={`shrink-0 ${isActive ? "text-white" : "group-hover:text-[#d4af37] transition-colors"}`}
                                    />
                                    <span
                                        className={`text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${!isOpen ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all group"
                            title={!isOpen ? "Logout" : undefined}
                        >
                            <LogOut size={20} className="shrink-0" />
                            <span
                                className={`text-sm font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${!isOpen ? "lg:opacity-0 lg:w-0 lg:hidden" : "opacity-100"
                                    }`}
                            >
                                Logout
                            </span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
