/*  
    File: frontend/src/actions/sale-actions.ts 
    @Author: whramos 
    @Date: 11-04-2024
    @Last Modified by: whramos
    @Last Modified time: 11-04-2024
*/

"use server";

import { revalidatePath } from "next/cache";
import { apiServerClient } from "../infrastructure/api/api-server-client";
import {
    createSaleSchema,
    CreateSalePayload,
    Sale
} from "@/src/schemas/sale.schema";

/**
 * Estado para los formularios de acciones (Type-Safe)
 */
export type SaleActionState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    data?: Sale;
};

/**
 * 1. PROCESAR VENTA FINAL (COMPLETED)
 */
export async function createSaleAction(
    _prevState: SaleActionState,
    payload: CreateSalePayload
): Promise<SaleActionState> {
    const validated = createSaleSchema.safeParse(payload);

    if (!validated.success) {
        return {
            success: false,
            message: "Datos de venta inválidos",
            errors: validated.error.flatten().fieldErrors,
        };
    }

    try {
        const res = await apiServerClient<{ success: boolean; sale: Sale; message: string }>(
            "/sales/v2",
            {
                method: "POST",
                body: JSON.stringify(validated.data),
            }
        );

        if (res.success) {
            revalidatePath("/inventory");
            revalidatePath("/sales");
            revalidatePath("/terminal");

            return {
                success: true,
                message: res.message,
                data: res.sale
            };
        }

        return { success: false, message: res.message };

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error crítico al procesar venta";
        return { success: false, message: msg };
    }
}

/**
 * 2. GENERAR PROFORMA (QUOTE)
 */
export async function createQuoteAction(
    _prevState: SaleActionState,
    payload: CreateSalePayload
): Promise<SaleActionState> {
    try {
        const res = await apiServerClient<{ success: boolean; quote: Sale; message: string }>(
            "/sales/v2/quote",
            {
                method: "POST",
                body: JSON.stringify(payload),
            }
        );

        if (res.success) {
            revalidatePath("/sales/quotes");
            return {
                success: true,
                message: "Proforma generada correctamente",
                data: res.quote // data es de tipo Sale
            };
        }

        return { success: false, message: res.message };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error al crear proforma";
        return { success: false, message: msg };
    }
}

/**
 * 3. CONVERTIR PROFORMA A VENTA (El "Botón Mágico")
 */
export async function convertQuoteAction(
    quoteId: string,
    employeeId: string,
    paymentMethod: string
): Promise<SaleActionState> {
    try {
        const res = await apiServerClient<{ success: boolean; sale: Sale; message: string }>(
            `/sales/v2/${quoteId}/convert`,
            {
                method: "POST",
                body: JSON.stringify({ employeeId, paymentMethod }),
            }
        );

        if (res.success) {
            revalidatePath("/inventory");
            revalidatePath("/sales");
            return {
                success: true,
                message: "Venta concretada desde proforma",
                data: res.sale
            };
        }

        return { success: false, message: res.message };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error en conversión";
        return { success: false, message: msg };
    }
}

/**
 * 4. ANULAR VENTA (REFUND)
 */
export async function refundSaleAction(
    saleId: string,
    reason: string
): Promise<SaleActionState> {
    try {
        const res = await apiServerClient<{ success: boolean; message: string; sale: Sale }>(
            `/sales/v2/${saleId}/refund`,
            {
                method: "POST",
                body: JSON.stringify({ reason }),
            }
        );

        if (res.success) {
            revalidatePath("/inventory");
            revalidatePath("/sales");
            return {
                success: true,
                message: res.message,
                data: res.sale
            };
        }

        return { success: false, message: res.message };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error al anular venta";
        return { success: false, message: msg };
    }
}