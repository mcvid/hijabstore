"use client";
import React, { useState } from "react";
import Button from "@/components/common/Button";

interface TabbyTriggerProps {
    total: number;
    formData: any;
    items: any[];
}

export default function TabbyTrigger({ total, formData, items }: TabbyTriggerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTabbyCheckout = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/payments/tabby/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    total,
                    items,
                    email: formData.email,
                    phone: formData.phone,
                    shippingAddress: {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        address: formData.address,
                        city: formData.city,
                        postalCode: formData.postalCode,
                    }
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            if (data.redirect_url) {
                window.location.href = data.redirect_url;
            } else {
                throw new Error("No redirect URL provided by Tabby");
            }
        } catch (err: any) {
            console.error("Tabby Error:", err);
            setError(err.message || "Failed to initialize Tabby. Please try another payment method.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-neutral-cream/40 p-6 border border-neutral-sand/20 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Pay in 4 interest-free payments</span>
                    <img src="https://checkout.tabby.ai/assets/tabby-logo.png" alt="Tabby" className="h-4" />
                </div>
                <p className="text-xs text-neutral-gray font-light">
                    Split your purchase into 4 equal monthly payments with no interest.
                </p>
            </div>
            {error && <p className="text-red-500 text-[10px] text-center">{error}</p>}
            <Button
                variant="primary"
                className="w-full py-6 uppercase tracking-[0.4em] text-xs"
                onClick={handleTabbyCheckout}
                disabled={loading}
            >
                {loading ? "Initializing..." : `Pay with Tabby • AED ${total.toFixed(2)}`}
            </Button>
        </div>
    );
}
