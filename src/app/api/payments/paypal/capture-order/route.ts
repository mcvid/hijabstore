import { NextResponse } from 'next/server';
import { paypalClient } from '@/lib/paypal';
import { OrdersController } from '@paypal/paypal-server-sdk';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processOrderPostPayment } from '@/lib/order-utils';

export async function POST(req: Request) {
    try {
        const { paypalOrderId, orderId } = await req.json();

        if (!paypalOrderId) {
            return NextResponse.json({ error: 'Missing PayPal Order ID' }, { status: 400 });
        }

        // 1. Capture the payment
        const ordersController = new OrdersController(paypalClient);
        const collect = {
            id: paypalOrderId,
            prefer: 'return=representation',
        };

        const { result } = await ordersController.captureOrder(collect);

        if (result.status === 'COMPLETED') {
            // 2. Update Order in DB
            const { error: updateError } = await supabaseAdmin
                .from('orders')
                .update({
                    payment_status: 'Paid',
                    status: 'Processing',
                    updated_at: new Date().toISOString()
                })
                .eq('id', orderId);

            if (updateError) {
                console.error('PayPal Update DB Error:', updateError);
            }

            // 3. Post-payment processing (Inventory, Loyalty, Email)
            await processOrderPostPayment(orderId);

            // 4. Log Payment Event
            await supabaseAdmin.from('payment_events').insert({
                order_id: orderId,
                event_type: 'paypal.completed',
                provider: 'paypal',
                raw_data: result,
                external_id: result.id
            });

            return NextResponse.json({ status: 'COMPLETED' });
        } else {
            return NextResponse.json({ status: result.status }, { status: 400 });
        }

    } catch (error: any) {
        console.error('PayPal Capture Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
