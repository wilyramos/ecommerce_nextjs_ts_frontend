/* File: components/home/product/RecentViewed.tsx */
"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/src/store/useRecentlyViewedStore";
import RelatedCarousel from "./RelatedCarousel";
import type { ProductWithCategoryResponse } from "@/src/schemas";

export default function RecentViewed({ currentProduct }: { currentProduct: ProductWithCategoryResponse }) {
    const { history, addProduct } = useRecentlyViewedStore();

    useEffect(() => {
        if (currentProduct) {
            addProduct(currentProduct);
        }
    }, [currentProduct, addProduct]);

    // Filter out the current product from the display list
    const displayProducts = history.filter((p) => p.slug !== currentProduct.slug);

    if (displayProducts.length === 0) return null;

    return (
        <section className="bg-[var(--color-bg-primary)] w-full">
            <header className="mb-8 px-2">
                <p className="text-md tracking-tighter text-[var(--color-text-primary)]">
                    Vistos recientemente
                </p>
                <div>
                    <div className="border-b border-2 border-destructive w-14 md:w-20 mb-4"></div>
                </div>
            </header>

            <div className="relative">
                <RelatedCarousel products={displayProducts} />
            </div>
        </section>
    );
}