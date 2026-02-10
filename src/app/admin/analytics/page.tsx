"use client";
import React, { useEffect, useState } from "react";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Filter,
    Download,
    Loader2
} from "lucide-react";
import { adminService } from "@/lib/admin";

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to load analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadStats();
    }, []);

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-[#6c757d]">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-display text-xl">Analyzing Performance...</p>
            </div>
        );
    }

    const performanceCards = [
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: "+12.5%",
            isPositive: true,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders.toLocaleString(),
            change: "+8.2%",
            isPositive: true,
            icon: ShoppingBag,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Avg. Order Value",
            value: `$${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}`,
            change: "-2.4%",
            isPositive: false,
            icon: BarChart3,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "New Customers",
            value: stats.customers.toLocaleString(),
            change: "+15.3%",
            isPositive: true,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display text-3xl text-[#0f1419]">Analytics Dashboard</h1>
                    <p className="text-[#6c757d] text-sm mt-1">Real-time insights and business performance metrics.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-[#e9ecef] rounded-lg text-sm text-[#6c757d] hover:bg-[#f8f9fa] transition-colors flex items-center gap-2">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                    <button className="px-4 py-2 bg-[#0f1419] text-white rounded-lg text-sm font-medium hover:bg-black transition-all shadow-md flex items-center gap-2">
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Performance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceCards.map((card) => (
                    <div key={card.title} className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                                <card.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${card.isPositive ? "text-emerald-600" : "text-red-600"}`}>
                                {card.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {card.change}
                            </div>
                        </div>
                        <h3 className="text-[#6c757d] text-xs font-bold uppercase tracking-wider">{card.title}</h3>
                        <p className="text-2xl font-display text-[#0f1419] mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend (Mockup Visual) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-display text-xl text-[#0f1419]">Sales Trend</h3>
                            <p className="text-xs text-[#6c757d]">Revenue performance over time</p>
                        </div>
                        <select className="bg-[#f8f9fa] border border-[#e9ecef] rounded px-2 py-1 text-xs text-[#6c757d] focus:outline-none">
                            <option>Monthly</option>
                            <option>Weekly</option>
                        </select>
                    </div>
                    {/* Mock Chart Visuals */}
                    <div className="h-64 flex items-end justify-between gap-2">
                        {[40, 60, 45, 75, 55, 90, 80, 65, 95, 70, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-[#c9a961]/20 hover:bg-[#c9a961] transition-colors rounded-t cursor-pointer group relative" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0f1419] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${(h * 120).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-[#adb5bd] uppercase tracking-widest font-bold">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <span>Nov</span>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white p-8 rounded-xl border border-[#e9ecef] shadow-sm">
                    <h3 className="font-display text-xl text-[#0f1419] mb-6">Top Performing</h3>
                    <div className="space-y-6">
                        {[
                            { name: "Silk Chiffon Hijab", sales: 245, revenue: "$6,125", img: "https://images.unsplash.com/photo-1583391733956-6c782764ecb3?q=80&w=200&auto=format&fit=crop" },
                            { name: "Premium Oud Fragrance", sales: 182, revenue: "$14,560", img: "https://images.unsplash.com/photo-1547881338-64674345c03b?q=80&w=200&auto=format&fit=crop" },
                            { name: "Luxury Abaya Set", sales: 124, revenue: "$22,320", img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=200&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#e9ecef] flex-shrink-0">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-[#0f1419] truncate">{item.name}</h4>
                                    <p className="text-xs text-[#6c757d]">{item.sales} units sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-[#0f1419]">{item.revenue}</p>
                                    <TrendingUp size={12} className="ml-auto text-emerald-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-3 mt-8 border border-[#e9ecef] rounded-lg text-xs font-bold text-[#6c757d] hover:bg-[#f8f9fa] transition-colors uppercase tracking-widest">
                        View Inventory Report
                    </button>
                </div>
            </div>

            {/* Recent Conversions & Traffic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0f1419] rounded-xl p-8 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="text-[#c9a961]" size={24} />
                            <h3 className="font-display text-xl">Conversion Optimization</h3>
                        </div>
                        <p className="text-neutral-400 text-sm mb-6 max-w-md">
                            Your conversion rate has increased by <span className="text-white font-bold">2.4%</span> this week.
                            Personalized recommendation blocks are driving 40% of all cart additions.
                        </p>
                        <button className="px-5 py-2.5 bg-white text-[#0f1419] rounded-lg text-sm font-bold hover:bg-[#c9a961] hover:text-white transition-all">
                            Review Customer Journey
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                        <TrendingUp size={300} />
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 border border-[#e9ecef] shadow-sm flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-display text-xl text-[#0f1419]">Customer Segments</h3>
                        <div className="text-xs text-[#6c757d] flex items-center gap-1 font-bold">
                            <Users size={14} /> Real-time
                        </div>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "VIP Members", percentage: 24, color: "bg-[#c9a961]" },
                            { label: "Repeat Customers", percentage: 48, color: "bg-[#0f1419]" },
                            { label: "First-time Visitors", percentage: 28, color: "bg-[#adb5bd]" }
                        ].map((segment, i) => (
                            <div key={i} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold text-[#6c757d] uppercase tracking-wider">
                                    <span>{segment.label}</span>
                                    <span>{segment.percentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-[#f8f9fa] rounded-full overflow-hidden border border-[#e9ecef]">
                                    <div className={`h-full ${segment.color} transition-all duration-1000`} style={{ width: `${segment.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
