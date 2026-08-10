// frontend/actions/product-actions-v3.ts
"use server";

import { getTokenOptional } from "@/src/auth/dal";
import { productService } from "@/src/services/product-service-v3";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";

export type ActionState<T = unknown> = {
    ok: boolean;
    message?: string;
    error?: string;
    data?: T;
    errors?: Record<string, string[]>;
} | null;

export async function searchAdminProductsAction(
    query: string,
    limit: number = 10
): Promise<ActionState<ProductSearchResult[]>> {
    const token = await getTokenOptional();

    if (!token) {
        return { ok: false, error: "No autorizado. Inicia sesión como administrador." };
    }

    if (!query || query.trim().length === 0) {
        return { ok: true, data: [] };
    }

    try {
        const results = await productService.searchForAdmin(query, limit, token);
        return { ok: true, data: results };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al realizar la búsqueda de productos.";
        return { ok: false, error: msg };
    }
}