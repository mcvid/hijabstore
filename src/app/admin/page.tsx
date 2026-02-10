"use client";
import React, { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingBag,
    Users,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    Package,
    ChevronRight,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { adminService } from "@/lib/admin";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboard();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary-gold" size={40} />
                <p className="font-display text-xl text-neutral-gray tracking-widest uppercase">Yasmin Admin</p>
            </div>
        );
    }

    const cards = [
        { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, change: "+14.2%", isPositive: true, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Active Orders", value: stats.totalOrders.toLocaleString(), change: "+8.1%", isPositive: true, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Customers", value: stats.customers.toLocaleString(), change: "+12.5%", isPositive: true, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Active Collection", value: stats.activeProducts.toLocaleString(), change: "-2.4%", isPositive: false, icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Hero Summary */}
            <div className="bg-[#0f1419] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="font-display text-3xl md:text-4xl mb-2">Welcome back, Admin</h1>
                    <p className="text-white/60 text-sm max-w-md font-light leading-relaxed">
                        Yasmin Fashions is performing exceptionally well this month.
                    </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div key={i} className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                                    <Icon className={card.color} size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${card.isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                    {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {card.change}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[#0f1419] mb-1">{card.value}</p>
                            <p className="text-xs text-neutral-gray uppercase tracking-widest font-bold">{card.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Inventory Snapshot */}
            <div className="bg-white rounded-2xl border border-[#e9ecef] shadow-sm p-6">
                <h3 className="font-display text-xl text-[#0f1419] mb-6">Inventory Alerts</h3>
                <div className="space-y-6">
                    {[
                        { name: "Silk Chiffon - Rose", stock: 4, status: "Low Stock" },
                        { name: "Premium Oud Oil", stock: 2, status: "Critical" },
                        { name: "Classic Abaya - Black", stock: 0, status: "Out of Stock" }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-[#0f1419]">{item.name}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.stock === 0 ? "text-red-600" : "text-amber-600"}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${item.stock === 0 ? "bg-red-500" : "bg-amber-500"}`}
                                    style={{ width: `${(item.stock / 20) * 100}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-neutral-gray uppercase tracking-widest font-bold">{item.stock} units remaining</p>
                        </div>
                    ))}
                </div>
                <Link href="/admin/products">
                    <button className="w-full py-3 mt-10 border border-[#e9ecef] rounded-xl text-xs font-bold text-[#6c757d] hover:bg-[#f8f9fa] transition-colors uppercase tracking-widest">
                        Go to Inventory
                    </button>
                </Link>
            </div>
        </div>
    );
}
