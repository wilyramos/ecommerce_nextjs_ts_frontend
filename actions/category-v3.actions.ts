// File: frontend/actions/category-v3.actions.ts
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getTokenOptional } from "@/src/auth/dal";
import { 
    categoryService, 
    CATEGORIES_CACHE_TAG, 
    getCategoryItemTag 
} from "@/src/services/category-v3.service";
import {
    CreateCategoryDTOSchema,
    UpdateCategoryDTOSchema,
} from "@/src/schemas/category-v3.schema";

export type ActionState<T = unknown> = {
    ok: boolean;
    message?: string;
    error?: string;
    data?: T;
    errors?: Record<string, string[]>;
} | null;

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

/**
 * Invalida la caché global del árbol y las vistas públicas y de administración.
 */
function revalidateCategoriesCache(specificId?: string) {
    revalidateTag(CATEGORIES_CACHE_TAG);
    if (specificId) {
        revalidateTag(getCategoryItemTag(specificId));
        revalidatePath(`/admin/category-v3/${specificId}`);
    }
    revalidatePath("/admin/category-v3");
    revalidatePath("/categorias");
    revalidatePath("/", "layout"); // Refresca menús/navbars globales cacheados
}

export async function createCategoryAction(
    _prevState: ActionState<null>,
    formData: FormData
): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado. Por favor inicie sesión." };

    try {
        const parentValue = formData.get("parent") as string | null;
        
        const rawDto: Record<string, unknown> = {
            nombre: (formData.get("nombre") as string)?.trim(),
            descripcion: (formData.get("descripcion") as string)?.trim() || undefined,
            slug: (formData.get("slug") as string)?.trim() || undefined,
            parent: parentValue && parentValue.trim() !== "" ? parentValue.trim() : null,
            image: (formData.get("image") as string)?.trim() || undefined,
            isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
            order: Number(formData.get("order")) || 0,
            attributes: parseJsonField<unknown[]>(formData, "attributes", []),
        };

        console.log("[SA] createCategoryAction - Datos recibidos:", rawDto);

        const validation = CreateCategoryDTOSchema.safeParse(rawDto);

        if (!validation.success) {
            return {
                ok: false,
                error: validation.error.errors[0]?.message || "Error de validación",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        await categoryService.createCategory(validation.data, token);
        revalidateCategoriesCache();

        return { ok: true, message: "Categoría creada exitosamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error desconocido al crear la categoría.",
        };
    }
}

export async function updateCategoryAction(
    id: string,
    _prevState: ActionState<null>,
    formData: FormData
): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado. Por favor inicie sesión." };

    try {
        const parentValue = formData.get("parent") as string | null;

        const rawDto: Record<string, unknown> = {
            nombre: (formData.get("nombre") as string)?.trim(),
            descripcion: (formData.get("descripcion") as string)?.trim() || undefined,
            slug: (formData.get("slug") as string)?.trim() || undefined,
            parent: parentValue && parentValue.trim() !== "" ? parentValue.trim() : null,
            image: (formData.get("image") as string)?.trim() || undefined,
            isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
            order: Number(formData.get("order")) || 0,
            attributes: parseJsonField<unknown[]>(formData, "attributes", []),
        };

        const validation = UpdateCategoryDTOSchema.safeParse(rawDto);

        if (!validation.success) {
            return {
                ok: false,
                error: validation.error.errors[0]?.message || "Error de validación",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        await categoryService.updateCategory(id, validation.data, token);
        revalidateCategoriesCache(id);

        return { ok: true, message: "Categoría actualizada exitosamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error desconocido al actualizar la categoría.",
        };
    }
}

export async function toggleCategoryStatusAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await categoryService.toggleStatus(id, token);
        revalidateCategoriesCache(id);
        return { ok: true, message: "Estado cambiado correctamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error al cambiar estado.",
        };
    }
}

export async function bulkUpdateCategoryStatusAction(ids: string[], isActive: boolean): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await categoryService.bulkUpdateStatus(ids, isActive, token);
        revalidateCategoriesCache();
        return { ok: true, message: "Estados actualizados correctamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error en la actualización masiva.",
        };
    }
}

export async function bulkDeleteCategoryAction(ids: string[]): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await categoryService.bulkDelete(ids, token);
        revalidateCategoriesCache();
        return { ok: true, message: "Categorías eliminadas correctamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error al eliminar categorías.",
        };
    }
}

export async function reorderCategoriesAction(payload: { items: { id: string; order: number; parent?: string | null }[] }): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await categoryService.reorder(payload, token);
        revalidateCategoriesCache();
        return { ok: true, message: "Orden actualizado correctamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error al guardar el nuevo orden.",
        };
    }
}

export async function deleteCategoryAction(id: string): Promise<ActionState<null>> {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado." };

    try {
        await categoryService.deleteCategory(id, token);
        revalidateCategoriesCache(id);
        return { ok: true, message: "Categoría eliminada correctamente." };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Error al eliminar la categoría.",
        };
    }
}