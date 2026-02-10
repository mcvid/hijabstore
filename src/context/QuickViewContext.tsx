"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DbProduct } from '@/lib/products';

interface QuickViewContextType {
    isOpen: boolean;
    product: DbProduct | null;
    openQuickView: (product: DbProduct) => void;
    closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export function QuickViewProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [product, setProduct] = useState<DbProduct | null>(null);

    const openQuickView = (product: DbProduct) => {
        setProduct(product);
        setIsOpen(true);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    };

    const closeQuickView = () => {
        setIsOpen(false);
        // Restore body scroll
        document.body.style.overflow = 'unset';
        // Cleanup product after animation
        setTimeout(() => setProduct(null), 300);
    };

    return (
        <QuickViewContext.Provider value={{ isOpen, product, openQuickView, closeQuickView }}>
            {children}
        </QuickViewContext.Provider>
    );
}

export function useQuickView() {
    const context = useContext(QuickViewContext);
    if (context === undefined) {
        throw new Error('useQuickView must be used within a QuickViewProvider');
    }
    return context;
}
