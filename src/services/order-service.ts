// File: frontend/src/services/order-service.ts

import {
    OrderApiResponseSchema,
    OrderPaginatedApiResponseSchema,
    type CreateOrderDTO,
    type OrderResponse,
    type OrderPaginatedApiResponse,
    type OrderFilters,
    type OrderStatus,
    type PaymentStatus,
    OrderStatusOnlyResponseSchema
} from "@/src/schemas/order.schema";

const API_URL = process.env.API_URL || "http://localhost:4000/api";
const BASE = `${API_URL}/orders/v2`;

function buildHeaders(token?: string): HeadersInit {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

async function apiFetch<T>(
    url: string,
    schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { message: string } } },
    init?: RequestInit
): Promise<T> {
    const res = await fetch(url, init);

    if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body?.message ?? `Error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
        throw new Error(`Schema mismatch: ${parsed.error?.message ?? "Estructura de datos desconocida"}`);
    }

    return parsed.data as T;
}

export const orderService = {

    async createOrder(dto: CreateOrderDTO, token?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}`,
            OrderApiResponseSchema,
            {
                method: "POST",
                headers: buildHeaders(token),
                body: JSON.stringify(dto),
            }
        );
        return response.data;
    },

    async getOrderById(id: string, token: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/${id}`,
            OrderApiResponseSchema,
            { headers: buildHeaders(token) }
        );
        return response.data;
    },

    async getOrderByNumber(orderNumber: string, token?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/number/${orderNumber}`,
            OrderApiResponseSchema,
            { headers: buildHeaders(token) }
        );
        return response.data;
    },

    async getMyOrders(
        token: string,
        page = 1,
        limit = 10
    ): Promise<OrderPaginatedApiResponse> {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        return apiFetch<OrderPaginatedApiResponse>(
            `${BASE}/my?${params}`,
            OrderPaginatedApiResponseSchema,
            { headers: buildHeaders(token) }
        );
    },

    async getGuestOrders(
        email: string,
        page = 1,
        limit = 10
    ): Promise<OrderPaginatedApiResponse> {
        const params = new URLSearchParams({ email, page: String(page), limit: String(limit) });
        return apiFetch<OrderPaginatedApiResponse>(
            `${BASE}/guest?${params}`,
            OrderPaginatedApiResponseSchema
        );
    },

    async getOrderStatusByNumber(
        orderNumber: string,
        token?: string
    ): Promise<{ status: OrderStatus; paymentStatus?: PaymentStatus }> {
        const response = await apiFetch<{ ok: true; data: { status: OrderStatus; payment?: { status: PaymentStatus } } }>(
            `${BASE}/number/${orderNumber}/status`,
            OrderStatusOnlyResponseSchema,
            { headers: buildHeaders(token) }
        );

        return {
            status: response.data.status,
            paymentStatus: response.data.payment?.status
        };
    },

    // ── Admin ──────────────────────────────────────────────────────────────────

    async getAllOrders(
        token: string,
        filters: Partial<OrderFilters> = {}
    ): Promise<OrderPaginatedApiResponse> {
        const params = new URLSearchParams();
        if (filters.status) params.set("status", filters.status);
        if (filters.email) params.set("email", filters.email);
        if (filters.userId) params.set("userId", filters.userId);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        if (filters.from) params.set("from", filters.from);
        if (filters.to) params.set("to", filters.to);

        return apiFetch<OrderPaginatedApiResponse>(
            `${BASE}/admin/all?${params}`,
            OrderPaginatedApiResponseSchema,
            { headers: buildHeaders(token) }
        );
    },

    /**
     * Actualiza el estado logístico de una orden incluyendo auditoría.
     */
    async updateOrderStatus(
        id: string,
        status: string,
        token: string,
        reason?: string
    ): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/admin/${id}/status`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: buildHeaders(token),
                body: JSON.stringify({ status, reason }),
            }
        );
        return response.data;
    },

    async assignTracking(
        id: string,
        trackingNumber: string,
        token: string
    ): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/admin/${id}/tracking`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: buildHeaders(token),
                body: JSON.stringify({ trackingNumber }),
            }
        );
        return response.data;
    },

    /**
     * Cancela una orden incluyendo auditoría del motivo.
     */
    async cancelOrder(id: string, token: string, reason?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/${id}/cancel`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: buildHeaders(token),
                body: JSON.stringify({ reason }),
            }
        );
        return response.data;
    },
};