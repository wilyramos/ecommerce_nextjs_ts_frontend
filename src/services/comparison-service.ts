// File: frontend/src/services/comparison-service.ts

import { Comparison, ComparisonFormValues } from "../schemas/comparison.schema";
import { verifySession } from "../auth/dal";

const API_URL = process.env.API_URL || "http://localhost:4000/api";

export class ComparisonService {

    static async getAll(filters: {
        isActive?:   boolean;
        isFeatured?: boolean;
        search?:     string;
        limit?:      number;
        page?:       number;
    } = {}) {
        const params = new URLSearchParams();
        if (filters.isActive   !== undefined) params.append("isActive",   String(filters.isActive));
        if (filters.isFeatured !== undefined) params.append("isFeatured", String(filters.isFeatured));
        if (filters.search)                   params.append("search",     filters.search);
        if (filters.limit)                    params.append("limit",      String(filters.limit));
        if (filters.page)                     params.append("page",       String(filters.page));

        const res = await fetch(`${API_URL}/comparisons?${params.toString()}`, {
            next: { tags: ["comparisons"] },
        });

        if (!res.ok) throw new Error("Error al obtener las comparativas");
        return res.json();
    }

    static async getBySlug(slug: string): Promise<{ status: string; data: Comparison | null }> {
        const res = await fetch(`${API_URL}/comparisons/slug/${slug}`, {
            next: { tags: [`comparison-${slug}`], revalidate: 3600 },
        });

        if (res.status === 404) return { status: "not_found", data: null };
        if (!res.ok) throw new Error("Error al obtener la comparativa");
        return res.json();
    }

    static async getById(id: string): Promise<{ status: string; data: Comparison }> {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            headers: { Authorization: `Bearer ${session.token}` },
            next:    { tags: [`comparison-${id}`] },
        });

        if (!res.ok) throw new Error("Comparativa no encontrada");
        return res.json();
    }

    static async getRelatedToProduct(
        productId: string,
        limit?: number
    ): Promise<{ status: string; data: Comparison[] }> {
        const params = limit ? `?limit=${limit}` : "";
        const res = await fetch(`${API_URL}/comparisons/product/${productId}${params}`, {
            next: { tags: [`product-comparisons-${productId}`] },
        });

        if (!res.ok) throw new Error("Error al obtener comparativas del producto");
        return res.json();
    }

    static async create(data: ComparisonFormValues) {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons`, {
            method:  "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:  `Bearer ${session.token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al crear la comparativa");
        return result;
    }

    static async update(id: string, data: Partial<ComparisonFormValues>) {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method:  "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization:  `Bearer ${session.token}`,
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al actualizar la comparativa");
        return result;
    }

    static async delete(id: string) {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method:  "DELETE",
            headers: { Authorization: `Bearer ${session.token}` },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al eliminar la comparativa");
        return result;
    }
}