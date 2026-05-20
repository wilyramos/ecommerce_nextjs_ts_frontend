//File: frontend/src/services/collection-service.ts

import {
    collectionsArraySchema,
    collectionDetailResponseSchema,
    collectionSchema,
    Collection,
    CollectionDetailResponse,
    CreateCollectionPayload,
    UpdateCollectionPayload
} from "../schemas/collection.schema";
import { verifySession } from "../auth/dal";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function authHeaders(includeContentType = true): Promise<HeadersInit> {
    const session = await verifySession();
    if (!session || !session.token) {
        throw new Error("Sesión expirada o inválida.");
    }

    const headers: Record<string, string> = {
        Authorization: `Bearer ${session.token}`,
    };

    if (includeContentType) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

export const collectionService = {
    async getAll(active?: boolean): Promise<Collection[]> {
        const queryParams = active !== undefined ? `?active=${active}` : "";
        const url = `${API_URL}/collections${queryParams}`;

        // Petición pública: solo colecciones activas, se puede cachear
        if (active === true) {
            const res = await fetch(url, { next: { tags: ["collections-list"] } });
            if (!res.ok) throw new Error("Error al obtener las colecciones");
            return collectionsArraySchema.parse(await res.json());
        }

        // Petición admin: incluye auth para ver también las inactivas
        const res = await fetch(url, {
            headers: await authHeaders(false),
            cache: "no-store",
        });
        if (!res.ok) throw new Error("Error al obtener las colecciones");
        return collectionsArraySchema.parse(await res.json());
    },

    async getBySlug(slug: string, page = 1, limit = 20): Promise<CollectionDetailResponse> {
        const res = await fetch(
            `${API_URL}/collections/${slug}?page=${page}&limit=${limit}`,
            { next: { tags: [`collection-${slug}`] } }
        );

        if (!res.ok) throw new Error("Error al obtener la colección");
        return collectionDetailResponseSchema.parse(await res.json());
    },

    async create(payload: CreateCollectionPayload): Promise<Collection> {
        const res = await fetch(`${API_URL}/collections`, {
            method: "POST",
            headers: await authHeaders(),
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al crear la colección");
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
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al actualizar la colección");
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

        // El backend puede devolver { collection } o la colección directamente
        return collectionSchema.parse(data.collection ?? data);
    },

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

    
};

export async function getActiveCollections(): Promise<Collection[]> {
    try {
        return await collectionService.getAll(true);
    } catch (error) {
        console.error("Error fetching public active collections:", error);
        return [];
    }
}