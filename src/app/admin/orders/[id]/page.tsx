"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Printer,
    Mail,
    CheckCircle,
    Clock,
    Package,
    Truck,
    MapPin,
    CreditCard,
    Loader2,
    AlertCircle
} from "lucide-react";
import { adminService } from "@/lib/admin";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const loadOrder = async () => {
        try {
            const data = await adminService.getOrderDetails(resolvedParams.id);
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order detail:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [resolvedParams.id]);

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await adminService.updateOrderStatus(order.id, newStatus);
            await loadOrder(); // Refresh
        } catch (error) {
            alert("Failed to update status");
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-[#6c757d]">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-display text-xl">Retrieving Shipment DNA...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-[#6c757d]">
                <h2 className="font-display text-2xl">Order Not Found</h2>
                <Link href="/admin/orders" className="text-[#c9a961] hover:underline">Return to Gallery</Link>
            </div>
        );
    }

    const timelineSteps = [
        { status: "Pending", icon: Clock, label: "Order Placed" },
        { status: "Processing", icon: Package, label: "Preparation" },
        { status: "Shipped", icon: Truck, label: "Dispatch" },
        { status: "Delivered", icon: CheckCircle, label: "Handover" }
    ];

    const currentStatusIndex = timelineSteps.findIndex(s => s.status === order.status);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/orders"
                        className="p-2 bg-white border border-[#e9ecef] rounded-lg text-[#6c757d] hover:text-[#0f1419] transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="font-display text-2xl text-[#0f1419]">Order #{order.order_number}</h1>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                        order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-[#6c757d] text-sm mt-1">Placed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-[#e9ecef] rounded-lg text-sm font-medium text-[#6c757d] hover:text-[#0f1419] transition-colors flex items-center gap-2">
                        <Printer size={16} />
                        Print Invoice
                    </button>
                    <div className="h-9 w-[1px] bg-[#e9ecef] mx-1 md:block hidden" />
                    <select
                        value={order.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        className="px-4 py-2 bg-[#0f1419] text-white rounded-lg text-sm font-medium focus:outline-none cursor-pointer disabled:opacity-50"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Timeline */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-lg text-[#0f1419] mb-6 pb-4 border-b border-[#e9ecef]">Fulfillment Timeline</h3>

                        <div className="relative">
                            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[#f8f9fa]" />
                            <div className="space-y-8">
                                {timelineSteps.map((step, i) => {
                                    const isCompleted = i < currentStatusIndex || order.status === 'Delivered';
                                    const isActive = order.status === step.status;

                                    return (
                                        <div key={i} className="relative flex items-center gap-6">
                                            <div className={`relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-colors ${isCompleted ? "bg-emerald-500 text-white" :
                                                isActive ? "bg-[#c9a961] text-white animate-pulse" :
                                                    "bg-[#f8f9fa] text-[#6c757d]"
                                                }`}>
                                                <step.icon size={20} />
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-bold ${isActive ? "text-[#c9a961]" : "text-[#0f1419]"}`}>
                                                    {step.label}
                                                </h4>
                                                <p className="text-xs text-[#6c757d]">
                                                    {isCompleted ? "Completed" : isActive ? "Current Stage" : "Upcoming"}
                                                </p>
                                            </div>
                                            {isActive && i < timelineSteps.length - 1 && (
                                                <button
                                                    onClick={() => handleStatusUpdate(timelineSteps[i + 1].status)}
                                                    className="ml-auto px-4 py-1.5 bg-[#0f1419] text-white text-xs font-medium rounded hover:bg-black transition-colors"
                                                >
                                                    Mark as {timelineSteps[i + 1].status}
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-lg text-[#0f1419] mb-6 pb-4 border-b border-[#e9ecef]">Luxury Contents</h3>
                        <div className="space-y-6">
                            {(order.items || []).map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-16 h-20 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] flex items-center justify-center overflow-hidden">
                                        {item.product?.images?.[0]?.url ? (
                                            <img src={item.product.images[0].url} alt="" className="object-cover w-full h-full" />
                                        ) : (
                                            <Package size={20} className="text-[#6c757d]" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-[#0f1419]">{item.product?.name}</h4>
                                        <p className="text-xs text-[#6c757d]">Unit: ${Number(item.unit_price).toFixed(2)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium text-[#0f1419]">${Number(item.total_price).toFixed(2)}</div>
                                        <div className="text-xs text-[#6c757d]">Qty: {item.quantity}</div>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t border-[#e9ecef] pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-[#6c757d]">
                                    <span>Subtotal</span>
                                    <span>${(Number(order.total_amount) - Number(order.tax_amount || 0) - Number(order.shipping_amount || 0)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#6c757d]">
                                    <span>Tax</span>
                                    <span>${Number(order.tax_amount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-[#6c757d]">
                                    <span>Shipping</span>
                                    <span className={Number(order.shipping_amount) === 0 ? "text-emerald-600 font-medium" : ""}>
                                        {Number(order.shipping_amount) === 0 ? "Free" : `$${Number(order.shipping_amount).toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-display text-[#0f1419] pt-2 border-t border-[#e9ecef] mt-2">
                                    <span>Grand Total</span>
                                    <span>${Number(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-sm font-bold text-[#0f1419] mb-4 uppercase tracking-wider">Patron Profile</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#f8f9fa] flex items-center justify-center font-bold text-[#0f1419] text-sm border border-[#e9ecef]">
                                {order.profile?.first_name?.[0]}{order.profile?.last_name?.[0]}
                            </div>
                            <div>
                                <h4 className="font-medium text-[#0f1419] text-sm">{order.profile?.first_name} {order.profile?.last_name}</h4>
                                <p className="text-xs text-[#c9a961] uppercase tracking-widest">{order.profile?.tier || 'Blue'} Tier</p>
                            </div>
                            <Link href={`/admin/customers/${order.profile?.id}`} className="ml-auto text-xs font-medium text-[#c9a961] hover:underline">View History</Link>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-[#e9ecef]">
                            <div className="flex items-start gap-3">
                                <Mail size={16} className="text-[#6c757d] mt-0.5" />
                                <a href={`mailto:${order.profile?.email}`} className="text-sm text-[#0f1419] hover:text-[#c9a961]">{order.profile?.email}</a>
                            </div>
                            {order.address && (
                                <div className="flex items-start gap-3">
                                    <MapPin size={16} className="text-[#6c757d] mt-0.5" />
                                    <p className="text-sm text-[#0f1419]">
                                        {order.address.address_line1}, {order.address.address_line2 && <><br />{order.address.address_line2}</>}<br />
                                        {order.address.city}, {order.address.country} {order.address.zip_code}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-sm font-bold text-[#0f1419] mb-4 uppercase tracking-wider">Settlement</h3>
                        <div className="flex items-center gap-3 mb-3">
                            <CreditCard size={18} className="text-[#0f1419]" />
                            <span className="text-sm font-medium text-[#0f1419]">Digital Transaction</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#6c757d]">Authorized on</span>
                            <span className="font-medium text-[#0f1419]">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-[#e9ecef]">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold w-fit ${order.payment_status === 'Paid' ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'}`}>
                                {order.payment_status === 'Paid' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                {order.payment_status}
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white p-6 rounded-xl border border-[#e9ecef] shadow-sm">
                        <h3 className="font-display text-sm font-bold text-[#0f1419] mb-4 uppercase tracking-wider">Internal Notes</h3>
                        <div className="bg-[#f8f9fa] p-3 rounded-lg text-xs text-[#6c757d] mb-3">
                            <span className="font-bold text-[#0f1419]">System:</span> Order flag as high value.
                        </div>
                        <textarea
                            rows={3}
                            placeholder="Add a note..."
                            className="w-full p-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:border-[#c9a961] resize-none"
                        />
                        <button className="w-full mt-2 py-2 bg-white border border-[#e9ecef] rounded-lg text-xs font-medium text-[#0f1419] hover:bg-[#f8f9fa] transition-colors">
                            Add Note
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
