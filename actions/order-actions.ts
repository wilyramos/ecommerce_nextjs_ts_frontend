// File: frontend/src/actions/order.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSession, getTokenOptional } from "@/src/auth/dal";
import { orderService } from "@/src/services/order-service";
import {
    CreateOrderDTOSchema,
    OrderStatusEnum,
    type OrderResponse,
    type OrderStatus,
    type PaymentStatus,
} from "@/src/schemas/order.schema";

export type ActionState<T = unknown> =
    | { ok: true; data: T; error?: never }
    | { ok: false; error: string; data?: never };

export type PaginatedOrdersState = ActionState<{
    orders: OrderResponse[];
    total: number;
    page: number;
    pages: number;
}>;

function toErrorState(err: unknown): ActionState<never> {
    const message = err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.";
    return { ok: false, error: message };
}

// ════════════════════════════════════════════════════════════════════════════
// 1. CREAR ORDEN (guest o autenticado)
// ════════════════════════════════════════════════════════════════════════════

export async function createOrderAction(
    _prevState: ActionState<OrderResponse> | undefined,
    formData: FormData
): Promise<ActionState<OrderResponse>> {
    const raw = formData.get("payload");
    if (!raw || typeof raw !== "string") {
        return { ok: false, error: "El formulario está incompleto." };
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return { ok: false, error: "Formato de datos inválido." };
    }

    const validation = CreateOrderDTOSchema.safeParse(parsed);
    if (!validation.success) {
        const first = validation.error.errors[0];
        return { ok: false, error: first?.message ?? "Datos inválidos." };
    }

    const token = await getTokenOptional();

    try {
        const order = await orderService.createOrder(validation.data, token);
        redirect(`/checkout/payment?orderNumber=${order.orderNumber}`);
    } catch (err) {
        const errorWithDigest = err as { digest?: string };
        if (errorWithDigest?.digest?.startsWith("NEXT_REDIRECT")) throw err;
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 2. OBTENER ORDEN POR NÚMERO (Confirmación / Tracking público)
// ════════════════════════════════════════════════════════════════════════════

export async function getOrderByNumberAction(
    orderNumber: string
): Promise<ActionState<OrderResponse>> {
    const token = await getTokenOptional();
    try {
        const order = await orderService.getOrderByNumber(orderNumber, token);
        return { ok: true, data: order };
    } catch (err) {
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 3. MIS ÓRDENES (Usuario autenticado)
// ════════════════════════════════════════════════════════════════════════════

export async function loadMyOrdersAction(
    _prevState: PaginatedOrdersState | undefined,
    formData: FormData
): Promise<PaginatedOrdersState> {
    const session = await getSession();
    if (!session) return { ok: false, error: "Debes iniciar sesión para ver tus órdenes." };

    const page = Number(formData.get("page")) || 1;
    const limit = Number(formData.get("limit")) || 10;

    try {
        const response = await orderService.getMyOrders(session.token, page, limit);
        return { ok: true, data: { orders: response.data, ...response.meta } };
    } catch (err) {
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 4. ÓRDENES DE INVITADO por email
// ════════════════════════════════════════════════════════════════════════════

export async function loadGuestOrdersAction(
    _prevState: PaginatedOrdersState | undefined,
    formData: FormData
): Promise<PaginatedOrdersState> {
    const email = (formData.get("email") as string | null)?.trim();
    if (!email) return { ok: false, error: "Ingresa tu correo electrónico." };

    const page = Number(formData.get("page")) || 1;
    const limit = Number(formData.get("limit")) || 10;

    try {
        const response = await orderService.getGuestOrders(email, page, limit);
        return { ok: true, data: { orders: response.data, ...response.meta } };
    } catch (err) {
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 5. CANCELAR ORDEN (Soporta motivo de auditoría)
// ════════════════════════════════════════════════════════════════════════════

export async function cancelOrderAction(
    _prevState: ActionState<OrderResponse> | undefined,
    formData: FormData
): Promise<ActionState<OrderResponse>> {
    const session = await getSession();
    if (!session) return { ok: false, error: "Debes iniciar sesión." };

    const orderId = (formData.get("orderId") as string | null)?.trim();
    const reason = (formData.get("reason") as string | null)?.trim() || undefined;
    
    if (!orderId) return { ok: false, error: "ID de orden inválido." };

    try {
        const order = await orderService.cancelOrder(orderId, session.token, reason);
        revalidatePath("/account/orders");
        return { ok: true, data: order };
    } catch (err) {
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 6. ADMIN — Listar todas las órdenes
// ════════════════════════════════════════════════════════════════════════════

export type AdminOrderFiltersInput = {
    status?: OrderStatus;
    email?: string;
    userId?: string;
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
};

export async function getAllOrdersAction(
    filters: AdminOrderFiltersInput = {}
): Promise<PaginatedOrdersState> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    try {
        const response = await orderService.getAllOrders(session.token, filters);
        return { ok: true, data: { orders: response.data, ...response.meta } };
    } catch (err) {
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 7. ADMIN — Actualizar estado de la orden (Soporta motivo de auditoría)
// ════════════════════════════════════════════════════════════════════════════

export async function updateOrderStatusAction(
    _prevState: ActionState<OrderResponse> | undefined,
    formData: FormData
): Promise<ActionState<OrderResponse>> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    const orderId = (formData.get("orderId") as string | null)?.trim();
    const status = (formData.get("status") as string | null)?.trim();
    const reason = (formData.get("reason") as string | null)?.trim() || undefined;

    if (!orderId) return { ok: false, error: "ID de orden requerido." };

    const parsedStatus = OrderStatusEnum.safeParse(status);
    if (!parsedStatus.success) return { ok: false, error: "Estado inválido." };

    try {
        const order = await orderService.updateOrderStatus(orderId, parsedStatus.data, session.token, reason);
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
        return { ok: true, data: order };
    } catch (err) {
        return toErrorState(err);
    }
}

// ════════════════════════════════════════════════════════════════════════════
// 8. ADMIN — Asignar número de tracking
// ════════════════════════════════════════════════════════════════════════════

export async function assignTrackingAction(
    _prevState: ActionState<OrderResponse> | undefined,
    formData: FormData
): Promise<ActionState<OrderResponse>> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    const orderId = (formData.get("orderId") as string | null)?.trim();
    const trackingNumber = (formData.get("trackingNumber") as string | null)?.trim();

    if (!orderId) return { ok: false, error: "ID de orden requerido." };
    if (!trackingNumber) return { ok: false, error: "Número de tracking requerido." };

    try {
        const order = await orderService.assignTracking(orderId, trackingNumber, session.token);
        revalidatePath("/admin/orders");
        revalidatePath(`/admin/orders/${orderId}`);
        return { ok: true, data: order };
    } catch (err) {
        return toErrorState(err);
    }
}

export async function checkOrderStatusAction(
    orderNumber: string
): Promise<ActionState<{ status: OrderStatus; paymentStatus?: PaymentStatus }>> {
    const token = await getTokenOptional();
    
    try {
        const orderStatusData = await orderService.getOrderStatusByNumber(orderNumber, token);
        return { ok: true, data: orderStatusData };
    } catch (err) {
        return toErrorState(err);
    }
}