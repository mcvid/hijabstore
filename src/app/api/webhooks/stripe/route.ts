import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Stripe from 'stripe';
import { processOrderPostPayment } from '@/lib/order-utils';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (!sig || !endpointSecret) {
            console.error('Missing signature or endpoint secret');
            return NextResponse.json({ error: 'Webhook configuration error' }, { status: 400 });
        }
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const data = event.data.object as any;
    const eventType = event.type;

    try {
        // Log the event
        const orderId = data.metadata?.order_id;

        await supabaseAdmin.from('payment_events').insert({
            order_id: orderId,
            event_type: eventType,
            provider: 'stripe',
            raw_data: data,
            external_id: data.id
        });

        if (eventType === 'payment_intent.succeeded') {

            // 1. Update Order Status
            const { error: updateError } = await supabaseAdmin
                .from('orders')
                .update({
                    payment_status: 'Paid',
                    status: 'Processing',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (updateError) {
                console.error('Error updating order on success:', updateError);
            }

            // 2. Reduce Inventory, Award Loyalty Points, Send Email
            await processOrderPostPayment(orderId);

            console.log(`Payment confirmed for Order: ${orderId}`);
        }

        if (eventType === 'payment_intent.payment_failed') {
            await supabaseAdmin
                .from('orders')
                .update({
                    payment_status: 'Failed',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            console.log(`Payment failed for Order: ${orderId}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

