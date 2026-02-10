import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processOrderPostPayment } from '@/lib/order-utils';

export async function POST(req: Request) {
    try {
        const payload = await req.json();
        const signature = req.headers.get('x-tabby-signature'); // In a real app, verify this signature

        console.log('Tabby Webhook Received:', payload);

        const { id, status, order } = payload;
        const internalOrderId = order?.reference_id;

        if (!internalOrderId) {
            return NextResponse.json({ error: 'Missing internal order ID' }, { status: 400 });
        }

        // 1. Log the event
        await supabaseAdmin.from('payment_events').insert({
            order_id: internalOrderId,
            event_type: `tabby.${status}`,
            provider: 'tabby',
            raw_data: payload,
            external_id: id
        });

        // 2. Update Order Status
        if (status === 'AUTHORIZED' || status === 'CAPTURED') {
            await supabaseAdmin.from('orders').update({
                payment_status: 'Paid',
                status: 'Processing',
                updated_at: new Date().toISOString()
            }).eq('id', internalOrderId);

            // 3. Post-payment processing
            await processOrderPostPayment(internalOrderId);
        } else if (status === 'EXPIRED' || status === 'REJECTED' || status === 'CLOSED') {
            await supabaseAdmin.from('orders').update({
                payment_status: 'Failed',
                status: 'Cancelled',
                updated_at: new Date().toISOString()
            }).eq('id', internalOrderId);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Tabby Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
