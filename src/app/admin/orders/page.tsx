"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Filter, Eye, ChevronRight } from "lucide-react";
import { adminService } from "@/lib/admin";
import Button from "@/components/admin/ui/Button";
import Card from "@/components/admin/ui/Card";
import Badge from "@/components/admin/ui/Badge";
import Input from "@/components/admin/ui/Input";

interface Order {
    id: string;
    created_at: string;
    status: string;
    payment_status: string;
    total_amount: number;
    profile: {
        first_name: string;
        last_name: string;
        email: string;
    } | null;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Delivered": return "success";
            case "Shipped": return "info";
            case "Processing": return "warning";
            case "Pending": return "neutral";
            case "Cancelled": return "danger";
            default: return "neutral";
        }
    };

    const getPaymentStatusVariant = (status: string) => {
        return status === "Paid" ? "success" : "warning";
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-admin-dark">Orders</h1>
                    <p className="text-admin-gray-600">Manage customer orders and fulfillment</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search by order ID or customer email..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${statusFilter === status
                                    ? "bg-admin-gold text-white"
                                    : "bg-admin-gray-100 text-admin-gray-600 hover:bg-admin-gray-200"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admin-gray-50 border-b border-admin-gray-200 text-xs text-admin-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Payment</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-gray-100">
                            {isLoading ? (
                                // Loading Skeleton
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-admin-gray-500">
                                        No orders found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-admin-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-admin-dark">
                                                #{order.id.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-admin-dark">
                                                    {order.profile?.first_name} {order.profile?.last_name}
                                                </p>
                                                <p className="text-xs text-admin-gray-600">{order.profile?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-admin-gray-600">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-admin-dark font-mono">
                                            ${order.total_amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getPaymentStatusVariant(order.payment_status) as any} size="sm">
                                                {order.payment_status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(order.status) as any} size="sm">
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <button
                                                    className="p-2 text-admin-gray-400 hover:text-admin-gold hover:bg-admin-gold/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
