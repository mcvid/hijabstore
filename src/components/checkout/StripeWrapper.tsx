"use client";
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeWrapperProps {
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image: string;
    }[];
    email: string;
    userId?: string;
}

export default function StripeWrapper({ items, email, userId }: StripeWrapperProps) {
    const [clientSecret, setClientSecret] = useState("");
    const [orderId, setOrderId] = useState("");
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch("/api/payments/stripe/create-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                items,
                email,
                userId,
                currency: 'aed'
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setClientSecret(data.clientSecret);
                    setOrderId(data.orderId);
                    setAmount(data.amount);
                }
            })
            .catch(err => {
                console.error("Error creating payment intent:", err);
                setError("Failed to initialize payment.");
            });
    }, [items, email, userId]);

    const appearance = {
        theme: 'stripe' as const,
        variables: {
            colorPrimary: '#B08D57', // primary-gold
            colorBackground: '#FCF9F5', // neutral-cream
            colorText: '#1A1A1A', // primary-dark
            borderRadius: '0px',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    if (error) {
        return <div className="text-red-500 font-light text-sm p-4 text-center">{error}</div>;
    }

    return (
        <div className="stripe-wrapper">
            {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                    <StripePaymentForm amount={amount} orderId={orderId} />
                </Elements>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-8 h-8 border-2 border-primary-gold/30 border-t-primary-gold rounded-full animate-spin" />
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-gray animate-pulse">Initializing Secure Gateway</p>
                </div>
            )}
        </div>
    );
}
