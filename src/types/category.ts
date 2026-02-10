export interface CategoryDisplaySettings {
    showInMainNav: boolean;
    showInMegaMenu: boolean;
    showInMobile: boolean;
    icon?: string;
    featuredImage?: string;
    description?: string;
}

export interface MegaMenuSettings {
    layout: 'featured-grid' | 'list' | 'mixed';
    featuredSubcategories?: string[]; // IDs of subcategories to feature
    showAllLink: boolean;
    columns?: number;
}

export interface CategorySEO {
    metaTitle: string;
    metaDescription: string;
    canonical?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    is_featured?: boolean;
    parentId?: string | null;
    order: number;
    status: 'active' | 'hidden';
    displaySettings: CategoryDisplaySettings;
    megaMenuSettings?: MegaMenuSettings;
    seo?: CategorySEO;
    subcategories?: Category[];
    productCount?: number;
}
