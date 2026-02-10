import { productService } from "@/lib/products";
import { adminService } from "@/lib/admin";
import StoreListing from "@/components/store/StoreListing";

export default async function WomenCollectionPage() {
    const [products, allCategories] = await Promise.all([
        productService.getProductsByFilter({
            categorySlug: "women",
            limit: 50
        }),
        adminService.getStructuredCategories()
    ]);

    const womenCategory = allCategories.find(c => c.slug === "women");
    const subcategories = womenCategory?.subcategories || [];

    return (
        <StoreListing
            title="Women's Collection"
            subtitle="Discover timeless pieces that celebrate grace, modesty, and contemporary style."
            categorySlug="women"
            initialProducts={products}
            subcategories={subcategories}
            heroBadge="MODERN MODESTY"
        />
    );
}
