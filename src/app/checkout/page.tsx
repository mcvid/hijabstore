"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, CheckCircle, ChevronRight, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import StripeWrapper from "@/components/checkout/StripeWrapper";
import PayPalButtonsWrapper from "@/components/checkout/PayPalButtonsWrapper";
import TabbyTrigger from "@/components/checkout/TabbyTrigger";
import HCaptcha from '@hcaptcha/react-hcaptcha';

type CheckoutStep = "shipping" | "payment" | "review";

export default function CheckoutPage() {
    const [step, setStep] = useState<CheckoutStep>("shipping");
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'tabby' | 'cod'>('stripe');
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const { items, clearCart } = useCart();
    const router = useRouter();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        country: "United Arab Emirates",
        postalCode: "",
        phone: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompleteOrder = async () => {
        if (paymentMethod === 'cod') {
            try {
                const res = await fetch("/api/payments/cod/create-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        total,
                        items,
                        email: formData.email,
                        phone: formData.phone,
                        captchaToken,
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

                clearCart();
                router.push(`/order-confirmation?orderId=${data.orderId}`);
            } catch (err: any) {
                console.error("COD Error:", err);
                alert("Failed to place order. Please try again.");
            }
        }
    };

    const steps = [
        { id: "shipping", title: "Information", icon: Truck },
        { id: "payment", title: "Selection", icon: CreditCard },
        { id: "review", title: "Confirmation", icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-neutral-cream text-primary-dark font-body">
            <Navbar />

            <main className="container mx-auto px-4 py-24 md:py-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Checkout Flow */}
                    <div className="lg:col-span-8">
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto lg:mx-0">
                            {steps.map((s, idx) => (
                                <React.Fragment key={s.id}>
                                    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => {
                                        // Allow going back to previous steps
                                        const stepOrder: CheckoutStep[] = ["shipping", "payment", "review"];
                                        if (stepOrder.indexOf(s.id as CheckoutStep) < stepOrder.indexOf(step)) {
                                            setStep(s.id as CheckoutStep);
                                        }
                                    }}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${step === s.id ? 'bg-primary-dark text-white border-primary-dark shadow-lg ring-4 ring-primary-dark/10' :
                                            steps.findIndex(x => x.id === step) > idx ? 'bg-primary-gold text-white border-primary-gold' : 'bg-transparent border-neutral-sand/60 text-neutral-gray'
                                            }`}>
                                            {steps.findIndex(x => x.id === step) > idx ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${step === s.id ? 'text-primary-dark' : 'text-neutral-gray/60'}`}>
                                            {s.title}
                                        </span>
                                    </div>
                                    {idx < steps.length - 1 && (
                                        <div className={`h-px flex-1 mx-4 transition-colors duration-500 ${steps.findIndex(x => x.id === step) > idx ? 'bg-primary-gold' : 'bg-neutral-sand/40'}`} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Step Content */}
                        <div className="bg-white p-8 md:p-12 border border-neutral-sand/30 shadow-sm min-h-[500px]">
                            <AnimatePresence mode="wait">
                                {step === "shipping" && (
                                    <motion.div
                                        key="shipping"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-6">
                                            <h2 className="font-display text-3xl">Concierge Information</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                                                <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                                                <div className="md:col-span-2">
                                                    <Input label="Email Address" name="email" value={formData.email} onChange={handleInputChange} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <h2 className="font-display text-3xl">Shipping Destination</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <Input label="Street Address" name="address" value={formData.address} onChange={handleInputChange} />
                                                </div>
                                                <Input label="City" name="city" value={formData.city} onChange={handleInputChange} />
                                                <Input label="Country" name="country" value={formData.country} onChange={handleInputChange} />
                                                <Input label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
                                                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                                            </div>
                                        </div>

                                        <div className="pt-8 flex justify-end">
                                            <Button
                                                variant="primary"
                                                className="px-12 py-5 uppercase tracking-[0.3em] text-[11px] group flex items-center gap-3"
                                                onClick={() => setStep("payment")}
                                            >
                                                Next Section <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "payment" && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <h2 className="font-display text-3xl">Payment Selection</h2>
                                                <div className="flex items-center gap-2 text-accent-emerald text-[10px] uppercase tracking-widest font-bold">
                                                    <Lock className="w-3 h-3" /> Secure Transaction
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { id: 'stripe', title: 'Card / Apple Pay / Google Pay', icon: CreditCard },
                                                    { id: 'paypal', title: 'PayPal', icon: CheckCircle },
                                                    { id: 'tabby', title: 'Split into 4 (Tabby)', icon: CheckCircle },
                                                    { id: 'cod', title: 'Cash on Delivery', icon: Truck },
                                                ].map((method) => (
                                                    <button
                                                        key={method.id}
                                                        onClick={() => setPaymentMethod(method.id as 'stripe' | 'paypal' | 'tabby' | 'cod')}
                                                        className={`p-6 border text-left flex items-center justify-between transition-all ${paymentMethod === method.id
                                                            ? 'border-primary-gold bg-primary-gold/5 shadow-sm'
                                                            : 'border-neutral-sand/30 hover:border-primary-gold/50'}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === method.id ? 'bg-primary-gold text-white' : 'bg-neutral-sand/20 text-neutral-gray'}`}>
                                                                <method.icon className="w-5 h-5" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase tracking-widest font-bold">{method.title}</p>
                                                                <p className="text-[9px] text-neutral-gray mt-1">Secure & Encrypted</p>
                                                            </div>
                                                        </div>
                                                        {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-primary-gold" />}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="pt-10 border-t border-neutral-sand/30">
                                                {paymentMethod === 'stripe' && (
                                                    <StripeWrapper
                                                        items={items}
                                                        email={formData.email}
                                                        userId={undefined} // Add userId from auth context if available
                                                    />
                                                )}

                                                {paymentMethod === 'paypal' && (
                                                    <div className="py-8">
                                                        <PayPalButtonsWrapper
                                                            total={total}
                                                            email={formData.email}
                                                            userId={undefined}
                                                        />
                                                    </div>
                                                )}
                                                {paymentMethod === 'tabby' && (
                                                    <div className="py-8">
                                                        <TabbyTrigger
                                                            total={total}
                                                            formData={formData}
                                                            items={items}
                                                        />
                                                    </div>
                                                )}

                                                {paymentMethod === 'cod' && (
                                                    <div className="space-y-6">
                                                        <div className="bg-neutral-cream/40 p-6 border border-neutral-sand/20 space-y-4">
                                                            <div className="flex items-center gap-4">
                                                                <CheckCircle className="w-4 h-4 text-accent-emerald" />
                                                                <p className="text-xs text-neutral-gray font-light">Available for deliveries within the UAE and GCC region.</p>
                                                            </div>
                                                        </div>

                                                        {/* hCaptcha for COD */}
                                                        <div className="flex justify-center">
                                                            <HCaptcha
                                                                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001"}
                                                                onVerify={(token) => setCaptchaToken(token)}
                                                                theme="light"
                                                            />
                                                        </div>

                                                        <Button
                                                            variant="primary"
                                                            className="w-full py-6 uppercase tracking-[0.4em] text-xs"
                                                            onClick={handleCompleteOrder}
                                                            disabled={!captchaToken}
                                                        >
                                                            Place COD Order • AED {total.toFixed(2)}
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-8 flex justify-between">
                                            <button
                                                className="text-[10px] uppercase font-bold tracking-widest text-neutral-gray hover:text-primary-dark transition-colors"
                                                onClick={() => setStep("shipping")}
                                            >
                                                Back to Shipping
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "review" && (
                                    <motion.div
                                        key="review"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-10"
                                    >
                                        <div className="space-y-8">
                                            <h2 className="font-display text-3xl">Final Confirmation</h2>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold">Shipping Destination</h4>
                                                    <div className="text-neutral-gray font-light space-y-1">
                                                        <p className="font-bold text-primary-dark">{formData.firstName} {formData.lastName}</p>
                                                        <p>{formData.address}</p>
                                                        <p>{formData.city}, {formData.postalCode}</p>
                                                        <p>{formData.country}</p>
                                                        <p>{formData.phone}</p>
                                                    </div>
                                                    <button onClick={() => setStep("shipping")} className="text-[10px] text-primary-gold hover:underline font-bold uppercase tracking-widest">Modify</button>
                                                </div>

                                                <div className="space-y-4">
                                                    <h4 className="text-[10px] uppercase tracking-widest text-neutral-gray font-bold">Payment Asset</h4>
                                                    <div className="text-neutral-gray font-light space-y-1">
                                                        <p className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Ending in •••• {formData.cardNumber.slice(-4) || '1234'}</p>
                                                        <p>Expiry: {formData.expiry || '04/28'}</p>
                                                    </div>
                                                    <button onClick={() => setStep("payment")} className="text-[10px] text-primary-gold hover:underline font-bold uppercase tracking-widest">Modify</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 flex flex-col gap-6">
                                            <Button
                                                variant="primary"
                                                className="w-full py-6 uppercase tracking-[0.4em] text-xs"
                                                onClick={handleCompleteOrder}
                                            >
                                                Complete Purchase • AED {total.toFixed(2)}
                                            </Button>
                                            <p className="text-center text-[10px] text-neutral-gray font-light italic">
                                                By completing this selection, you acknowledge the terms of Yasmin Fashions.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-white p-8 border border-neutral-sand/30 shadow-sm sticky top-32 space-y-8">
                            <h3 className="font-display text-2xl pb-4 border-b border-neutral-sand/30 underline decoration-primary-gold/30">Your Selection</h3>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-20 bg-neutral-sand flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold truncate">{item.name}</h4>
                                            <p className="text-[10px] text-neutral-gray uppercase tracking-widest">QTY: {item.quantity}</p>
                                            <p className="text-xs text-primary-gold font-bold mt-1">AED {(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-neutral-sand/30 space-y-3">
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-gray font-light">Subtotal</span>
                                    <span>AED {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-gray font-light">Shipping</span>
                                    <span>{shipping === 0 ? 'Complimentary' : `AED ${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-gray font-light">VAT</span>
                                    <span>AED {tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 flex justify-between items-end">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Total</span>
                                    <span className="font-display text-2xl text-primary-gold">AED {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-gray ml-1">{label}</label>
            <input
                {...props}
                className="w-full bg-neutral-cream/20 border-b border-neutral-sand focus:border-primary-gold p-3 text-sm font-light transition-all outline-none"
            />
        </div>
    );
}
