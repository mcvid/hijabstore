"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Mail,
    Phone,
    MapPin,
    Download,
    Star,
    Crown,
    Loader2
} from "lucide-react";
import { adminService } from "@/lib/admin";

const SEGMENTS = ["All", "VIP", "Blue", "Regular"];

export default function CustomersPage() {
    const [activeSegment, setActiveSegment] = useState("All");
    const [customers, setCustomers] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [custData, statData] = await Promise.all([
                    adminService.getCustomers(),
                    adminService.getCustomerStats()
                ]);
                setCustomers(custData);
                setStats(statData);
            } catch (error) {
                console.error("Failed to load customers:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredCustomers = activeSegment === "All"
        ? customers
        : customers.filter(c => c.tier === activeSegment);

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-[#6c757d]">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-display text-xl">Accessing Customer Identity...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display text-3xl text-[#0f1419]">Customers</h1>
                    <p className="text-[#6c757d] text-sm mt-1">Manage relationships and view customer insights.</p>
                </div>
                <button className="px-5 py-2.5 bg-white border border-[#e9ecef] rounded-lg text-sm font-medium text-[#0f1419] hover:bg-[#f8f9fa] transition-colors shadow-sm flex items-center gap-2">
                    <Download size={16} />
                    Export List
                </button>
            </div>

            {/* Segment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0f1419] p-6 rounded-xl border border-[#0f1419] shadow-md text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Crown className="text-[#c9a961]" size={20} />
                        <h3 className="text-sm font-medium uppercase tracking-wider text-[#c9a961]">VIP Customers</h3>
                    </div>
                    <p className="font-display text-3xl">{stats?.vipCount || 0}</p>
                    <p className="text-xs text-neutral-400 mt-1">High-value members</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Star className="text-amber-500" size={20} />
                        <h3 className="text-sm font-medium uppercase tracking-wider text-[#6c757d]">Total Members</h3>
                    </div>
                    <p className="font-display text-3xl text-[#0f1419]">{stats?.totalCustomers || 0}</p>
                    <p className="text-xs text-[#6c757d] mt-1">Registered accounts</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">+</div>
                        <h3 className="text-sm font-medium uppercase tracking-wider text-[#6c757d]">New Registry</h3>
                    </div>
                    <p className="font-display text-3xl text-[#0f1419]">{stats?.totalCustomers || 0}</p>
                    <p className="text-xs text-emerald-600 mt-1">Live customer sync</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-[#e9ecef] shadow-sm overflow-hidden">
                {/* Segments Tabs */}
                <div className="border-b border-[#e9ecef] px-6 pt-4 flex gap-6 overflow-x-auto">
                    {SEGMENTS.map((segment) => (
                        <button
                            key={segment}
                            onClick={() => setActiveSegment(segment)}
                            className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${activeSegment === segment
                                ? "text-[#c9a961]"
                                : "text-[#6c757d] hover:text-[#0f1419]"
                                }`}
                        >
                            {segment}
                            {activeSegment === segment && (
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c9a961]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="p-4 border-b border-[#e9ecef] flex flex-col md:flex-row gap-4 justify-between items-center bg-[#f8f9fa]/50">
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search name, email, or city..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:border-[#c9a961] transition-all"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6c757d]" size={14} />
                    </div>

                    <button className="px-3 py-2 bg-white border border-[#e9ecef] rounded-lg text-xs font-medium text-[#6c757d] hover:text-[#0f1419] transition-all flex items-center gap-2">
                        <Filter size={14} />
                        More Filters
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#f8f9fa] border-b border-[#e9ecef]">
                            <tr>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Customer</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Contact</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Loyalty</th>
                                <th className="text-left py-4 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-6 text-xs font-semibold text-[#6c757d] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e9ecef]">
                            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#f8f9fa] border border-[#e9ecef] flex items-center justify-center font-bold text-[#0f1419] text-sm">
                                                {customer.first_name?.[0]}{customer.last_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-[#0f1419]">
                                                    <Link href={`/admin/customers/${customer.id}`} className="hover:text-[#c9a961] transition-colors">
                                                        {customer.first_name} {customer.last_name}
                                                    </Link>
                                                </div>
                                                <div className="text-xs text-[#6c757d]">Joined {new Date(customer.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-[#6c757d]">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Mail size={12} /> {customer.email}
                                        </div>
                                        {customer.addresses?.[0] && (
                                            <div className="flex items-center gap-2 text-xs">
                                                <MapPin size={12} /> {customer.addresses[0].city}, {customer.addresses[0].country}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm">
                                        <div className="font-medium text-[#0f1419]">{customer.points || 0} points</div>
                                        <div className="text-[10px] uppercase tracking-widest text-[#6c757d]">{customer.tier || 'Blue'} Tier</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${customer.tier === 'VIP' ? 'bg-[#0f1419] text-[#c9a961] border-[#c9a961]' :
                                            customer.tier === 'Gold' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {customer.tier === 'VIP' && <Crown size={10} />}
                                            {customer.tier || 'Regular'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/customers/${customer.id}`} className="p-2 text-[#6c757d] hover:text-[#0f1419] hover:bg-white rounded transition-colors" title="View Profile">
                                                <Eye size={16} />
                                            </Link>
                                            <button className="p-2 text-[#6c757d] hover:text-[#0f1419] hover:bg-white rounded transition-colors" title="Email">
                                                <Mail size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-[#6c757d] text-sm font-display">
                                        No customers found in this segment.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
