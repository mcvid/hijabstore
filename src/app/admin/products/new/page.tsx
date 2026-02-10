"use client";
import React from "react";
import ProductForm from "@/components/admin/products/ProductForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
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
            <ProductForm />
        </div>
    );
}
