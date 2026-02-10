import { productService } from "@/lib/products";
import StoreListing from "@/components/store/StoreListing";

export default async function NewArrivalsPage() {
    const products = await productService.getProducts(50); // Get latest products (already ordered by created_at desc)

    return (
        <StoreListing
            title="New Arrivals"
            subtitle="Explore our latest additions, freshly crafted for the season."
            categorySlug="new-arrivals" // Doesn't match a real slug, so no filter applied initially
            initialProducts={products}
            heroBadge="JUST IN"
        />
    );
}
