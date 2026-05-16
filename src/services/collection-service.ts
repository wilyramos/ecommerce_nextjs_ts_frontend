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

// Helper centralizado para cabeceras de autenticación en el Service
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
        const res = await fetch(`${API_URL}/collections${queryParams}`, {
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener las colecciones");
        const data = await res.json();
        
        return collectionsArraySchema.parse(data);
    },

    async getBySlug(slug: string, page = 1, limit = 20): Promise<CollectionDetailResponse> {
        const res = await fetch(`${API_URL}/collections/${slug}?page=${page}&limit=${limit}`, {
            next: { tags: [`collection-${slug}`] }
        });

        if (!res.ok) throw new Error("Error al obtener la colección");
        const data = await res.json();

        return collectionDetailResponseSchema.parse(data);
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
        const data = await res.json();

        return collectionSchema.parse(data);
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
        const data = await res.json();

        return collectionSchema.parse(data);
    },

    async delete(id: string): Promise<Collection> {
        const res = await fetch(`${API_URL}/collections/${id}`, {
            method: "DELETE",
            headers: await authHeaders(false),
        });

        if (!res.ok) throw new Error("Error al eliminar la colección");
        const data = await res.json();

        return collectionSchema.parse(data.collection);
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
    }
};