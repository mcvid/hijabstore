import { NextResponse } from 'next/server';
import { paypalClient } from '@/lib/paypal';
import { OrdersController } from '@paypal/paypal-server-sdk';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
    try {
        const { items, userId, email, total } = await req.json();

        // 1. Create Order in Supabase
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId || null,
                total_amount: total,
                payment_status: 'Unpaid',
                status: 'Pending',
                payment_provider: 'paypal'
            })
            .select()
            .single();

        if (orderError) {
            console.error('PayPal Order DB Error:', orderError);
            return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
        }

        // 2. Create PayPal Order
        const ordersController = new OrdersController(paypalClient);
        const collect = {
            body: {
                intent: 'CAPTURE',
                purchaseUnits: [
                    {
                        amount: {
                            currencyCode: 'USD', // Convert AED to USD if needed, or use AED if supported
                            value: total.toString(),
                        },
                        description: `Nūr Boutique Order #${order.order_number}`,
                        referenceId: order.id,
                    },
                ],
            },
            prefer: 'return=representation',
        };

        const { result } = await ordersController.createOrder(collect as any);

        // 3. Update Order with PayPal Order ID
        await supabaseAdmin
            .from('orders')
            .update({ paypal_order_id: result.id })
            .eq('id', order.id);

        return NextResponse.json({
            id: result.id,
            orderId: order.id
        });

    } catch (error: any) {
        console.error('PayPal Create Order Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
