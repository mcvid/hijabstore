"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    GripVertical,
    Image as ImageIcon,
    Calendar,
    Eye,
    Trash2,
    Edit,
    Loader2,
    Save,
    X
} from "lucide-react";
import { designService } from "@/lib/design";

export default function HeroSlideshowPage() {
    const [slides, setSlides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        try {
            const data = await designService.getHeroSlides();
            setSlides(data);
        } catch (error) {
            console.error("Failed to load slides:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await designService.deleteHeroSlide(id);
            setSlides(slides.filter(s => s.id !== id));
        } catch (error) {
            alert("Delete failed");
        }
    };

    if (isLoading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-[#6c757d]">
                <Loader2 className="animate-spin" size={40} />
                <p className="font-display text-xl">Aligning Visual Sequences...</p>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/design"
                        className="p-2 bg-white border border-[#e9ecef] rounded-lg text-[#6c757d] hover:text-[#0f1419] transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="font-display text-2xl text-[#0f1419]">Hero Slideshow</h1>
                        <p className="text-[#6c757d] text-sm mt-1">Manage the main carousel images and messaging.</p>
                    </div>
                </div>
                <button className="px-5 py-2.5 bg-[#0f1419] text-white rounded-lg text-sm font-medium hover:bg-black transition-all shadow-md flex items-center gap-2">
                    <Plus size={16} />
                    Add New Slide
                </button>
            </div>

            {/* Slides List */}
            <div className="space-y-4 mb-8">
                {slides.length > 0 ? slides.map((slide, index) => (
                    <div key={slide.id} className="bg-white p-4 rounded-xl border border-[#e9ecef] shadow-sm hover:shadow-md transition-all flex items-center gap-6 group">
                        {/* Drag Handle */}
                        <div className="text-[#e9ecef] group-hover:text-[#6c757d] cursor-grab active:cursor-grabbing hover:bg-[#f8f9fa] p-2 rounded">
                            <GripVertical size={20} />
                        </div>

                        {/* Thumbnail */}
                        <div className="w-24 h-16 bg-[#f8f9fa] rounded-lg border border-[#e9ecef] overflow-hidden relative shadow-inner">
                            {slide.image_url ? (
                                <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-[#e9ecef]">
                                    <ImageIcon size={20} />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-medium text-[#0f1419]">{slide.title}</h3>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${slide.is_active
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-red-50 text-red-700 border border-red-100"
                                    }`}>
                                    {slide.is_active ? "Active" : "Hidden"}
                                </span>
                            </div>
                            <p className="text-sm text-[#6c757d] truncate max-w-md">{slide.subtitle}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-[#6c757d] hover:text-[#0f1419] hover:bg-[#f8f9fa] rounded transition-colors">
                                <Edit size={18} />
                            </button>
                            <button
                                onClick={() => handleDelete(slide.id)}
                                className="p-2 text-[#6c757d] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center border-2 border-dashed border-[#e9ecef] rounded-2xl">
                        <ImageIcon className="mx-auto text-[#e9ecef] mb-4" size={48} />
                        <h3 className="font-display text-xl text-[#0f1419]">No Heroism Found</h3>
                        <p className="text-[#6c757d] text-sm mt-1">Add your first slide to define the store's entry experience.</p>
                    </div>
                )}
            </div>

            <div className="bg-[#fff3cd]/50 border border-[#ffeeba] rounded-xl p-4 flex gap-3 text-sm text-[#856404]">
                <div className="min-w-[20px]"><Eye size={20} /></div>
                <p>
                    <strong>Pro Tip:</strong> Use high-resolution images (at least 1920x1080px) for the best results on desktop screens.
                    Video backgrounds are supported for MP4 files under 10MB.
                </p>
            </div>
        </div>
    );
}
