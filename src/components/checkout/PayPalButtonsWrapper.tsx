"use client";
import React, { useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from 'next/navigation';

interface PayPalButtonsWrapperProps {
    total: number;
    email: string;
    userId?: string;
}

export default function PayPalButtonsWrapper({ total, email, userId }: PayPalButtonsWrapperProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const initialOptions = {
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD", // PayPal support for AED is limited/region-specific
        intent: "capture",
    };

    return (
        <div className="paypal-buttons-container w-full max-w-md mx-auto">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
                    createOrder={async () => {
                        try {
                            const res = await fetch("/api/payments/paypal/create-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ total, userId, email }),
                            });
                            const data = await res.json();
                            if (data.error) throw new Error(data.error);
                            return data.id;
                        } catch (err: any) {
                            setError(err.message);
                            return "";
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const res = await fetch("/api/payments/paypal/capture-order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    paypalOrderId: data.orderID,
                                    orderId: data.orderID // We might need to store the internal orderId differently if they diverge
                                }),
                            });
                            const captureData = await res.json();
                            if (captureData.status === 'COMPLETED') {
                                router.push(`/order-confirmation?orderId=${data.orderID}`);
                            } else {
                                setError("Payment failed or was not completed.");
                            }
                        } catch (err: any) {
                            setError(err.message);
                        }
                    }}
                    onCancel={() => {
                        console.log("PayPal payment cancelled");
                    }}
                    onError={(err) => {
                        console.error("PayPal Error:", err);
                        setError("An error occurred with PayPal.");
                    }}
                />
            </PayPalScriptProvider>
            {error && <p className="text-red-500 text-xs text-center mt-4 font-light">{error}</p>}
        </div>
    );
}
