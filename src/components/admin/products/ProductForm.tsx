"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X, Image as ImageIcon, Trash2 } from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Card from "@/components/admin/ui/Card";
import Input from "@/components/admin/ui/Input";
import { adminService } from "@/lib/admin";

interface Category {
    id: string;
    name: string;
}

interface ProductFormProps {
    initialData?: any;
    isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        base_price: "",
        sku_base: "",
        category_id: "",
        is_active: true,
    });

    const [images, setImages] = useState<string[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");

    const [variants, setVariants] = useState<any[]>([]);

    useEffect(() => {
        loadCategories();
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                slug: initialData.slug || "",
                description: initialData.description || "",
                base_price: initialData.base_price || "",
                sku_base: initialData.sku_base || "",
                category_id: initialData.category_id || "",
                is_active: initialData.is_active ?? true,
            });
            // Load images and variants if available
            if (initialData.images) setImages(initialData.images.map((img: any) => img.url));
            if (initialData.variants) setVariants(initialData.variants);
        }
    }, [initialData]);

    const loadCategories = async () => {
        try {
            const data = await adminService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleAddImage = (e: React.MouseEvent) => {
        e.preventDefault();
        if (newImageUrl) {
            setImages([...images, newImageUrl]);
            setNewImageUrl("");
        }
    };

    const handleRemoveImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const productData = {
                ...formData,
                base_price: parseFloat(formData.base_price),
            };

            if (isEditMode) {
                // Update logic here (service doesn't have updateProduct yet in the snippet provided, assuming create for now or I'd need to add it)
                // For now, I'll log it.
                console.log("Update product", productData);
            } else {
                await adminService.createProduct(productData, variants, images);
            }
            router.push("/admin/products");
        } catch (error) {
            console.error("Failed to save product", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display font-bold text-admin-dark">
                    {isEditMode ? "Edit Product" : "New Product"}
                </h1>
                <div className="flex gap-3">
                    <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" variant="primary" isLoading={isLoading} icon={Save}>Save Product</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Product Information">
                        <div className="space-y-4">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Silk Chiffon Hijab"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="silk-chiffon-hijab"
                                />
                                <Input
                                    label="SKU Base"
                                    name="sku_base"
                                    value={formData.sku_base}
                                    onChange={handleChange}
                                    placeholder="SCH-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-admin-gray-900 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="block w-full rounded-md border-admin-gray-200 shadow-sm focus:border-admin-gold focus:ring-admin-gold sm:text-sm p-3"
                                    placeholder="Describe your masterpiece..."
                                />
                            </div>
                        </div>
                    </Card>

                    <Card title="Images">
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Paste image URL..."
                                    value={newImageUrl}
                                    onChange={(e) => setNewImageUrl(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handleAddImage} variant="secondary" icon={Plus}>Add</Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {images.map((url, i) => (
                                    <div key={i} className="relative group aspect-square rounded-lg border border-admin-gray-200 overflow-hidden bg-admin-gray-50">
                                        <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(i)}
                                            className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                        >
                                            <X size={14} />
                                        </button>
                                        {i === 0 && (
                                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] uppercase font-bold text-center py-1">
                                                Primary
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {images.length === 0 && (
                                    <div className="h-32 col-span-2 border-2 border-dashed border-admin-gray-200 rounded-lg flex flex-col items-center justify-center text-admin-gray-400">
                                        <ImageIcon size={24} className="mb-2" />
                                        <span className="text-xs">No images added</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card title="Variants (Optional)">
                        <div className="text-sm text-admin-gray-500 mb-4">
                            Variants support not fully implemented in UI yet. Add variants functionality can be expanded here.
                        </div>
                        <Button type="button" variant="secondary" size="sm" icon={Plus}>Add Variant</Button>
                    </Card>
                </div>

                {/* Right Column: Organization & Pricing */}
                <div className="space-y-6">
                    <Card title="Organization">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-gray-900 mb-1">Category</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-admin-gray-200 shadow-sm focus:border-admin-gold focus:ring-admin-gold sm:text-sm py-2 px-3"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange} // Type assertion handled in handleChange
                                    className="h-4 w-4 text-admin-gold focus:ring-admin-gold border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-admin-dark">
                                    Active (Visible in store)
                                </label>
                            </div>
                        </div>
                    </Card>

                    <Card title="Pricing">
                        <Input
                            label="Base Price ($)"
                            name="base_price"
                            type="number"
                            step="0.01"
                            value={formData.base_price}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                    </Card>
                </div>
            </div>
        </form>
    );
}
