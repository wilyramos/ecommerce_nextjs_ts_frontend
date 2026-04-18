/* File: components/home/product/RecentViewed.tsx */
"use client";

import { useEffect } from "react";
import { useRecentlyViewedStore } from "@/src/store/useRecentlyViewedStore";
import ProductCard from "./ProductCard"; // Your existing component
import type { ProductWithCategoryResponse } from "@/src/schemas";

export default function RecentViewed({ currentProduct }: { currentProduct: ProductWithCategoryResponse }) {
    const { history, addProduct } = useRecentlyViewedStore();
    //
    useEffect(() => {
        if (currentProduct) {
            addProduct(currentProduct);
        }
    }, [currentProduct, addProduct]);

    // 2. Filter out the current product from the display list
    const displayProducts = history.filter((p) => p.slug !== currentProduct.slug);

    if (displayProducts.length === 0) return null;

    return (
        <section className="py-12 bg-[var(--color-bg-primary)]">
            <header className="mb-8 px-2">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-6 w-1 bg-[var(--color-action-primary)] rounded-full" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-text-secondary)]">
                        Tu historial de búsqueda
                    </h3>
                </div>
                <p className="text-[18px] font-black tracking-tighter text-[var(--color-text-primary)] uppercase">
                    Vistos recientemente
                </p>
            </header>

            {/* Premium Grid using ProductCard */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {displayProducts.map((product) => (
                    <div key={product.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}