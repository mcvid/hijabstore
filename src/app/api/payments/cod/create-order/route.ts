import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { processOrderPostPayment } from '@/lib/order-utils';
import { verifyHCaptcha } from '@/lib/hcaptcha';

export async function POST(req: Request) {
    try {
        const { items, shippingAddress, userId, email, phone, total, captchaToken } = await req.json();

        // 0. Verify Captcha
        const isCaptchaValid = await verifyHCaptcha(captchaToken);
        if (!isCaptchaValid) {
            return NextResponse.json({ error: 'Invalid or missing Captcha' }, { status: 400 });
        }

        // 1. Create Order in Supabase with COD status
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId || null,
                total_amount: total,
                payment_status: 'Unpaid',
                status: 'Pending',
                payment_provider: 'cod',
                shipping_address: shippingAddress, // Ensure schema supports this or map to columns
                customer_email: email,
                customer_phone: phone
            })
            .select()
            .single();

        if (orderError) {
            console.error('COD Order DB Error:', orderError);
            return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
        }

        // 2. Log Payment Event
        await supabaseAdmin.from('payment_events').insert({
            order_id: order.id,
            event_type: 'order.created',
            provider: 'cod',
            raw_data: { message: 'Order created with Cash on Delivery' },
            external_id: `cod_${order.id}`
        });

        // 3. Insert Order Items
        if (items && items.length > 0) {
            const orderItemsData = items.map((item: any) => ({
                order_id: order.id,
                product_id: item.id, // Assuming item.id is product_id
                variant_id: item.variantId || null,
                quantity: item.quantity,
                unit_price: item.price,
                total_price: item.price * item.quantity
            }));

            const { error: itemsError } = await supabaseAdmin
                .from('order_items')
                .insert(orderItemsData);

            if (itemsError) {
                console.error('Error inserting order items:', itemsError);
                // Continue, but log critical error
            }
        }

        // 4. Post-payment processing (Inventory, Loyalty, Email)
        await processOrderPostPayment(order.id);

        return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.order_number
        });

    } catch (error: any) {
        console.error('COD Integration Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
