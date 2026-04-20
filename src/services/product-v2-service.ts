//File: frontend/src/services/product-v2-service.ts

import { apiFetch } from "@/lib/api-client";
import { Product } from "@/src/schemas/product.schema";

export const ProductService = {


    // READ: Batch para complementarios
    getBatchByIds: (ids: string[]): Promise<Product[]> =>
        apiFetch(`/products/v2/batch`, {
            method: "POST",
            body: JSON.stringify({ ids }),
            cache: "no-store",
        }),

    search: (query: string): Promise<Product[]> =>
        apiFetch(`/products/v2/search?q=${encodeURIComponent(query)}`, {
            method: "GET",
            cache: "no-store",
        }),
};