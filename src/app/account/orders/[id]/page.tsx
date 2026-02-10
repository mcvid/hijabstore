"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard, Download, RotateCcw } from "lucide-react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { supabase } from "@/lib/supabase";

interface OrderDetailProps {
    params: Promise<{ id: string }>;
}

const statusSteps = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage({ params }: OrderDetailProps) {
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [orderId, setOrderId] = useState<string>("");

    useEffect(() => {
        params.then((resolvedParams) => {
            setOrderId(resolvedParams.id);
            loadOrder(resolvedParams.id);
        });
    }, [params]);

    const loadOrder = async (id: string) => {
        try {
            const { data, error } = await supabase
                .from("orders")
                .select(`
          *,
          profile:profiles(first_name, last_name, email),
          address:addresses(*),
          items:order_items(
            *,
            product:products(name, slug, images:product_images(url, is_primary))
          )
        `)
                .eq("id", id)
                .single();

            if (error) throw error;
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentStep = () => {
        return statusSteps.indexOf(order?.status || "pending");
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

    if (!order) {
        return (
            <ProfileLayout>
                <div className="text-center py-12">
                    <h2 className="font-display text-2xl text-primary-dark mb-4">Order Not Found</h2>
                    <Link href="/account/orders" className="text-primary-gold hover:underline">
                        Back to Orders
                    </Link>
                </div>
            </ProfileLayout>
        );
    }

    const currentStep = getCurrentStep();

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center gap-2 text-neutral-gray hover:text-primary-dark mb-4"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="font-display text-3xl font-semibold text-primary-dark mb-2">
                                Order #{orderId.slice(0, 8).toUpperCase()}
                            </h1>
                            <p className="text-neutral-gray">
                                Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-neutral-sand rounded-lg hover:bg-neutral-cream transition-colors flex items-center gap-2">
                                <Download size={18} />
                                Invoice
                            </button>
                            {order.status === "delivered" && (
                                <button className="px-4 py-2 border border-neutral-sand rounded-lg hover:bg-neutral-cream transition-colors flex items-center gap-2">
                                    <RotateCcw size={18} />
                                    Return
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Timeline */}
                <div className="bg-white rounded-xl border border-neutral-sand p-6">
                    <h3 className="font-semibold text-primary-dark mb-6">Order Status</h3>
                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-sand">
                            <div
                                className="h-full bg-primary-gold transition-all duration-500"
                                style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                            />
                        </div>

                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {statusSteps.map((step, index) => {
                                const isCompleted = index <= currentStep;
                                return (
                                    <div key={step} className="flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${isCompleted
                                                ? "bg-primary-gold border-primary-gold text-white"
                                                : "bg-white border-neutral-sand text-neutral-gray"
                                                }`}
                                        >
                                            {isCompleted ? "✓" : index + 1}
                                        </div>
                                        <span className={`text-xs capitalize ${isCompleted ? "text-primary-dark font-medium" : "text-neutral-gray"}`}>
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Items */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-sand p-6">
                        <h3 className="font-semibold text-primary-dark mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-sand last:border-0">
                                    <div className="w-20 h-20 rounded-lg bg-neutral-sand overflow-hidden shrink-0">
                                        {item.product?.images?.[0]?.url ? (
                                            <img
                                                src={item.product.images[0].url}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="text-neutral-gray" size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-primary-dark mb-1">{item.product?.name}</h4>
                                        <p className="text-sm text-neutral-gray mb-2">Quantity: {item.quantity}</p>
                                        <p className="font-semibold text-primary-dark">
                                            ${item.price_at_purchase?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="mt-6 pt-6 border-t border-neutral-sand space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-gray">Subtotal</span>
                                <span className="text-primary-dark">${order.subtotal?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-gray">Shipping</span>
                                <span className="text-primary-dark">
                                    {order.shipping_cost === 0 ? "FREE" : `$${order.shipping_cost?.toLocaleString()}`}
                                </span>
                            </div>
                            {order.tax_amount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-gray">Tax</span>
                                    <span className="text-primary-dark">${order.tax_amount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-neutral-sand">
                                <span className="text-primary-dark">Total</span>
                                <span className="text-primary-dark">${order.total_amount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-xl border border-neutral-sand p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="text-primary-gold" size={20} />
                                <h3 className="font-semibold text-primary-dark">Shipping Address</h3>
                            </div>
                            {order.address ? (
                                <div className="text-sm text-neutral-gray space-y-1">
                                    <p className="font-medium text-primary-dark">{order.address.recipient_name}</p>
                                    <p>{order.address.address_line_1}</p>
                                    {order.address.address_line_2 && <p>{order.address.address_line_2}</p>}
                                    <p>
                                        {order.address.city}, {order.address.state_province} {order.address.postal_code}
                                    </p>
                                    <p>{order.address.country}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-gray">No address information</p>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-xl border border-neutral-sand p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="text-primary-gold" size={20} />
                                <h3 className="font-semibold text-primary-dark">Payment</h3>
                            </div>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-neutral-gray">Method</span>
                                    <span className="text-primary-dark capitalize">{order.payment_method || "Card"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-gray">Status</span>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${order.payment_status === "paid"
                                            ? "bg-green-100 text-green-700"
                                            : order.payment_status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {order.payment_status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
}
