"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
    Menu,
    Bell,
    ChevronRight,
    Search,
    User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Input from "../ui/Input";

interface TopBarProps {
    onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
    const pathname = usePathname();
    const { user } = useAuth();

    // Generate breadcrumbs from pathname
    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "));

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-admin-gray-200 flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300">
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-admin-gray-600 hover:text-admin-dark hover:bg-admin-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Breadcrumbs */}
                <div className="hidden md:flex items-center gap-2 text-sm text-admin-gray-600">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={crumb}>
                            {index > 0 && <ChevronRight size={14} className="text-admin-gray-400" />}
                            <span className={index === breadcrumbs.length - 1 ? "font-semibold text-admin-dark" : ""}>
                                {crumb}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Global Search (Optional) */}
                <div className="hidden lg:block max-w-md w-full ml-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full pl-10 pr-4 py-2 bg-admin-gray-100 border-transparent focus:bg-white focus:border-admin-gold focus:ring-0 rounded-lg text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-admin-gray-600 hover:text-admin-dark hover:bg-admin-gray-100 rounded-lg transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-status-danger rounded-full border-2 border-white"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-admin-gray-200">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-admin-dark leading-tight">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-admin-gold font-medium uppercase tracking-wider">
                            Administrator
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-admin-gray-100 border border-admin-gray-200 flex items-center justify-center text-admin-dark font-display font-bold text-lg overflow-hidden">
                        {user?.firstName ? user.firstName[0] : <User size={20} />}
                    </div>
                </div>
            </div>
        </header>
    );
}
