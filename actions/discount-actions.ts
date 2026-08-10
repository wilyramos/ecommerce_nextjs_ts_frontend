"use server";

import { revalidatePath } from "next/cache";
import { getTokenOptional } from "@/src/auth/dal";
import { discountService } from "@/src/services/discount-service";
import {
    CreateDiscountDTOSchema,
    type DiscountType,
    type DiscountAppliesVia,
    type DiscountTarget,
    type ValidateCouponItem,
    type ValidateCouponResponse,
    type EvaluateAutomaticResponse,
    type DiscountAnalyticsResponse,
} from "@/src/schemas/discount.schema";

export type ActionState<T = unknown> = {
    ok: boolean;
    message?: string;
    error?: string;
    data?: T;
    errors?: Record<string, string[]>;
} | null;

export async function createDiscountAction(
    _prevState: ActionState<null>,
    formData: FormData
): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) {
        return { ok: false, error: "No autorizado. Inicia sesión como administrador." };
    }

    const type = (formData.get("type") as DiscountType) || "BUY_X_GET_Y";
    const appliesVia = (formData.get("appliesVia") as DiscountAppliesVia) || "CODE";
    const target = (formData.get("target") as DiscountTarget) || "ALL_PRODUCTS";

    const rawIdsInput = (formData.get("rawIdsInput") as string) || "";
    const rawIds = rawIdsInput.split(",").map((id) => id.trim()).filter(Boolean);

    const getProductsRawInput = (formData.get("getProductsRawInput") as string) || "";
    const getProducts = getProductsRawInput.split(",").map((id) => id.trim()).filter(Boolean);

    const codeValue = formData.get("code") as string;

    const rawDto: Record<string, unknown> = {
        title: (formData.get("title") as string)?.trim(),
        description: (formData.get("description") as string)?.trim(),
        type,
        appliesVia,
        target,
        code: appliesVia === "CODE" && codeValue ? codeValue.toUpperCase().trim() : undefined,
        minPurchaseAmount: Number(formData.get("minPurchaseAmount") || 0),
        usageLimitTotal: formData.get("usageLimitTotal")
            ? Number(formData.get("usageLimitTotal"))
            : null,
        usageLimitPerCustomer: Number(formData.get("usageLimitPerCustomer") || 1),
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") ? (formData.get("endDate") as string) : null,
    };

    if (target === "SPECIFIC_PRODUCTS") rawDto.applicableProducts = rawIds;
    if (target === "SPECIFIC_CATEGORIES") rawDto.applicableCategories = rawIds;
    if (target === "SPECIFIC_BRANDS") rawDto.applicableBrands = rawIds;
    if (target === "SPECIFIC_COLLECTIONS") rawDto.applicableCollections = rawIds;
    if (target === "SPECIFIC_LINES") rawDto.applicableLines = rawIds;

    if (type === "BUY_X_GET_Y") {
        rawDto.value = 0;
        
        // Extracción explícita de inputs evitando valores estáticos/fallbacks incorrectos
        const parsedBuyQty = Number(formData.get("buyQuantity"));
        const parsedGetQty = Number(formData.get("getQuantity"));
        const parsedDiscountVal = Number(formData.get("getDiscountValue"));

        rawDto.bxgyConfig = {
            buyQuantity: isNaN(parsedBuyQty) || parsedBuyQty < 1 ? 1 : parsedBuyQty,
            getQuantity: isNaN(parsedGetQty) || parsedGetQty < 1 ? 1 : parsedGetQty,
            getDiscountType: (formData.get("getDiscountType") as string) || "FREE",
            getDiscountValue: isNaN(parsedDiscountVal) ? 100 : parsedDiscountVal,
            getProducts: getProducts.length > 0 ? getProducts : undefined,
        };
    } else if (type === "FREE_SHIPPING") {
        rawDto.value = 0;
    } else {
        rawDto.value = Number(formData.get("value") || 0);
    }

    const validation = CreateDiscountDTOSchema.safeParse(rawDto);

    if (!validation.success) {
        const fieldErrors = validation.error.flatten().fieldErrors;
        const firstErrorMessage =
            validation.error.errors[0]?.message || "Hay errores en la validación del formulario.";

        return {
            ok: false,
            error: firstErrorMessage,
            errors: fieldErrors,
        };
    }

    try {
        await discountService.createDiscount(validation.data, token);
        revalidatePath("/admin/discounts");
        return { ok: true, message: "Promoción creada exitosamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar la promoción.";
        return { ok: false, error: msg };
    }
}

export async function toggleDiscountStatusAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        const updated = await discountService.toggleStatus(id, token);
        revalidatePath("/admin/discounts");
        return {
            ok: true,
            message: `Promoción '${updated.title}' ${updated.isActive ? "activada" : "desactivada"} correctamente.`,
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al cambiar estado.";
        return { ok: false, error: msg };
    }
}

export async function deleteDiscountAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await discountService.deleteDiscount(id, token);
        revalidatePath("/admin/discounts");
        return { ok: true, message: "Descuento eliminado correctamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar descuento.";
        return { ok: false, error: msg };
    }
}

export async function evaluateAutomaticDiscountsAction(
    subtotal: number,
    cartItems: ValidateCouponItem[]
): Promise<ActionState<EvaluateAutomaticResponse>> {
    try {
        const result = await discountService.evaluateAutomaticDiscounts(subtotal, cartItems);
        return { ok: true, data: result };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error al evaluar promociones automáticas.";
        return { ok: false, error: message };
    }
}

export async function validateCouponAction(
    code: string,
    subtotal: number,
    cartItems: ValidateCouponItem[],
    userId?: string
): Promise<ActionState<ValidateCouponResponse>> {
    try {
        const result = await discountService.validateCoupon(code, subtotal, cartItems, userId);
        return { ok: true, data: result };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error al validar el cupón.";
        return { ok: false, error: message };
    }
}

export async function getDiscountAnalyticsAction(
    code: string
): Promise<ActionState<DiscountAnalyticsResponse>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        const analytics = await discountService.getDiscountAnalytics(code, token);
        return { ok: true, data: analytics };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error al obtener reporte del cupón.";
        return { ok: false, error: message };
    }
}