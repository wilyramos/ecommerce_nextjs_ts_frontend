// File: frontend/components/product/ProductGridMini.tsx
"use client";

import ProductCardHome from "../home/product/ProductCardHome";
import type { TApiProduct } from "@/src/schemas";

interface ProductGridMiniProps {
    products: TApiProduct[];
}

export default function ProductGridMini({ products }: ProductGridMiniProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
                <div
                    key={product.slug}
                    className="border border-border rounded-[var(--radius-md)] hover:border-border-hover transition-colors duration-300 overflow-hidden bg-card"
                >
                    <ProductCardHome product={product} />
                </div>
            ))}
        </div>
    );
}