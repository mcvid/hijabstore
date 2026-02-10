"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { adminService } from "@/lib/admin";

export default function EditProductPage() {
    const params = useParams();
    const id = params?.id as string;
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadProduct(id);
        }
    }, [id]);

    const loadProduct = async (productId: string) => {
        try {
            setIsLoading(true);
            const data = await adminService.getProductById(productId);
            setProduct(data);
        } catch (error) {
            console.error("Failed to load product", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-admin-gray-600">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-display text-xl">Loading Masterpiece...</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <p className="text-admin-gray-600">Product not found.</p>
                <Link href="/admin/products" className="text-admin-gold hover:underline mt-2 inline-block">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/admin/products"
                    className="p-2 bg-white border border-admin-gray-200 rounded-lg text-admin-gray-600 hover:text-admin-dark transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <p className="text-sm text-admin-gray-600">Back to Products</p>
                </div>
            </div>
            <ProductForm initialData={product} isEditMode={true} />
        </div>
    );
}
