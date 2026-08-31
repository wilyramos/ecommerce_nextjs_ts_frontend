// File: frontend/actions/comparison.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getTokenOptional } from "@/src/auth/dal";
import { comparisonService } from "@/src/services/comparison-service";
import {
    CreateComparisonDTOSchema,
    UpdateComparisonDTOSchema,
} from "@/src/schemas/comparison.schema";

export type ActionState<T = unknown> = {
    ok: boolean;
    message?: string;
    error?: string;
    data?: T;
    errors?: Record<string, string[]>;
} | null;

/**
 * Función auxiliar genérica para parsear JSON de forma segura desde FormData sin usar `any`.
 */
const parseJsonField = <T = unknown>(formData: FormData, key: string, fallback: T): T => {
    const value = formData.get(key) as string | null;
    if (!value) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch (e) {
        console.error(`[parseJsonField] Error al parsear el campo ${key}:`, e);
        return fallback;
    }
};

export async function createComparisonAction(
    _prevState: ActionState<null>,
    formData: FormData
): Promise<ActionState<null>> {
    console.log("[createComparisonAction] Iniciando creación de comparativa...");
    
    const token = await getTokenOptional();
    if (!token) {
        console.warn("[createComparisonAction] Intento no autorizado.");
        return { ok: false, error: "No autorizado. Inicia sesión como administrador." };
    }

    try {
        const rawDto: Record<string, unknown> = {
            title: (formData.get("title") as string)?.trim(),
            metaDescription: (formData.get("metaDescription") as string)?.trim() || undefined,
            veredictoRapido: (formData.get("veredictoRapido") as string)?.trim(),
            products: parseJsonField<unknown[]>(formData, "products", []),
            especificaciones: parseJsonField<unknown[]>(formData, "especificaciones", []),
            faqItems: parseJsonField<unknown[]>(formData, "faqItems", []),
        };

        console.log("[createComparisonAction] DTO reconstruido:", JSON.stringify(rawDto, null, 2));

        const validation = CreateComparisonDTOSchema.safeParse(rawDto);

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const firstErrorMessage = validation.error.errors[0]?.message || "Error de validación en el formulario.";
            
            console.warn("[createComparisonAction] Fallo en validación:", fieldErrors);
            return { ok: false, error: firstErrorMessage, errors: fieldErrors };
        }

        console.log("[createComparisonAction] Validación exitosa. Enviando al backend...");
        await comparisonService.createComparison(validation.data, token);
        
        revalidatePath("/admin/comparisons");
        revalidatePath("/comparisons");

        console.log("[createComparisonAction] Comparativa creada con éxito.");
        return { ok: true, message: "Comparativa creada exitosamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al guardar la comparativa.";
        console.error("[createComparisonAction] Error interno:", msg);
        return { ok: false, error: msg };
    }
}

export async function updateComparisonAction(
    id: string,
    _prevState: ActionState<null>,
    formData: FormData
): Promise<ActionState<null>> {
    console.log(`[updateComparisonAction] Iniciando actualización para ID: ${id}...`);
    
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        const rawDto: Record<string, unknown> = {
            title: (formData.get("title") as string)?.trim(),
            metaDescription: (formData.get("metaDescription") as string)?.trim() || undefined,
            veredictoRapido: (formData.get("veredictoRapido") as string)?.trim(),
            products: parseJsonField<unknown[]>(formData, "products", []),
            especificaciones: parseJsonField<unknown[]>(formData, "especificaciones", []),
            faqItems: parseJsonField<unknown[]>(formData, "faqItems", []),
        };

        const validation = UpdateComparisonDTOSchema.safeParse(rawDto);

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            const firstErrorMessage = validation.error.errors[0]?.message || "Error de validación en el formulario.";
            
            console.warn(`[updateComparisonAction] Fallo en validación para ID ${id}:`, fieldErrors);
            return { ok: false, error: firstErrorMessage, errors: fieldErrors };
        }

        console.log(`[updateComparisonAction] Validación exitosa. Enviando al backend para ID ${id}...`);
        await comparisonService.updateComparison(id, validation.data, token);
        
        revalidatePath("/admin/comparisons");
        revalidatePath(`/admin/comparisons/${id}`);
        revalidatePath("/comparisons");

        console.log(`[updateComparisonAction] Comparativa ID ${id} actualizada con éxito.`);
        return { ok: true, message: "Comparativa actualizada exitosamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al actualizar la comparativa.";
        console.error(`[updateComparisonAction] Error interno en ID ${id}:`, msg);
        return { ok: false, error: msg };
    }
}

export async function toggleComparisonStatusAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        const updated = await comparisonService.toggleStatus(id, token);
        revalidatePath("/admin/comparisons");
        revalidatePath("/comparisons");
        return {
            ok: true,
            message: `Comparativa '${updated.title}' ${updated.isActive ? "activada" : "desactivada"} correctamente.`,
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al cambiar estado de la comparativa.";
        return { ok: false, error: msg };
    }
}

export async function toggleComparisonFeaturedAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        const updated = await comparisonService.toggleFeatured(id, token);
        revalidatePath("/admin/comparisons");
        revalidatePath("/comparisons");
        return {
            ok: true,
            message: `Comparativa '${updated.title}' ${updated.isFeatured ? "marcada como destacada" : "removida de destacados"}.`,
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al destacar la comparativa.";
        return { ok: false, error: msg };
    }
}

export async function deleteComparisonAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await comparisonService.deleteComparison(id, token);
        revalidatePath("/admin/comparisons");
        revalidatePath("/comparisons");
        return { ok: true, message: "Comparativa eliminada correctamente." };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al eliminar la comparativa.";
        return { ok: false, error: msg };
    }
}