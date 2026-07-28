// File: frontend/src/services/order-service.ts
import { getTokenOptional } from "../auth/dal";
import {
    OrderApiResponseSchema,
    OrderPaginatedApiResponseSchema,
    OrderStatsApiResponseSchema,
    type CreateOrderDTO,
    type OrderResponse,
    type OrderPaginatedApiResponse,
    type OrderFilters,
    type OrderStatus,
    type PaymentStatus,
    type OrderShopifyStats,
    OrderStatusOnlyResponseSchema
} from "@/src/schemas/order.schema";

const API_URL = process.env.API_URL || "http://localhost:4000/api";
const BASE = `${API_URL}/orders/v2`;

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
    async createOrder(dto: CreateOrderDTO): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}`,
            OrderApiResponseSchema,
            {
                method: "POST",
                headers: await authHeaders(),
                body: JSON.stringify(dto),
            }
        );
        return response.data;
    },

    async getOrderById(id: string): Promise<OrderResponse> {
        const res = await fetch(`${BASE}/${id}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener el detalle de la orden");

        const parsed = OrderApiResponseSchema.parse(await res.json());
        return parsed.data;
    },

    async getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
        const res = await fetch(`${BASE}/number/${orderNumber}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener la orden");

        const parsed = OrderApiResponseSchema.parse(await res.json());
        return parsed.data;
    },

    async getMyOrders(page = 1, limit = 10): Promise<OrderPaginatedApiResponse> {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        return apiFetch<OrderPaginatedApiResponse>(
            `${BASE}/my?${params}`,
            OrderPaginatedApiResponseSchema,
            { headers: await authHeaders(false) }
        );
    },

    async getGuestOrders(email: string, page = 1, limit = 10): Promise<OrderPaginatedApiResponse> {
        const params = new URLSearchParams({ email, page: String(page), limit: String(limit) });
        return apiFetch<OrderPaginatedApiResponse>(
            `${BASE}/guest?${params}`,
            OrderPaginatedApiResponseSchema
        );
    },

    async getOrderStatusByNumber(orderNumber: string): Promise<{ status: OrderStatus; paymentStatus?: PaymentStatus }> {
        const response = await apiFetch<{ ok: true; data: { status: OrderStatus; payment?: { status: PaymentStatus } } }>(
            `${BASE}/number/${orderNumber}/status`,
            OrderStatusOnlyResponseSchema,
            { headers: await authHeaders(false) }
        );

        return {
            status: response.data.status,
            paymentStatus: response.data.payment?.status
        };
    },

    // ─── ADMIN ────────────────────────────────────────────────────────────────

    async getAllOrders(filters: OrderFilters = {}): Promise<{
        orders: OrderResponse[];
        meta: { total: number; page: number; pages: number; limit?: number };
    }> {
        const params = new URLSearchParams();
        if (filters.status) params.set("status", filters.status);
        if (filters.email) params.set("email", filters.email);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        if (filters.from) params.set("from", filters.from);
        if (filters.to) params.set("to", filters.to);

        const res = await fetch(`${BASE}/admin/all${params.size ? `?${params}` : ""}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener las órdenes");

        const parsed = OrderPaginatedApiResponseSchema.parse(await res.json());
        return { orders: parsed.data, meta: parsed.meta };
    },

    async getOrderStats(filters: { from?: string; to?: string } = {}): Promise<OrderShopifyStats> {
        const params = new URLSearchParams();
        if (filters.from) params.set("from", filters.from);
        if (filters.to) params.set("to", filters.to);

        const res = await fetch(`${BASE}/admin/stats${params.size ? `?${params}` : ""}`, {
            headers: await authHeaders(false),
            cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener estadísticas de las órdenes");

        const parsed = OrderStatsApiResponseSchema.parse(await res.json());
        return parsed.data;
    },

    async updateOrderStatus(id: string, status: string, reason?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/admin/${id}/status`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: await authHeaders(),
                body: JSON.stringify({ status, reason }),
            }
        );
        return response.data;
    },

    async assignTracking(id: string, trackingNumber: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/admin/${id}/tracking`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: await authHeaders(),
                body: JSON.stringify({ trackingNumber }),
            }
        );
        return response.data;
    },

    async refundOrder(id: string, reason?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/admin/${id}/refund`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: await authHeaders(),
                body: JSON.stringify({ reason }),
            }
        );
        return response.data;
    },

    async cancelOrder(id: string, reason?: string): Promise<OrderResponse> {
        const response = await apiFetch<{ ok: true; data: OrderResponse }>(
            `${BASE}/${id}/cancel`,
            OrderApiResponseSchema,
            {
                method: "PATCH",
                headers: await authHeaders(),
                body: JSON.stringify({ reason }),
            }
        );
        return response.data;
    },

    // En frontend/src/services/order-service.ts

    getOrdersPDFUrl(
        orderIds: string[],
        type: 'packing_slip' | 'sale_note' | 'shipping_label' = 'packing_slip',
        format: 'A4' | 'thermal_80mm' = 'A4'
    ): string {
        const params = new URLSearchParams({
            ids: orderIds.join(","),
            type,
            format,
        });
        return `/api/admin/orders/pdf?${params.toString()}`;
    }

    // async triggerCleanupExpiredOrders(hours = 24): Promise<{ canceledCount: number }> {
    //     const response = await apiFetch<{ ok: true; data: { canceledCount: number } }>(
    //         `${BASE}/admin/cleanup-expired`,
    //         {
    //             safeParse: (d: any) => ({ success: true, data: d })
    //         },
    //         {
    //             method: "POST",
    //             headers: await authHeaders(),
    //             body: JSON.stringify({ hours }),
    //         }
    //     );
    //     return response.data;
    // }
};