"use client";
import React from "react";
import Link from "next/link";
import {
    Tag,
    Plus,
    Search,
    Copy,
    Clock,
    Users,
    TrendingUp
} from "lucide-react";

export default function SalesPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display text-3xl text-[#0f1419]">Sales & Discounts</h1>
                    <p className="text-[#6c757d] text-sm mt-1">Manage coupons, automatic discounts, and seasonal offers.</p>
                </div>
                <button className="px-5 py-2.5 bg-[#0f1419] text-white rounded-lg text-sm font-medium hover:bg-black transition-all shadow-md flex items-center gap-2">
                    <Plus size={16} />
                    Create Coupon
                </button>
            </div>

            {/* Active Offers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        code: "RAMADAN26",
                        discount: "15% OFF",
                        desc: "Ramadan Early Access",
                        uses: "47 uses",
                        status: "Active",
                        expiry: "Expires in 24 days"
                    },
                    {
                        code: "VIP20",
                        discount: "$20 OFF",
                        desc: "VIP Members Only",
                        uses: "12 uses",
                        status: "Active",
                        expiry: "No expiry"
                    },
                    {
                        code: "WELCOME10",
                        discount: "10% OFF",
                        desc: "New Customer Welcome",
                        uses: "234 uses",
                        status: "Active",
                        expiry: "No expiry"
                    }
                ].map((coupon) => (
                    <div key={coupon.code} className="bg-white rounded-xl border border-[#e9ecef] shadow-sm hover:shadow-md transition-all overflow-hidden group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-[#f8f9fa] rounded border border-[#e9ecef] flex items-center gap-2 font-mono text-sm font-bold text-[#0f1419]">
                                    <Tag size={14} className="text-[#c9a961]" />
                                    {coupon.code}
                                </div>
                                <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                    {coupon.status}
                                </span>
                            </div>

                            <h3 className="font-display text-2xl text-[#0f1419] mb-1">{coupon.discount}</h3>
                            <p className="text-sm text-[#6c757d]">{coupon.desc}</p>

                            <div className="mt-6 pt-4 border-t border-[#e9ecef] flex justify-between items-center text-xs text-[#6c757d]">
                                <span className="flex items-center gap-1">
                                    <Users size={12} /> {coupon.uses}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {coupon.expiry}
                                </span>
                            </div>
                        </div>
                        <div className="bg-[#f8f9fa] px-4 py-2 border-t border-[#e9ecef] opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                            <button className="text-xs font-medium text-[#0f1419] hover:text-[#c9a961]">Edit</button>
                            <span className="text-[#e9ecef]">|</span>
                            <button className="text-xs font-medium text-red-600 hover:text-red-700">Deactivate</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance */}
            <div className="bg-[#0f1419] rounded-xl p-8 text-white flex flex-col md:flex-row gap-8 items-center border border-[#0f1419]">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="text-[#c9a961]" size={24} />
                        <h2 className="font-display text-xl text-white">Discount Performance</h2>
                    </div>
                    <p className="text-neutral-400 text-sm">
                        Coupons have generated <span className="text-white font-bold">$12,450</span> in extra revenue this month.
                        The <span className="text-[#c9a961]">WELCOME10</span> code has the highest conversion rate at 24%.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-5 py-2.5 bg-white text-[#0f1419] rounded-lg text-sm font-bold hover:bg-neutral-100 transition-colors">
                        View Full Report
                    </button>
                </div>
            </div>
        </div>
    );
}
