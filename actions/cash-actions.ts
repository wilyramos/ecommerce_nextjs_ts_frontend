/* File: /actions/cash-actions.ts 
    @Author: whramos 
    @Date: 11-04-2024
    @Description: Cash register mutations (Open/Close).
*/

"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { apiServerClient } from "@/src/infrastructure/api/api-server-client";
import { CashShift } from "@/src/schemas/cash.schema";
import { CashService } from "@/src/services/cash-service";

export type CashActionState = {
    success: boolean;
    message: string;
    data?: CashShift;
};

/**
 * ABRE UN NUEVO TURNO DE CAJA
 */
export async function openCashAction(
    _prevState: CashActionState,
    payload: { initialBalance: number; userId: string }
): Promise<CashActionState> {
    
    if (payload.initialBalance < 0) {
        return { success: false, message: "El saldo inicial no puede ser negativo" };
    }

    try {
        const res = await apiServerClient<{ success: boolean; shift: CashShift; message?: string }>(
            "/cash/v2/open", 
            {
                method: "POST",
                body: JSON.stringify(payload),
            }
        );

        if (res.success) {
            // Forzamos la actualización de todos los componentes que dependen del estado de caja
            revalidateTag("cash-status");
            revalidatePath("/terminal");
            
            return {
                success: true,
                message: "Caja abierta correctamente",
                data: res.shift
            };
        }

        return { success: false, message: res.message || "Error al abrir caja" };

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error crítico de conexión";
        return { success: false, message: msg };
    }
}


/**
 * CIERRA EL TURNO DE CAJA ACTUAL
 */
export async function closeCashAction(
    _prevState: CashActionState, // Cambiado de any a CashActionState
    payload: { shiftId: string; realBalance: number; userId: string; notes?: string }
): Promise<CashActionState> { // Especificar retorno
    try {
        const res = await apiServerClient<{ success: boolean; message?: string }>(
            "/cash/v2/close",
            {
                method: "POST",
                body: JSON.stringify(payload),
            }
        );

        if (res.success) {
            revalidateTag("cash-status");
            revalidatePath("/terminaltres");
            return { 
                success: true, 
                message: "Caja cerrada y arqueo registrado" 
            };
        }

        return { success: false, message: res.message || "Error al cerrar caja" };
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error crítico de conexión";
        return { success: false, message: msg };
    }
}

export async function getCashSummaryAction(shiftId: string) {
    try {
        const summary = await CashService.getSummary(shiftId);
        return { success: true, data: summary };
    } catch (error) {
        console.error("Error fetching cash summary:", error);
        return { success: false, message: "No se pudo cargar el resumen" };
    }
}