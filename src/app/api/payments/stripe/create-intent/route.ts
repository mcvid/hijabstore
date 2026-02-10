import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const { items, shippingAddress, userId, email, currency = 'aed' } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        // 1. Calculate Total (Server-side validation)
        // In a real app, you would fetch prices from the DB
        // For this demo, we'll trust the items but enforce the logic
        const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
        const shipping = subtotal > 500 ? 0 : 25;
        const tax = subtotal * 0.05;
        const total = subtotal + shipping + tax;

        // Stripe expects amount in smallest currency unit (cents/fils)
        const amount = Math.round(total * 100);

        // 2. Create Order in Pending State
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId || null,
                total_amount: total,
                tax_amount: tax,
                shipping_amount: shipping,
                currency: currency.toUpperCase(),
                payment_status: 'Unpaid',
                status: 'Pending',
                payment_provider: 'stripe'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Order creation error:', orderError);
            return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
        }

        // 3. Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                order_id: order.id,
                customer_email: email,
            },
        });

        // 4. Update Order with Payment Intent ID
        await supabaseAdmin
            .from('orders')
            .update({ payment_intent_id: paymentIntent.id })
            .eq('id', order.id);

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            orderId: order.id,
            amount: total
        });

    } catch (error: any) {
        console.error('Stripe Intent Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
