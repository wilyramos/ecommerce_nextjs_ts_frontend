//File: frontend/hooks/useRecentProducts.ts

"use client";

import { useEffect, useState } from "react";
import type { ProductWithCategoryResponse } from "@/src/schemas";

const KEY = "recent_products";
const LIMIT = 4;

export function useRecentProducts(product: ProductWithCategoryResponse) {
    const [recent, setRecent] = useState<ProductWithCategoryResponse[]>([]);

    useEffect(() => {
        if (!product) return;

        const stored = JSON.parse(localStorage.getItem(KEY) || "[]");

        const filtered = stored.filter((p: ProductWithCategoryResponse) => p.slug !== product.slug);

        const updated = [product, ...filtered].slice(0, LIMIT);

        localStorage.setItem(KEY, JSON.stringify(updated));

        setRecent(updated.filter((p) => p.slug !== product.slug));

    }, [product]);

    return recent;
}
