import { supabase } from './supabase';

export const designService = {
    async getHeroSlides() {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data;
    },

    async updateHeroSlide(id: string, slide: any) {
        const { error } = await supabase
            .from('hero_slides')
            .update(slide)
            .eq('id', id);

        if (error) throw error;
    },

    async addHeroSlide(slide: any) {
        const { error } = await supabase
            .from('hero_slides')
            .insert(slide);

        if (error) throw error;
    },

    async deleteHeroSlide(id: string) {
        const { error } = await supabase
            .from('hero_slides')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async reorderSlides(slides: { id: string, display_order: number }[]) {
        const { error } = await supabase
            .from('hero_slides')
            .upsert(slides);

        if (error) throw error;
    },

    // Homepage Sections
    async getHomepageSections() {
        // Assume sections are stored in a site_config or a specific sections table
        // For now, let's fetch from a JSON-based site_config if available, 
        // or just return metadata for sections if they are hardcoded and orderable.
        const { data, error } = await supabase
            .from('site_config')
            .select('*')
            .eq('key', 'homepage_sections')
            .single();

        if (error) {
            // Log for debugging but don't break the UI
            console.warn("Design Service Fetch Warning:", error.message);

            // PGRST116: No rows found
            // 42P01: Table not found in Postgres
            // Message-based check for schema cache issues (common in newly created tables)
            if (
                error.code === 'PGRST116' ||
                error.code === '42P01' ||
                error.message?.includes('schema cache') ||
                error.message?.includes('not find the table')
            ) {
                return [];
            }
            throw error;
        }
        return data?.value || [];
    },

    async updateHomepageSections(sections: any[]) {
        const { error } = await supabase
            .from('site_config')
            .upsert({
                key: 'homepage_sections',
                value: sections,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
    }
};
