"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Package, Filter } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { profileService } from "@/lib/profileService";

const statusColors = {
    pending: "border-gray-200 text-gray-500 bg-gray-50",
    processing: "border-blue-200 text-blue-600 bg-blue-50",
    shipped: "border-[#d4af37]/30 text-[#d4af37] bg-[#d4af37]/5",
    delivered: "border-green-200 text-green-600 bg-green-50",
    cancelled: "border-red-200 text-red-600 bg-red-50",
    returned: "border-orange-200 text-orange-600 bg-orange-50",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchQuery, statusFilter, orders]);

    const loadOrders = async () => {
        try {
            const data = await profileService.getOrders(50);
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter((order) =>
                order.id.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
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

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                        Order History
                    </h1>
                    <p className="text-neutral-gray">
                        Track and manage all your orders in one place
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl border border-neutral-sand p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Search */}
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray group-focus-within:text-[#d4af37] transition-colors" size={16} strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Locate by order ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative group">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray group-focus-within:text-[#d4af37] transition-colors" size={16} strokeWidth={1.5} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-10 py-2.5 bg-neutral-cream/30 border border-neutral-sand rounded-xl focus:outline-none focus:border-[#d4af37]/50 focus:bg-white transition-all text-sm font-medium text-primary-dark appearance-none cursor-pointer"
                            >
                                <option value="all">Comprehensive History</option>
                                <option value="pending">Pending Review</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">In Transit</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="returned">Returned</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-gray">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/account/orders/${order.id}`}
                                className="block bg-white rounded-2xl border border-neutral-sand p-6 hover:border-[#d4af37]/30 transition-all group shadow-sm hover:shadow-md"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                                    {/* Order Info */}
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-xl bg-neutral-cream border border-neutral-sand/50 overflow-hidden shrink-0 group-hover:border-[#d4af37]/20 transition-colors">
                                            {order.items?.[0]?.product?.images?.[0]?.url ? (
                                                <img
                                                    src={order.items[0].product.images[0].url}
                                                    alt=""
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package className="text-neutral-gray/40" size={32} strokeWidth={1} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="font-display text-lg font-semibold text-primary-dark">
                                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                                </p>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColors[order.status as keyof typeof statusColors] || statusColors.pending
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-neutral-gray mb-3 font-medium">
                                                Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <p className="text-[10px] uppercase tracking-wider text-neutral-gray flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                                                {order.items?.length || 0} {order.items?.length === 1 ? "Curated Item" : "Curated Items"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status & Total */}
                                    <div className="flex items-center justify-between md:justify-end gap-10 pt-4 md:pt-0 border-t md:border-t-0 border-neutral-sand/30">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold mb-1">Investment</p>
                                            <p className="text-2xl font-display text-primary-dark">
                                                ${order.total_amount?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-neutral-cream flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-white transition-all">
                                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L5 5L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-neutral-sand p-12 text-center">
                        <Package className="mx-auto mb-4 text-neutral-gray" size={48} />
                        <h3 className="font-display text-xl text-primary-dark mb-2">No orders found</h3>
                        <p className="text-neutral-gray mb-6">
                            {statusFilter !== "all"
                                ? `You don't have any ${statusFilter} orders`
                                : "Start shopping to see your orders here"}
                        </p>
                        <Link
                            href="/collections/new-arrivals"
                            className="inline-block px-6 py-3 bg-primary-dark text-white rounded-lg hover:bg-black transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
}
