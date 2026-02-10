import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder';

if (!stripeSecretKey) {
    console.warn('STRIPE_SECRET_KEY is missing in environment variables.');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover', // Use a stable version
});
