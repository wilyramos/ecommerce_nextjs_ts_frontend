// File: frontend/src/actions/discount-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/src/auth/dal";
import { discountService } from "@/src/services/discount-service";
import { CreateDiscountDTOSchema, type CreateDiscountDTO } from "@/src/schemas/discount.schema";

export type ActionState<T = unknown> =
    | { ok: true; message: string; data?: T; error?: never }
    | { ok: false; error: string; message?: never; data?: never };

export async function createDiscountAction(dto: CreateDiscountDTO): Promise<ActionState> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    const validation = CreateDiscountDTOSchema.safeParse(dto);
    if (!validation.success) {
        return { ok: false, error: validation.error.errors[0]?.message || "Datos del cupón inválidos." };
    }

    try {
        await discountService.createDiscount(validation.data);
        revalidatePath("/admin/discounts");
        return { ok: true, message: "Cupón creado exitosamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error inesperado al crear cupón.";
        return { ok: false, error: msg };
    }
}

export async function toggleDiscountStatusAction(id: string): Promise<ActionState> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    try {
        const updated = await discountService.toggleStatus(id);
        revalidatePath("/admin/discounts");
        return {
            ok: true,
            message: `Cupón ${updated.code} ${updated.isActive ? "activado" : "desactivado"} correctamente.`,
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al cambiar estado.";
        return { ok: false, error: msg };
    }
}

export async function deleteDiscountAction(id: string): Promise<ActionState> {
    const session = await getSession();
    if (!session) return { ok: false, error: "No autorizado." };

    try {
        await discountService.deleteDiscount(id);
        revalidatePath("/admin/discounts");
        return { ok: true, message: "Cupón eliminado correctamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar cupón.";
        return { ok: false, error: msg };
    }
}


export async function validateCouponAction(
    code: string,
    subtotal: number,
    cartItems: { productId: string; variantId?: string; quantity: number; price: number }[],
    userId?: string
) {
    try {
        const result = await discountService.validateCoupon(code, subtotal, cartItems, userId);
        return { ok: true as const, data: result };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error al validar el cupón.";
        return { ok: false as const, error: message };
    }
}