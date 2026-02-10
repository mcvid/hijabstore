"use client";
import React, { useState } from 'react';
import { DbProduct } from '@/lib/products';

interface ProductGalleryProps {
    images: { url: string; is_primary: boolean; }[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Fallback if images array is empty or undefined
    const safeImages = images && images.length > 0 ? images : [{ url: '/images/placeholder-product.jpg', is_primary: true }];

    // Sort so primary is first
    const sortedImages = [...safeImages].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));

    const displayImage = selectedImage || sortedImages[0].url;

    return (
        <div className="sticky top-24 self-start space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-[#e8e3dc] overflow-hidden group cursor-zoom-in">
                <img
                    src={displayImage}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {sortedImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img.url)}
                            className={`aspect-square overflow-hidden border-2 transition-all ${displayImage === img.url
                                    ? 'border-[#c9a961]'
                                    : 'border-transparent hover:border-[#e8e3dc]'
                                }`}
                        >
                            <img
                                src={img.url}
                                alt={`${productName} view ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
