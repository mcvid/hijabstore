"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { adminService } from "@/lib/admin";
import Button from "@/components/admin/ui/Button";
import Card from "@/components/admin/ui/Card";
import Badge from "@/components/admin/ui/Badge";
import Input from "@/components/admin/ui/Input";

interface Product {
    id: string;
    name: string;
    base_price: number;
    category: { name: string } | null;
    images: { url: string; is_primary: boolean }[];
    is_active: boolean;
    stock_quantity?: number; // Might come from variants sum
    variants?: any[];
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filtercategory, setFilterCategory] = useState("All");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const data = await adminService.getAllProducts();
            setProducts(data);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filtercategory === "All" || product.category?.name === filtercategory;
        return matchesSearch && matchesCategory;
    });

    // Calculate total stock from variants if not on product directly
    const getStock = (product: Product) => {
        if (product.stock_quantity !== undefined) return product.stock_quantity;
        if (product.variants && product.variants.length > 0) {
            return product.variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
        }
        return 0;
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return "danger";
        if (stock < 10) return "warning";
        return "success";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-admin-dark">Products</h1>
                    <p className="text-admin-gray-600">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <Button variant="primary" icon={Plus}>Add Product</Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search products..."
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" icon={Filter} className="whitespace-nowrap">Filter</Button>
                </div>
            </Card>

            {/* Products Table */}
            <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admin-gray-50 border-b border-admin-gray-200 text-xs text-admin-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Stock</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-gray-100">
                            {isLoading ? (
                                // Loading Skeleton
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-admin-gray-500">
                                        No products found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const stock = getStock(product);
                                    const handleDelete = async (id: string) => {
                                        if (!confirm("Are you sure you want to delete this product?")) return;
                                        try {
                                            await adminService.deleteProduct(id);
                                            setProducts(products.filter(p => p.id !== id));
                                        } catch (error) {
                                            console.error("Failed to delete product:", error);
                                            alert("Failed to delete product.");
                                        }
                                    };

                                    return (
                                        <tr key={product.id} className="hover:bg-admin-gray-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-admin-gray-100 border border-admin-gray-200 overflow-hidden shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={product.images?.[0]?.url || "/placeholder-product.png"}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-medium text-admin-dark">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-admin-gray-600">
                                                {product.category?.name || "Uncategorized"}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-admin-dark font-mono">
                                                ${product.base_price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${stock === 0 ? "bg-red-500" : stock < 10 ? "bg-yellow-500" : "bg-green-500"
                                                        }`}></span>
                                                    <span className="text-sm text-admin-gray-600">{stock} in stock</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={product.is_active ? "success" : "neutral"} size="sm">
                                                    {product.is_active ? "Active" : "Draft"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <button className="p-2 text-admin-gray-400 hover:text-admin-gold hover:bg-admin-gold/10 rounded-lg transition-colors" title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-2 text-admin-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
