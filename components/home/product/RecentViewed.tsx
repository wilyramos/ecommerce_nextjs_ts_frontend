/* File: components/home/product/RecentViewed.tsx */
"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewedStore } from "@/src/store/useRecentlyViewedStore";
import RelatedCarousel from "./RelatedCarousel";
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
        <section className="  w-full py-4">
            <header className="mb-6 px-2">
                <p className="text-md font-bold tracking-tight text-foreground">
                    Vistos recientemente
                </p>
                <div className="border-b-2 border-action-cta w-14 md:w-20 mt-1"></div>
            </header>

            <div className="relative">
                <RelatedCarousel products={displayProducts} />
            </div>
        </section>
    );
}