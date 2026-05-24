// File: frontend/src/services/collection-service.ts

import {
    collectionsArraySchema,
    collectionDetailResponseSchema,
    collectionSchema,
    promotionsArraySchema,
    Collection,
    CollectionDetailResponse,
    CreateCollectionPayload,
    UpdateCollectionPayload,
    CollectionType,
    type CollectionProduct,
} from "../schemas/collection.schema";
import { verifySession } from "../auth/dal";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function authHeaders(includeContentType = true): Promise<HeadersInit> {
    const session = await verifySession();
    const headers: Record<string, string> = {
        Authorization: `Bearer ${session.token}`,
    };
    if (includeContentType) headers["Content-Type"] = "application/json";
    return headers;
}

export const collectionService = {

    // ─── ADMIN ────────────────────────────────────────────────────────────────

    async getAll(filters: { active?: boolean; type?: CollectionType } = {}): Promise<Collection[]> {
        const params = new URLSearchParams();
        if (filters.active !== undefined) params.set("active", String(filters.active));
        if (filters.type) params.set("type", filters.type);

        const res = await fetch(
            `${API_URL}/collections${params.size ? `?${params}` : ""}`,
            { headers: await authHeaders(false), cache: "no-store" }
        );
        if (!res.ok) throw new Error("Error al obtener las colecciones");
        return collectionsArraySchema.parse(await res.json());
    },

    async getById(id: string): Promise<Collection> {
        const res = await fetch(`${API_URL}/collections/${id}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al obtener la colección");
        return collectionSchema.parse(await res.json());
    },

    async create(payload: CreateCollectionPayload): Promise<Collection> {
        const res = await fetch(`${API_URL}/collections`, {
            method: "POST",
            headers: await authHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Error al crear la colección");
        }
        return collectionSchema.parse(await res.json());
    },

    async update(id: string, payload: UpdateCollectionPayload): Promise<Collection> {
        const res = await fetch(`${API_URL}/collections/${id}`, {
            method: "PUT",
            headers: await authHeaders(),
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || "Error al actualizar la colección");
        }
        return collectionSchema.parse(await res.json());
    },

    async delete(id: string): Promise<Collection> {
        const res = await fetch(`${API_URL}/collections/${id}`, {
            method: "DELETE",
            headers: await authHeaders(false),
        });
        if (!res.ok) throw new Error("Error al eliminar la colección");
        const data = await res.json();
        return collectionSchema.parse(data.collection ?? data);
    },

    // ─── PRODUCTOS ────────────────────────────────────────────────────────────

    async addProducts(id: string, productIds: string[]): Promise<void> {
        const res = await fetch(`${API_URL}/collections/${id}/products`, {
            method: "POST",
            headers: await authHeaders(),
            body: JSON.stringify({ productIds }),
        });
        if (!res.ok) throw new Error("Error al agregar productos a la colección");
    },

    async removeProduct(id: string, productId: string): Promise<void> {
        const res = await fetch(`${API_URL}/collections/${id}/products/${productId}`, {
            method: "DELETE",
            headers: await authHeaders(false),
        });
        if (!res.ok) throw new Error("Error al remover el producto de la colección");
    },

    // Dentro de collectionService, después de removeProduct:

    async getProductsPaginated(
        id: string,
        page = 1,
        limit = 20
    ): Promise<{
        products: CollectionProduct[];
        pagination: { total: number; page: number; limit: number; pages: number };
    }> {
        const res = await fetch(
            `${API_URL}/collections/${id}/products/list?page=${page}&limit=${limit}`,
            { headers: await authHeaders(false), cache: "no-store" }
        );
        if (!res.ok) throw new Error("Error al obtener los productos de la colección");
        return res.json();
    },

    // ─── PÚBLICO ──────────────────────────────────────────────────────────────

    async getBySlug(slug: string, page = 1, limit = 20): Promise<CollectionDetailResponse> {
        const res = await fetch(
            `${API_URL}/collections/public/${slug}?page=${page}&limit=${limit}`,
            { next: { tags: [`collection-${slug}`] } }
        );
        if (!res.ok) throw new Error("Colección no encontrada");
        return collectionDetailResponseSchema.parse(await res.json());
    },

    async getActivePromotions(): Promise<Collection[]> {
        const res = await fetch(
            `${API_URL}/collections/public/promotions`,
            { next: { tags: ["promotions-active"] } }
        );
        if (!res.ok) throw new Error("Error al obtener las promociones activas");
        return promotionsArraySchema.parse(await res.json());
    },
};

// ─── HELPERS PARA SERVER COMPONENTS PÚBLICOS ─────────────────────────────────

export async function getActiveCollections(): Promise<Collection[]> {
    try {
        const res = await fetch(
            `${API_URL}/collections/public/active`,
            { next: { tags: ["collections-list"] } }
        );
        if (!res.ok) return [];
        return collectionsArraySchema.parse(await res.json());
    } catch (error) {
        console.error("Error fetching active collections:", error);
        return [];
    }
}

export async function getActivePromotions(): Promise<Collection[]> {
    try {
        return await collectionService.getActivePromotions();
    } catch (error) {
        console.error("Error fetching active promotions:", error);
        return [];
    }
}