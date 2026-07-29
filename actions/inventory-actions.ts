// File: frontend/src/actions/inventory-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/src/auth/dal";
import { inventoryService } from "@/src/services/inventory-service";
import { AdjustStockDTOSchema, type AdjustStockDTO, type InventoryLog } from "@/src/schemas/inventory.schema";

export type ActionState<T = unknown> =
    | { ok: true; message: string; data?: T; error?: never }
    | { ok: false; error: string; message?: never; data?: never };

export async function adjustStockAction(dto: AdjustStockDTO): Promise<ActionState> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    const validation = AdjustStockDTOSchema.safeParse(dto);
    if (!validation.success) {
        return { ok: false, error: validation.error.errors[0]?.message || "Datos inválidos." };
    }

    try {
        await inventoryService.adjustStock(validation.data);
        revalidatePath("/admin/inventory");
        return { ok: true, message: "Stock actualizado y registrado en auditoría correctamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error inesperado.";
        return { ok: false, error: msg };
    }
}

export async function getInventoryLogsAction(limit = 50, productId?: string): Promise<ActionState<InventoryLog[]>> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    try {
        const logs = await inventoryService.getInventoryLogs(limit, productId);
        return { ok: true, message: "Logs obtenidos correctamente.", data: logs };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al obtener logs.";
        return { ok: false, error: msg };
    }
}