import { supabase } from './supabase';

export const adminService = {
    // Stats
    async getDashboardStats() {
        const { data: totalOrders } = await supabase
            .from('orders')
            .select('id', { count: 'exact' });

        const { data: customers } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' });

        const { data: activeProducts } = await supabase
            .from('products')
            .select('id', { count: 'exact' })
            .eq('is_active', true);

        const { data: revenueData } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('payment_status', 'Paid');

        const totalRevenue = (revenueData || []).reduce((acc, curr) => acc + Number(curr.total_amount), 0);

        return {
            totalOrders: totalOrders?.length || 0,
            customers: customers?.length || 0,
            activeProducts: activeProducts?.length || 0,
            totalRevenue: totalRevenue
        };
    },

    // Products
    async getAllProducts() {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name),
                images:product_images(url, is_primary),
                variants:product_variants(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createProduct(product: any, variants: any[], images: string[]) {
        // 1. Insert product
        const { data: newProduct, error: pError } = await supabase
            .from('products')
            .insert({
                name: product.name,
                slug: product.slug,
                description: product.description,
                category_id: product.category_id,
                base_price: product.base_price,
                is_active: product.is_active,
                sku_base: product.sku_base
            })
            .select()
            .single();

        if (pError) throw pError;

        // 2. Insert variants
        if (variants.length > 0) {
            const variantData = variants.map(v => ({
                product_id: newProduct.id,
                sku: v.sku,
                name: v.name,
                price_override: v.price_override,
                stock_quantity: v.stock_quantity,
                attributes: v.attributes
            }));
            const { error: vError } = await supabase.from('product_variants').insert(variantData);
            if (vError) throw vError;
        }

        // 3. Insert images
        if (images.length > 0) {
            const imageData = images.map((url, i) => ({
                product_id: newProduct.id,
                url: url,
                is_primary: i === 0,
                display_order: i
            }));
            const { error: iError } = await supabase.from('product_images').insert(imageData);
            if (iError) throw iError;
        }

        return newProduct;
    },

    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(id, name),
                images:product_images(url, is_primary),
                variants:product_variants(*)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProduct(id: string, updates: any) {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Orders
    async getAllOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profile:profiles(first_name, last_name, email)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async updateOrderStatus(orderId: string, status: string) {
        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);
        if (error) throw error;
    },

    async getOrderDetails(orderId: string) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                profile:profiles(*),
                address:addresses(*),
                items:order_items(
                    *,
                    product:products(
                        name,
                        slug,
                        images:product_images(url, is_primary)
                    )
                )
            `)
            .eq('id', orderId)
            .single();

        if (error) throw error;
        return data;
    },

    // Customers
    async getCustomers() {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                addresses(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getCustomerStats() {
        const { data: vipCount } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .eq('tier', 'VIP');

        const { data: totalCustomers } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' });

        return {
            vipCount: vipCount?.length || 0,
            totalCustomers: totalCustomers?.length || 0
        };
    },

    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('order_index');

        if (error) throw error;
        return data;
    },

    async getStructuredCategories() {
        const categories = await this.getCategories();
        const tree: any[] = [];
        const map: { [key: string]: any } = {};

        categories.forEach(cat => {
            map[cat.id] = { ...cat, subcategories: [] };
        });

        categories.forEach(cat => {
            if (cat.parent_id) {
                if (map[cat.parent_id]) {
                    map[cat.parent_id].subcategories.push(map[cat.id]);
                }
            } else {
                tree.push(map[cat.id]);
            }
        });

        return tree;
    },

    async createCategory(category: any) {
        const { data, error } = await supabase
            .from('categories')
            .insert(category)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateCategory(id: string, updates: any) {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getFeaturedProducts() {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name),
                images:product_images(url, is_primary)
            `)
            .eq('is_featured', true)
            .eq('is_active', true)
            .limit(10);
        if (error) throw error;
        return data.map(p => ({
            ...p,
            price: p.base_price,
            category: p.category?.name || "Collection",
            image: p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || "/images/collection.png"
        }));
    },

    async getFeaturedCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('show_on_homepage', true)
            .order('order_index');
        if (error) throw error;
        return data;
    },

    async getNewArrivals() {
        // Fetch more than needed to apply application-side filtering
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name),
                images:product_images(url, is_primary)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        const now = new Date();
        const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * 60 * 60 * 1000));

        const trueNewArrivals = data.filter(p => new Date(p.created_at) > twoWeeksAgo);

        // If fewer than 10 "true" new arrivals, return top 10 most recent overall
        if (trueNewArrivals.length < 10) {
            return data.slice(0, 10).map(p => ({
                ...p,
                price: p.base_price,
                category: p.category?.name || "Collection",
                image: p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || "/images/collection.png"
            }));
        }

        return trueNewArrivals.map(p => ({
            ...p,
            price: p.base_price,
            category: p.category?.name || "Collection",
            image: p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || "/images/collection.png"
        }));
    },

    async searchProducts(query: string) {
        if (!query || query.length < 2) return [];

        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name),
                images:product_images(url, is_primary)
            `)
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .eq('is_active', true)
            .limit(6);

        if (error) throw error;

        return data.map(p => ({
            ...p,
            price: p.base_price,
            category: p.category?.name || "Collection",
            image: p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url || "/images/collection.png"
        }));
    },

    async deleteCategory(id: string) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
