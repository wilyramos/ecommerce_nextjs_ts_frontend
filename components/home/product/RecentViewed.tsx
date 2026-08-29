// File: components/home/product/RecentViewed.tsx

"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/src/store/useRecentlyViewedStore";
import RelatedCarousel from "./RelatedCarousel";
import SectionHeader from "@/components/home/sections/SectionHeader";
import type { ProductWithCategoryResponse } from "@/src/schemas";

interface RecentViewedProps {
    currentProduct?: ProductWithCategoryResponse;
}

export default function RecentViewed({ currentProduct }: RecentViewedProps) {
    const { history, addProduct } = useRecentlyViewedStore();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (currentProduct) {
            addProduct(currentProduct);
        }
    }, [currentProduct, addProduct]);

    if (!isMounted) return null;

    // Si existe un producto actual se excluye, de lo contrario se muestra toda la lista
    const displayProducts = currentProduct
        ? history.filter((p) => p.slug !== currentProduct.slug)
        : history;

    if (displayProducts.length === 0) return null;

    return (
        <section className="w-full py-4">
            <SectionHeader
                title="Vistos recientemente"
            />

            <div className="relative">
                <RelatedCarousel products={displayProducts} />
            </div>
        </section>
    );
}