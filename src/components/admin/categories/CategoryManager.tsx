"use client";
import React, { useEffect, useState } from "react";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Loader2,
    Image as ImageIcon,
    LayoutGrid,
    ChevronRight,
    Save,
    X,
    Filter
} from "lucide-react";
import { adminService } from "@/lib/admin";

interface CategoryManagerProps {
    title: string;
    subtitle: string;
    filterMode?: "navbar" | "homepage" | "all";
}

export default function CategoryManager({ title, subtitle, filterMode = "all" }: CategoryManagerProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        parent_id: null as string | null,
        order_index: 0,
        is_featured: false,
        show_in_main_nav: true,
        show_on_homepage: false,
        display_settings: {
            featuredImage: "",
            icon: ""
        }
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await adminService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = async (category: any = null) => {
        // Refresh local categories to ensure parents are up to date
        await loadCategories();

        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                image_url: category.image_url || "",
                parent_id: category.parent_id,
                order_index: category.order_index || 0,
                is_featured: category.is_featured,
                show_in_main_nav: category.show_in_main_nav,
                show_on_homepage: category.show_on_homepage || false,
                display_settings: category.display_settings || { featuredImage: "", icon: "" }
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                slug: "",
                description: "",
                image_url: "",
                parent_id: null,
                order_index: categories.length,
                is_featured: false,
                show_in_main_nav: filterMode === "navbar",
                show_on_homepage: filterMode === "homepage",
                display_settings: { featuredImage: "", icon: "" }
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (editingCategory) {
                await adminService.updateCategory(editingCategory.id, formData);
            } else {
                await adminService.createCategory(formData);
            }
            await loadCategories();
            handleCloseModal();
        } catch (error: any) {
            console.error("Failed to save category full error:", error);
            // Improve error extraction for Supabase error objects
            const errorMessage = error.message || (error.error && error.error.message) || error.details || (typeof error === 'string' ? error : "Unknown database error");
            alert(`Error saving category: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? This may affect products assigned to it.")) return;
        try {
            await adminService.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete category:", error);
            alert("Error deleting category.");
        }
    };

    const displayCategories = categories.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        if (filterMode === "navbar") return c.show_in_main_nav;
        if (filterMode === "homepage") return c.show_on_homepage;
        return true;
    });

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-[#6c757d]">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-display text-xl">Organizing Collections...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="font-display text-3xl text-[#0f1419]">{title}</h1>
                    <p className="text-[#6c757d] text-sm mt-1">{subtitle}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-5 py-2.5 bg-[#0f1419] text-white rounded-lg text-sm font-medium hover:bg-black transition-all shadow-md flex items-center gap-2"
                >
                    <Plus size={16} />
                    Add Category
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-[#e9ecef]">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adb5bd]" size={18} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl border border-[#e9ecef] overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8f9fa] border-b border-[#e9ecef]">
                            <th className="px-6 py-4 text-xs font-bold text-[#6c757d] uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#6c757d] uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#6c757d] uppercase tracking-wider">Order</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#6c757d] uppercase tracking-wider">Visibility</th>
                            <th className="px-6 py-4 text-xs font-bold text-[#6c757d] uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e9ecef]">
                        {displayCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-[#f8f9fa]/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#e9ecef] overflow-hidden flex items-center justify-center text-[#adb5bd]">
                                            {category.image_url ? (
                                                <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <LayoutGrid size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-[#0f1419]">{category.name}</p>
                                            <p className="text-xs text-[#6c757d] truncate max-w-[200px]">{category.description || "No description"}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs text-[#6c757d] bg-[#f8f9fa] px-2 py-1 rounded">/{category.slug}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-[#6c757d]">
                                    {category.order_index}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1 items-start">
                                        {category.show_in_main_nav && (
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100">Navbar</span>
                                        )}
                                        {category.show_on_homepage && (
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-100">Homepage</span>
                                        )}
                                        {!category.show_in_main_nav && !category.show_on_homepage && (
                                            <span className="px-2 py-1 bg-neutral-50 text-neutral-500 rounded text-[10px] font-bold uppercase tracking-wider border border-neutral-100">Hidden</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleOpenModal(category)}
                                            className="p-2 text-[#6c757d] hover:text-[#0f1419] hover:bg-white rounded-lg border border-transparent hover:border-[#e9ecef] transition-all"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="p-2 text-[#6c757d] hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {displayCategories.length === 0 && (
                    <div className="py-20 text-center">
                        <LayoutGrid className="mx-auto text-[#e9ecef] mb-4" size={48} />
                        <h3 className="font-display text-xl text-[#0f1419]">No Categories Found</h3>
                        <p className="text-[#6c757d] text-sm mt-1">Try a different search or add a new category.</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-[#e9ecef] flex justify-between items-center bg-[#f8f9fa]">
                            <h2 className="font-display text-xl text-[#0f1419]">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h2>
                            <button onClick={handleCloseModal} className="p-2 hover:bg-white rounded-full transition-colors text-[#6c757d]">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-xs font-bold text-[#6c757d] uppercase tracking-wider">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all"
                                        placeholder="e.g. Silk Hijabs"
                                        value={formData.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
                                            setFormData({ ...formData, name, slug });
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5 col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-[#6c757d] uppercase tracking-wider">Parent Category</label>
                                    <select
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all"
                                        value={formData.parent_id || ""}
                                        onChange={(e) => setFormData({ ...formData, parent_id: e.target.value || null })}
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categories
                                            .filter(c => c.id !== editingCategory?.id)
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.parent_id ? "↳ " : ""}{cat.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5 col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-[#6c757d] uppercase tracking-wider">Order Index</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all"
                                        value={formData.order_index ?? ""}
                                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-[#6c757d] uppercase tracking-wider">Description</label>
                                <textarea
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all resize-none"
                                    placeholder="Brief description of this collection..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#6c757d] uppercase tracking-wider">Hero/Section Image</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all"
                                        placeholder="https://..."
                                        value={formData.image_url}
                                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-[#6c757d] uppercase tracking-wider">Mega Menu Image</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#e9ecef] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c9a961]/20 focus:border-[#c9a961] transition-all"
                                        placeholder="https://..."
                                        value={formData.display_settings.featuredImage}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            display_settings: { ...formData.display_settings, featuredImage: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#e9ecef] text-[#c9a961] focus:ring-[#c9a961]/20"
                                        checked={formData.show_in_main_nav}
                                        onChange={(e) => setFormData({ ...formData, show_in_main_nav: e.target.checked })}
                                    />
                                    <span className="text-sm text-[#0f1419] group-hover:text-[#c9a961] transition-colors">Navbar</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#e9ecef] text-[#c9a961] focus:ring-[#c9a961]/20"
                                        checked={formData.show_on_homepage}
                                        onChange={(e) => setFormData({ ...formData, show_on_homepage: e.target.checked })}
                                    />
                                    <span className="text-sm text-[#0f1419] group-hover:text-[#c9a961] transition-colors">Homepage</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[#e9ecef] text-[#c9a961] focus:ring-[#c9a961]/20"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    />
                                    <span className="text-sm text-[#0f1419] group-hover:text-[#c9a961] transition-colors">Starred</span>
                                </label>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-2.5 border border-[#e9ecef] text-[#0f1419] rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-2.5 bg-[#0f1419] text-white rounded-lg text-sm font-medium hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {editingCategory ? "Update Category" : "Create Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
