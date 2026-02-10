import { productService } from "@/lib/products";
import StoreListing from "@/components/store/StoreListing";

export default async function WomenCollectionPage() {
    const products = await productService.getProductsByFilter({
        categorySlug: "women",
        limit: 50
    });

    return (
        <StoreListing
            title="Women's Collection"
            subtitle="Discover timeless pieces that celebrate grace, modesty, and contemporary style."
            categorySlug="women"
            initialProducts={products}
            heroBadge="MODERN MODESTY"
        />
    );
}
