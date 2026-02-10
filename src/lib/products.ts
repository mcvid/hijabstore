import { supabase } from './supabase';

export interface DbProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    category_id: string;
    base_price: number;
    is_active: boolean;
    is_featured: boolean;
    created_at: string;
    images?: { url: string; is_primary: boolean }[];
    category?: { name: string; slug: string; parent?: { name: string; slug: string } };
    variants?: { id: string; name: string; price_override: number; stock_quantity: number; attributes: any }[];
}

export const productService = {
    async getProducts(limit = 10, categorySlug?: string) {
        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug),
                images:product_images(url, is_primary)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (categorySlug) {
            // Filter by category slug if provided
            const { data: cat } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', categorySlug)
                .single();

            if (cat) {
                query = query.eq('category_id', cat.id);
            }
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as DbProduct[];
    },

    async getProductBySlug(slug: string) {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug, parent_id),
                images:product_images(url, is_primary),
                variants:product_variants(*)
            `)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data as DbProduct;
    },

    async getFeaturedCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('is_featured', true);

        if (error) throw error;
        return data;
    },

    async getProductsByFilter(filter: { categorySlug?: string; limit?: number }) {
        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(
                    name, 
                    slug, 
                    parent:categories(slug)
                ),
                images:product_images(url, is_primary)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (filter.limit) {
            query = query.limit(filter.limit);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Perform client-side filtering for category hierarchy if needed
        let products = data as any[];

        if (filter.categorySlug) {
            products = products.filter(product => {
                const directMatch = product.category?.slug === filter.categorySlug;
                const parentMatch = product.category?.parent?.slug === filter.categorySlug;
                return directMatch || parentMatch;
            });
        }

        return products as DbProduct[];
    }
};
