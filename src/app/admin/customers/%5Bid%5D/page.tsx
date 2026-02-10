"use client";
import React, { use } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MessageSquare,
    ShoppingBag,
    DollarSign,
    Award,
    MoreVertical,
    Ban
} from "lucide-react";

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/customers"
                        className="p-2 bg-white border border-[#e9ecef] rounded-lg text-[#6c757d] hover:text-[#0f1419] transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-display text-2xl text-[#0f1419]">Sarah Ahmed</h1>
                            <span className="px-3 py-1 bg-[#0f1419] text-[#c9a961] border border-[#c9a961] rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                <Award size={12} /> VIP Customer
                            </span>
                        </div>
                        <p className="text-[#6c757d] text-sm mt-1">Customer since Jan 15, 2025</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-[#e9ecef] rounded-lg text-sm font-medium text-[#6c757d] hover:text-[#0f1419] transition-colors flex items-center gap-2">
                        <MessageSquare size={16} />
                        Send Message
                    </button>
                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
                        <Ban size={16} />
                        Ban User
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#6c757d]">
                        <ShoppingBag size={18} />
                        <span className="text-xs uppercase tracking-wider font-medium">Total Orders</span>
                    </div>
                    <p className="font-display text-3xl text-[#0f1419]">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#6c757d]">
                        <DollarSign size={18} />
                        <span className="text-xs uppercase tracking-wider font-medium">Lifetime Spent</span>
                    </div>
                    <p className="font-display text-3xl text-[#0f1419]">$4,250</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#6c757d]">
                        <DollarSign size={18} />
                        <span className="text-xs uppercase tracking-wider font-medium">Avg. Order</span>
                    </div>
                    <p className="font-display text-3xl text-[#0f1419]">$354</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-[#6c757d]">
                        <Award size={18} />
                        <span className="text-xs uppercase tracking-wider font-medium">Loyalty Points</span>
                    </div>
                    <p className="font-display text-3xl text-[#c9a961]">2,847</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl border border-[#e9ecef] shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-[#e9ecef] flex justify-between items-center">
                            <h3 className="font-display text-lg text-[#0f1419]">Order History</h3>
                            <Link href="#" className="text-xs font-semibold text-[#c9a961] hover:underline uppercase tracking-wider">View All</Link>
                        </div>
                        <table className="w-full">
                            <thead className="bg-[#f8f9fa] border-b border-[#e9ecef]">
                                <tr>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Order</th>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Status</th>
                                    <th className="text-right py-3 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e9ecef]">
                                {[
                                    { id: "#1847", date: "Feb 9, 2026", status: "Pending", total: "$434.00" },
                                    { id: "#1803", date: "Feb 1, 2026", status: "Delivered", total: "$189.00" },
                                    { id: "#1765", date: "Jan 25, 2026", status: "Delivered", total: "$245.00" },
                                ].map((order) => (
                                    <tr key={order.id} className="hover:bg-[#f8f9fa] transition-colors">
                                        <td className="py-3 px-6 text-sm font-medium text-[#0f1419]">
                                            <Link href={`/admin/orders/${order.id.replace('#', '')}`} className="hover:text-[#c9a961]">
                                                {order.id}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-6 text-sm text-[#6c757d]">{order.date}</td>
                                        <td className="py-3 px-6">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-sm font-medium text-[#0f1419] text-right">{order.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Notes */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display text-lg text-[#0f1419]">Admin Notes</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-[#f8f9fa] p-4 rounded-lg flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#0f1419] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    Me
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-bold text-[#0f1419]">You</span>
                                        <span className="text-xs text-[#6c757d]">Just now</span>
                                    </div>
                                    <p className="text-sm text-[#495057]">VIP Customer. Always expedite shipping for her orders. She prefers WhatsApp communication.</p>
                                </div>
                            </div>

                            <textarea
                                rows={2}
                                placeholder="Add a new note..."
                                className="w-full p-2.5 bg-white border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:border-[#c9a961]"
                            />
                            <div className="text-right">
                                <button className="px-4 py-2 bg-[#0f1419] text-white rounded-lg text-xs font-medium hover:bg-black transition-colors">
                                    Add Note
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-sm font-bold text-[#0f1419] mb-4 uppercase tracking-wider">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-[#6c757d]" />
                                <a href="mailto:sarah@example.com" className="text-sm text-[#0f1419] hover:text-[#c9a961]">sarah@example.com</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-[#6c757d]" />
                                <span className="text-sm text-[#0f1419]">+971 50 123 4567</span>
                            </div>
                        </div>
                    </div>

                    {/* Default Address */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-sm font-bold text-[#0f1419] mb-4 uppercase tracking-wider">Default Address</h3>
                        <div className="p-3 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] text-sm text-[#495057]">
                            <p className="font-medium text-[#0f1419] mb-1">Home</p>
                            <p>Building 23, Al Barsha</p>
                            <p>Dubai, UAE 12345</p>
                        </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-sm font-bold text-[#0f1419] mb-4 uppercase tracking-wider">Preferences</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-[#f8f9fa] border border-[#e9ecef] rounded text-xs text-[#6c757d]">Abayas</span>
                            <span className="px-2 py-1 bg-[#f8f9fa] border border-[#e9ecef] rounded text-xs text-[#6c757d]">Size M</span>
                            <span className="px-2 py-1 bg-[#f8f9fa] border border-[#e9ecef] rounded text-xs text-[#6c757d]">Black</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
