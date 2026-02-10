import { supabaseAdmin } from './supabaseAdmin';

export async function processOrderPostPayment(orderId: string) {
    try {
        // 1. Fetch Order and its items
        const { data: order, error: orderError } = await supabaseAdmin
            .from('orders')
            .select('*, order_items(*)')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            console.error('Error fetching order for post-processing:', orderError);
            return;
        }

        const items = (order as any).order_items || [];

        // 2. Reduce Inventory for each item
        for (const item of items) {
            if (item.variant_id) {
                // Decrement stock_quantity in product_variants
                const { error: stockError } = await supabaseAdmin.rpc('decrement_variant_stock', {
                    row_id: item.variant_id,
                    qty: item.quantity
                });

                if (stockError) {
                    console.error(`Error reducing stock for variant ${item.variant_id}:`, stockError);
                }
            }
        }

        // 3. Award Loyalty Points (1 point per 10 AED/USD)
        if (order.user_id) {
            const pointsToAward = Math.floor(Number(order.total_amount) / 10);

            if (pointsToAward > 0) {
                // Get current points
                const { data: profile } = await supabaseAdmin
                    .from('profiles')
                    .select('points')
                    .eq('id', order.user_id)
                    .single();

                const newBalance = (profile?.points || 0) + pointsToAward;

                // Update profile
                await supabaseAdmin
                    .from('profiles')
                    .update({
                        points: newBalance,
                        lifetime_spent: Number(order.total_amount) + (profile as any)?.lifetime_spent || 0,
                        total_orders: ((profile as any)?.total_orders || 0) + 1
                    })
                    .eq('id', order.user_id);

                // Create loyalty transaction
                await supabaseAdmin.from('loyalty_transactions').insert({
                    user_id: order.user_id,
                    points: pointsToAward,
                    transaction_type: 'earned',
                    reason: `Points earned from Order #${order.order_number}`,
                    order_id: order.id,
                    balance_after: newBalance
                });
            }
        }

        // 4. Send Confirmation Email (Placeholder for now)
        console.log(`Order ${orderId} post-processing complete.`);

    } catch (error) {
        console.error('Order post-processing error:', error);
    }
}
