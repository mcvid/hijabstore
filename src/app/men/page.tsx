import { productService } from "@/lib/products";
import { adminService } from "@/lib/admin";
import StoreListing from "@/components/store/StoreListing";

export default async function MenCollectionPage() {
    const [products, allCategories] = await Promise.all([
        productService.getProductsByFilter({
            categorySlug: "men",
            limit: 50
        }),
        adminService.getStructuredCategories()
    ]);

    const menCategory = allCategories.find(c => c.slug === "men");
    const subcategories = menCategory?.subcategories || [];

    return (
        <StoreListing
            title="Men's Collection"
            subtitle="Premium thobes, caps, and accessories for the modern Muslim gentleman."
            categorySlug="men"
            initialProducts={products}
            subcategories={subcategories}
            heroBadge="DISTINGUISHED STYLE"
            heroTheme="dark"
        />
    );
}
