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

export async function openCashAction(
    _prevState: CashActionState,
    formData: FormData
): Promise<CashActionState> {
    const initialBalance = Number(formData.get("initialBalance"));
    const userId = String(formData.get("userId"));

    if (initialBalance < 0) {
        return {
            success: false,
            message: "El saldo inicial no puede ser negativo",
        };
    }

    try {
        const res = await apiServerClient<{
            success: boolean;
            shift: CashShift;
            message?: string;
        }>("/cash/v2/open", {
            method: "POST",
            body: JSON.stringify({
                initialBalance,
                userId,
            }),
        });

        if (res.success) {
            revalidateTag("cash-status");
            revalidatePath("/");

            return {
                success: true,
                message: "Caja abierta correctamente",
                data: res.shift,
            };
        }

        return {
            success: false,
            message: res.message || "Error al abrir caja",
        };
    } catch (error: unknown) {
        const msg =
            error instanceof Error
                ? error.message
                : "Error crítico de conexión";

        return {
            success: false,
            message: msg,
        };
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

/**
 * REGISTRA UN MOVIMIENTO MANUAL (INGRESO/EGRESO)
 */
export async function addCashMovementAction(payload: {
    shiftId: string;
    type: "INCOME" | "EXPENSE";
    amount: number;
    reason: string;
}): Promise<CashActionState> {

    if (payload.amount <= 0) {
        return { success: false, message: "El monto debe ser mayor a cero" };
    }

    try {
        const res = await apiServerClient<{ success: boolean; message?: string }>(
            "/cash/v2/movement", // Verifica que este sea tu endpoint en el backend
            {
                method: "POST",
                body: JSON.stringify(payload),
            }
        );

        if (res.success) {
            // Revalidamos la ruta actual para que el MovementLog y CashStats se actualicen
            revalidatePath("/cash-shift");

            return {
                success: true,
                message: "Movimiento registrado correctamente"
            };
        }

        return { success: false, message: res.message || "Error al registrar movimiento" };

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Error de conexión al registrar movimiento";
        return { success: false, message: msg };
    }
}