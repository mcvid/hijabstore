"use client";
import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { DbProduct } from '@/lib/products';

interface ProductInfoProps {
    product: DbProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    return (
        <div className="border-b border-[#e8e3dc] pb-8 mb-8">
            {/* Breadcrumbs / Meta */}
            <div className="flex items-center justify-between text-xs text-[#6b6b6b] mb-4 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <Link href="/" className="hover:text-[#c9a961]">Home</Link>
                    <span>/</span>
                    <Link href={`/${product.category?.parent?.slug || product.category?.slug}`} className="hover:text-[#c9a961]">
                        {product.category?.parent?.name || product.category?.name || 'Collection'}
                    </Link>
                </div>
                {product.is_featured && <span className="text-[#c9a961] font-bold">Featured</span>}
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl text-[#1a1a1a] mb-4 leading-tight">
                {product.name}
            </h1>

            {/* Reviews (Placeholder) */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-[#c9a961]">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={16} className="fill-current" />)}
                </div>
                <Link href="#reviews" className="text-sm text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#6b6b6b] hover:border-[#6b6b6b] transition-colors">
                    4.9 (24 reviews)
                </Link>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
                <div className="flex items-baseline gap-4">
                    <span className="font-display text-3xl font-medium text-[#c9a961]">
                        {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.base_price)}
                    </span>
                    {/* <span className="text-lg text-[#6b6b6b] line-through">AED 250.00</span> */}
                    {/* <span className="bg-[#c77d5b] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Save 24%</span> */}
                </div>

                {/* Installments Placeholder */}
                <p className="text-xs text-[#6b6b6b]">
                    or 4 interest-free payments of <strong>{new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(product.base_price / 4)}</strong> with Tabby
                </p>
            </div>
        </div>
    );
}
