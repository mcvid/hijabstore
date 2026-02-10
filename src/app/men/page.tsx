import { productService } from "@/lib/products";
import StoreListing from "@/components/store/StoreListing";

export default async function MenCollectionPage() {
    const products = await productService.getProductsByFilter({
        categorySlug: "men",
        limit: 50
    });

    return (
        <StoreListing
            title="Men's Collection"
            subtitle="Premium thobes, caps, and accessories for the modern Muslim gentleman."
            categorySlug="men"
            initialProducts={products}
            heroBadge="DISTINGUISHED STYLE"
            heroTheme="dark"
        />
    );
}
