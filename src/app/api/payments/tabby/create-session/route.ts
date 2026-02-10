import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const TABBY_API_KEY = process.env.TABBY_PUBLIC_KEY || ''; // Usually Tabby uses Public/Secret keys
const TABBY_SECRET_KEY = process.env.TABBY_SECRET_KEY || '';
const TABBY_API_URL = 'https://api.tabby.ai/api/v2/checkout';

export async function POST(req: Request) {
    try {
        const { items, shippingAddress, userId, email, phone, total, currency = 'AED' } = await req.json();

        // 1. Create Order in Supabase
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .insert({
                user_id: userId || null,
                total_amount: total,
                currency: currency.toUpperCase(),
                payment_status: 'Unpaid',
                status: 'Pending',
                payment_provider: 'tabby'
            })
            .select()
            .single();

        if (orderError) {
            console.error('Tabby Order DB Error:', orderError);
            return NextResponse.json({ error: 'Failed to record order' }, { status: 500 });
        }

        // 2. Create Tabby Checkout Session
        const payload = {
            payment: {
                amount: total.toFixed(2),
                currency: currency.toUpperCase(),
                description: `Order #${order.order_number} from Yasmin Fashions`,
                buyer: {
                    phone: phone || '',
                    email: email,
                    name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
                },
                shipping_address: {
                    city: shippingAddress.city,
                    address: shippingAddress.address,
                    zip: shippingAddress.postalCode,
                },
                order: {
                    tax_amount: (total * 0.05).toFixed(2), // Assuming 5% tax
                    shipping_amount: (total > 500 ? 0 : 25).toFixed(2),
                    discount_amount: "0.00",
                    updated_at: new Date().toISOString(),
                    reference_id: order.id,
                    items: items.map((item: any) => ({
                        title: item.name,
                        description: item.name,
                        quantity: item.quantity,
                        unit_price: item.price.toFixed(2),
                        discount_amount: "0.00",
                        reference_id: item.id,
                        image_url: item.image,
                        product_url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${item.id}`,
                    })),
                },
            },
            lang: "en",
            merchant_code: process.env.TABBY_MERCHANT_CODE || 'yasminfashions',
            merchant_urls: {
                success: `${process.env.NEXT_PUBLIC_SITE_URL}/order-confirmation?orderId=${order.id}`,
                cancel: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=cancelled`,
                failure: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?status=failed`,
            },
        };

        const response = await fetch(TABBY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TABBY_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Tabby API Error:', result);
            return NextResponse.json({ error: result.error || 'Tabby Session Creation Failed' }, { status: response.status });
        }

        // 3. Update Order with Tabby Payment ID
        await supabaseAdmin
            .from('orders')
            .update({ tabby_payment_id: result.id })
            .eq('id', order.id);

        return NextResponse.json({
            id: result.id,
            redirect_url: result.web_url,
            orderId: order.id
        });

    } catch (error: any) {
        console.error('Tabby API Integration Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
