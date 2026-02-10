"use client";
import CategoryManager from "@/components/admin/categories/CategoryManager";

export default function HomepageCategoriesPage() {
    return (
        <CategoryManager
            title="Homepage Departments"
            subtitle="Curate which collections appear on the store's landing page departments grid."
            filterMode="homepage"
        />
    );
}
