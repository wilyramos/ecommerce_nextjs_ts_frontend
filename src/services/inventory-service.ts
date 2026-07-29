// File: frontend/src/services/inventory-service.ts

import { getTokenOptional } from "../auth/dal";
import {
    InventoryPaginatedResponseSchema,
    InventoryLogsResponseSchema,
    type InventoryPaginatedResponse,
    type AdjustStockDTO,
    type InventoryLog
} from "../schemas/inventory.schema";

const API_URL = process.env.API_URL || "http://localhost:4000/api";
const BASE = `${API_URL}/inventory`;

async function authHeaders(includeContentType = true): Promise<HeadersInit> {
    const token = await getTokenOptional();
    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (includeContentType) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

export const inventoryService = {
    async getInventory(filters: {
        search?: string;
        filter?: "low" | "out" | "all";
        page?: number;
        limit?: number;
    } = {}): Promise<InventoryPaginatedResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.filter) params.set("filter", filters.filter);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const res = await fetch(`${BASE}?${params.toString()}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al obtener el inventario");
        }

        const json = await res.json();
        return InventoryPaginatedResponseSchema.parse(json);
    },

    async adjustStock(dto: AdjustStockDTO): Promise<void> {
        const res = await fetch(`${BASE}/adjust`, {
            method: "PATCH",
            headers: await authHeaders(),
            body: JSON.stringify(dto),
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al ajustar el stock");
        }
    },

    async getInventoryLogs(limit = 50, productId?: string): Promise<InventoryLog[]> {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (productId) params.set("productId", productId);

        const res = await fetch(`${BASE}/logs?${params.toString()}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al obtener la auditoría de inventario");
        }

        const json = await res.json();
        const parsed = InventoryLogsResponseSchema.parse(json);
        return parsed.data;
    }
};