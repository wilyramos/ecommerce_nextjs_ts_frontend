// File: frontend/src/services/discount-service.ts
import { getTokenOptional } from "../auth/dal";
import {
    DiscountsPaginatedResponseSchema,
    DiscountSchema,
    ValidateCouponResponseSchema,
    type DiscountsPaginatedResponse,
    type CreateDiscountDTO,
    type DiscountResponse,
    type ValidateCouponItem,
    type ValidateCouponResponse,
} from "../schemas/discount.schema";

const API_URL = process.env.API_URL || "http://localhost:4000/api";
const BASE = `${API_URL}/discounts`;

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

export const discountService = {
    async getAllDiscounts(filters: { search?: string; page?: number; limit?: number } = {}): Promise<DiscountsPaginatedResponse> {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const res = await fetch(`${BASE}?${params.toString()}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al obtener lista de cupones");
        }

        const json = await res.json();
        return DiscountsPaginatedResponseSchema.parse(json);
    },

    async createDiscount(dto: CreateDiscountDTO): Promise<DiscountResponse> {
        const res = await fetch(BASE, {
            method: "POST",
            headers: await authHeaders(true),
            body: JSON.stringify(dto),
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al crear el cupón");
        }

        const json = await res.json();
        return DiscountSchema.parse(json.data);
    },

    async toggleStatus(id: string): Promise<DiscountResponse> {
        const res = await fetch(`${BASE}/${id}/toggle`, {
            method: "PATCH",
            headers: await authHeaders(false),
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al cambiar estado del cupón");
        }

        const json = await res.json();
        return DiscountSchema.parse(json.data);
    },

    async deleteDiscount(id: string): Promise<void> {
        const res = await fetch(`${BASE}/${id}`, {
            method: "DELETE",
            headers: await authHeaders(false),
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al eliminar el cupón");
        }
    },

    async validateCoupon(
        code: string,
        subtotal: number,
        cartItems: ValidateCouponItem[],
        userId?: string
    ): Promise<ValidateCouponResponse> {
        const res = await fetch(`${BASE}/validate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, subtotal, cartItems, userId }),
        });

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody?.message || "Error al validar el cupón.");
        }

        const json = await res.json();
        return ValidateCouponResponseSchema.parse(json.data);
    }
};