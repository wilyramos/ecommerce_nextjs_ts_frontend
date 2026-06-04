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

// ─── Constantes ───────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
const BASE = `${API_URL}/orders/v2`;

// ─── Helper: fetch autenticado o público ─────────────────────────────────────

function buildHeaders(token?: string): HeadersInit {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

/**
 * Fetch tipado con validación Zod estricta.
 */
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

// ─── Servicio de órdenes ─────────────────────────────────────────────────────

export const orderService = {

    /**
     * Crea una nueva orden (guest o autenticado).
     * El token es opcional para soportar el flujo de invitados tipo Shopify.
     */
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

    /**
     * Obtiene una orden por su ObjectId. Requiere autenticación.
     */
    async getOrderById(id: string, token: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/${id}`,
            OrderApiResponseSchema,
            { headers: buildHeaders(token) }
        );
        return response.data;
    },

    /**
     * Obtiene una orden por su número comercial (ORD-...).
     * Accesible sin autenticación para confirmación de compra de invitados.
     */
    async getOrderByNumber(orderNumber: string, token?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/number/${orderNumber}`,
            OrderApiResponseSchema,
            { headers: buildHeaders(token) }
        );
        return response.data;
    },

    /**
     * Historial paginado del usuario autenticado.
     */
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

    /**
     * Historial de un invitado filtrado por email.
     */
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

    /**
     * Lista todas las órdenes con filtros (admin / vendedor).
     */
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
     * Actualiza el estado logístico de una orden (admin).
     */
    async updateOrderStatus(
        id: string,
        status: string,
        token: string
    ): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/admin/${id}/status`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: buildHeaders(token),
                body: JSON.stringify({ status }),
            }
        );
        return response.data;
    },

    /**
     * Asigna número de tracking a una orden (admin).
     */
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
     * Cancela una orden. Requiere autenticación del propietario o admin.
     */
    async cancelOrder(id: string, token: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/${id}/cancel`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: buildHeaders(token),
            }
        );
        return response.data;
    },
};