import { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
    {
        id: "CAT_WOMEN",
        name: "Women",
        slug: "women",
        parentId: null,
        order: 1,
        status: "active",
        displaySettings: {
            showInMainNav: true,
            showInMegaMenu: true,
            showInMobile: true,
            description: "Elegant modest wear for women"
        },
        megaMenuSettings: {
            layout: "mixed",
            featuredSubcategories: ["CAT_WOMEN_ABAYAS", "CAT_WOMEN_HIJABS", "CAT_WOMEN_KAFTANS", "CAT_WOMEN_GIFTSETS"],
            showAllLink: true
        },
        subcategories: [
            {
                id: "CAT_WOMEN_ABAYAS",
                name: "Abayas",
                slug: "abayas",
                parentId: "CAT_WOMEN",
                order: 1,
                status: "active",
                productCount: 45,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/luxury-abaya.png"
                }
            },
            {
                id: "CAT_WOMEN_HIJABS",
                name: "Hijabs",
                slug: "hijabs",
                parentId: "CAT_WOMEN",
                order: 2,
                status: "active",
                productCount: 32,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/silk-hijab.png"
                }
            },
            {
                id: "CAT_WOMEN_KAFTANS",
                name: "Kaftans",
                slug: "kaftans",
                parentId: "CAT_WOMEN",
                order: 3,
                status: "active",
                productCount: 18,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/collection.png"
                }
            },
            {
                id: "CAT_WOMEN_PHIRAN",
                name: "Phiran",
                slug: "phiran",
                parentId: "CAT_WOMEN",
                order: 4,
                status: "active",
                productCount: 8,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_SCARVES",
                name: "Scarves",
                slug: "scarves",
                parentId: "CAT_WOMEN",
                order: 5,
                status: "active",
                productCount: 24,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_GIFTSETS",
                name: "Gift Sets",
                slug: "gift-sets",
                parentId: "CAT_WOMEN",
                order: 6,
                status: "active",
                productCount: 12,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/perfume.png" // Fallback
                }
            },
            {
                id: "CAT_WOMEN_PERL",
                name: "Perl",
                slug: "perl",
                parentId: "CAT_WOMEN",
                order: 7,
                status: "active",
                productCount: 5,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_NIQAB",
                name: "Niqab",
                slug: "niqab",
                parentId: "CAT_WOMEN",
                order: 8,
                status: "active",
                productCount: 14,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_ROBES",
                name: "Robes",
                slug: "robes",
                parentId: "CAT_WOMEN",
                order: 9,
                status: "active",
                productCount: 9,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_TOPS",
                name: "Tops",
                slug: "tops",
                parentId: "CAT_WOMEN",
                order: 10,
                status: "active",
                productCount: 28,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_KHIMARS",
                name: "Khimars",
                slug: "khimars",
                parentId: "CAT_WOMEN",
                order: 11,
                status: "active",
                productCount: 16,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            },
            {
                id: "CAT_WOMEN_SKIRTS",
                name: "Skirts",
                slug: "skirts",
                parentId: "CAT_WOMEN",
                order: 12,
                status: "active",
                productCount: 11,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true
                }
            }
        ]
    },
    {
        id: "CAT_MEN",
        name: "Men",
        slug: "men",
        parentId: null,
        order: 2,
        status: "active",
        displaySettings: {
            showInMainNav: true,
            showInMegaMenu: true,
            showInMobile: true
        },
        megaMenuSettings: {
            layout: "featured-grid",
            featuredSubcategories: ["CAT_MEN_THOBES", "CAT_MEN_CAPS", "CAT_MEN_TURBAN"],
            showAllLink: true
        },
        subcategories: [
            {
                id: "CAT_MEN_THOBES",
                name: "Thobes",
                slug: "thobes",
                parentId: "CAT_MEN",
                order: 1,
                status: "active",
                productCount: 22,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/hero.png" // Fallback
                }
            },
            {
                id: "CAT_MEN_CAPS",
                name: "Caps",
                slug: "caps",
                parentId: "CAT_MEN",
                order: 2,
                status: "active",
                productCount: 15,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/collection.png" // Fallback
                }
            },
            {
                id: "CAT_MEN_TURBAN",
                name: "Turban",
                slug: "turban",
                parentId: "CAT_MEN",
                order: 3,
                status: "active",
                productCount: 8,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/hero.png" // Fallback
                }
            }
        ]
    },
    {
        id: "CAT_FRAGRANCES",
        name: "Fragrances",
        slug: "fragrances",
        parentId: null,
        order: 3,
        status: "active",
        displaySettings: {
            showInMainNav: true,
            showInMegaMenu: true,
            showInMobile: true
        },
        megaMenuSettings: {
            layout: "featured-grid",
            featuredSubcategories: ["CAT_FRAG_OUD", "CAT_FRAG_ATTARS", "CAT_FRAG_GIFTSETS"],
            showAllLink: true
        },
        subcategories: [
            {
                id: "CAT_FRAG_OUD",
                name: "Oud",
                slug: "oud",
                parentId: "CAT_FRAGRANCES",
                order: 1,
                status: "active",
                productCount: 12,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/perfume.png"
                }
            },
            {
                id: "CAT_FRAG_ATTARS",
                name: "Attars",
                slug: "attars",
                parentId: "CAT_FRAGRANCES",
                order: 2,
                status: "active",
                productCount: 18,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/perfume.png"
                }
            },
            {
                id: "CAT_FRAG_GIFTSETS",
                name: "Gift Sets",
                slug: "gift-sets",
                parentId: "CAT_FRAGRANCES",
                order: 3,
                status: "active",
                productCount: 7,
                displaySettings: {
                    showInMainNav: false,
                    showInMegaMenu: true,
                    showInMobile: true,
                    featuredImage: "/images/perfume.png"
                }
            }
        ]
    }
];
