"use client";
import CategoryManager from "@/components/admin/categories/CategoryManager";

export default function CategoriesPage() {
    return (
        <CategoryManager
            title="Category Management"
            subtitle="Organize your product catalog into elegant collections for both the Navbar and Homepage."
            filterMode="all"
        />
    );
}
