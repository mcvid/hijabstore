"use client";
import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import Button from '@/components/common/Button';
import { Lock } from 'lucide-react';

interface StripePaymentFormProps {
    amount: number;
    orderId: string;
}

export default function StripePaymentForm({ amount, orderId }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/order-confirmation?orderId=${orderId}`,
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl">Secure Payment</h3>
                <div className="flex items-center gap-2 text-accent-emerald text-[10px] uppercase tracking-widest font-bold">
                    <Lock className="w-3 h-3" /> Encrypted Transaction
                </div>
            </div>

            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

            <div className="bg-neutral-cream/40 p-6 border border-neutral-sand/20">
                <p className="text-[10px] text-neutral-gray font-light leading-relaxed">
                    Your luxury selection will be processed securely. We accept all major cards, Apple Pay, and Google Pay for your convenience.
                </p>
            </div>

            <Button
                variant="primary"
                type="submit"
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full py-6 uppercase tracking-[0.4em] text-xs group"
            >
                <span id="button-text">
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        `Complete Purchase • AED ${amount.toFixed(2)}`
                    )}
                </span>
            </Button>

            {/* Show any error or success messages */}
            {message && (
                <div id="payment-message" className="text-red-500 text-xs font-light text-center mt-4">
                    {message}
                </div>
            )}
        </form>
    );
}
