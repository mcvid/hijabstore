"use client";
import CategoryManager from "@/components/admin/categories/CategoryManager";

export default function NavbarCategoriesPage() {
    return (
        <CategoryManager
            title="Navbar Navigation"
            subtitle="Manage categories and subcategories displayed in the main site navigation and mega menus."
            filterMode="navbar"
        />
    );
}
