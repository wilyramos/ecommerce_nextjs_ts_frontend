// File: frontend/actions/checkout.actions.ts
"use server";

import { apiHttpClient } from "@/src/lib/http-client";
import { getTokenOptional } from "@/src/auth/dal";
import { CreateOrderDTO } from "@/src/schemas/order.schema";

export type ActionResponse<T = any> = {
    ok: boolean;
    data?: T;
    error?: string;
};

export async function initializeCheckoutAction(payload: CreateOrderDTO): Promise<ActionResponse> {
    const token = await getTokenOptional();

    try {
        const response = await apiHttpClient.post<{ ok: boolean; data: any }>(
            '/orders/v3/checkout',
            payload,
            { token } // Envía el token si existe (usuario logueado)
        );
        return { ok: true, data: response.data };
    } catch (error: any) {
        console.error("[Server Action] Error en initializeCheckout:", error.message);
        return { ok: false, error: error.message || 'Error al inicializar el checkout' };
    }
}

export async function processChargeAction(orderId: string, tokenId: string): Promise<ActionResponse> {
    const token = await getTokenOptional();

    try {
        const response = await apiHttpClient.post<{ ok: boolean; data: any }>(
            `/orders/v3/${orderId}/charge`,
            { tokenId },
            { token }
        );
        return { ok: true, data: response.data };
    } catch (error: any) {
        console.error("[Server Action] Error en processCharge:", error.message);
        return { ok: false, error: error.message || 'Error al procesar el pago' };
    }
}