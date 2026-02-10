import React from "react";
import Link from "next/link";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

// Mock data
const recentOrders = [
    { id: "#ORD-7235", customer: "Amira K.", product: "Silk Chiffon Hijab (Rose)", amount: "$45.00", status: "Delivered", date: "2 mins ago" },
    { id: "#ORD-7234", customer: "Sarah M.", product: "Luxury Abaya (Black)", amount: "$120.00", status: "Processing", date: "15 mins ago" },
    { id: "#ORD-7233", customer: "Layla H.", product: "Premium Jersey Set", amount: "$85.00", status: "Shipped", date: "1 hour ago" },
    { id: "#ORD-7232", customer: "Noor A.", product: "Gold Plated Pin Set", amount: "$25.00", status: "Pending", date: "3 hours ago" },
    { id: "#ORD-7231", customer: "Fatima R.", product: "Modal Cotton Hijab", amount: "$35.00", status: "Delivered", date: "5 hours ago" },
];

export default function RecentOrdersWidget() {
    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Delivered": return "success";
            case "Processing": return "info";
            case "Shipped": return "warning"; // Or primary
            case "Pending": return "neutral";
            default: return "neutral";
        }
    };

    return (
        <Card className="h-full flex flex-col" footer={
            <Link href="/admin/orders" className="flex items-center text-admin-gold hover:text-admin-dark transition-colors font-medium">
                View All Orders <ArrowRight size={16} className="ml-2" />
            </Link>
        }>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-display font-semibold text-admin-dark">Recent Orders</h3>
                    <p className="text-sm text-admin-gray-600">Latest transactions from your store</p>
                </div>
                <button className="text-admin-gray-400 hover:text-admin-dark">
                    <MoreHorizontal size={20} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs text-admin-gray-500 uppercase tracking-wider border-b border-admin-gray-100">
                            <th className="pb-3 pl-2 font-medium">Order ID</th>
                            <th className="pb-3 font-medium">Customer</th>
                            <th className="pb-3 font-medium hidden sm:table-cell">Product</th>
                            <th className="pb-3 font-medium">Amount</th>
                            <th className="pb-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="group hover:bg-admin-gray-100/50 transition-colors border-b border-admin-gray-50 last:border-0">
                                <td className="py-3 pl-2 font-mono text-admin-gray-600 group-hover:text-admin-dark">{order.id}</td>
                                <td className="py-3 font-medium text-admin-dark">{order.customer}</td>
                                <td className="py-3 text-admin-gray-600 hidden sm:table-cell truncate max-w-[150px]">{order.product}</td>
                                <td className="py-3 font-mono text-admin-dark">{order.amount}</td>
                                <td className="py-3">
                                    <Badge variant={getStatusVariant(order.status) as any} size="sm">
                                        {order.status}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
