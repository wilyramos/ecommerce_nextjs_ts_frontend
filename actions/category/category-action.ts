// File: frontend/actions/category/category-action.ts

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import getToken from "@/src/auth/token";
import { categoryPayloadSchema } from "@/src/schemas/category.schema";
import { SuccessResponse, ErrorResponse } from "@/src/schemas";

// ─────────────────────────────────────────────────────────────
// Tipos compartidos
// ─────────────────────────────────────────────────────────────

export type ActionStateType = {
    errors: string[];
    success: string;
};

// ─────────────────────────────────────────────────────────────
// Helper: parsear attributes desde FormData
// ─────────────────────────────────────────────────────────────

function parseAttributes(formData: FormData): { ok: true; data: unknown[] } | { ok: false; errors: string[] } {
    const raw = formData.get("attributes");
    if (!raw) return { ok: true, data: [] };

    try {
        const parsed = JSON.parse(raw as string);
        if (!Array.isArray(parsed)) {
            return { ok: false, errors: ["Los atributos deben estructurarse dentro de una lista válida."] };
        }
        return { ok: true, data: parsed };
    } catch (error) {
        return {
            ok: false,
            errors: [
                "Los atributos tienen un formato JSON inválido.",
                error instanceof Error ? error.message : "Error desconocido.",
            ],
        };
    }
}

// ─────────────────────────────────────────────────────────────
// Helper: construir y validar el payload del formulario
// ─────────────────────────────────────────────────────────────

function buildPayload(formData: FormData, attributes: unknown[]) {
    return categoryPayloadSchema.safeParse({
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        parent: formData.get("parent"),
        order: formData.get("order"),
        image: formData.get("image"),
        isActive:
            formData.get("isActive") === "true" ||
            formData.get("isActive") === "on",
        attributes,
    });
}

// ─────────────────────────────────────────────────────────────
// Helper: manejar respuesta HTTP del backend
// ─────────────────────────────────────────────────────────────

async function handleResponse(
    res: Response,
    fallbackError: string
): Promise<ActionStateType> {
    const json = await res.json();

    if (!res.ok) {
        const parsed = ErrorResponse.safeParse(json);
        return {
            errors: [parsed.success ? parsed.data.message : fallbackError],
            success: "",
        };
    }

    const parsed = SuccessResponse.parse(json);
    return { errors: [], success: parsed.message };
}

// ─────────────────────────────────────────────────────────────
// Action: Crear categoría
// ─────────────────────────────────────────────────────────────

export async function createCategoryAction(
    prevState: ActionStateType,
    formData: FormData
): Promise<ActionStateType> {
    const attrResult = parseAttributes(formData);
    if (!attrResult.ok) return { errors: attrResult.errors, success: "" };

    const validation = buildPayload(formData, attrResult.data);
    if (!validation.success) {
        return {
            errors: validation.error.errors.map((e) => e.message),
            success: "",
        };
    }

    try {
        const token = await getToken();
        const res = await fetch(`${process.env.API_URL}/category/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(validation.data),
        });

        const result = await handleResponse(res, "Error interno en el servidor remoto.");
        if (!result.errors.length) revalidatePath("/admin/category");
        return result;
    } catch (error) {
        return {
            errors: [
                "No se pudo establecer conexión con el servidor de datos.",
                error instanceof Error ? error.message : "Error desconocido.",
            ],
            success: "",
        };
    }
}

// ─────────────────────────────────────────────────────────────
// Action: Editar categoría
// ─────────────────────────────────────────────────────────────

export async function editCategoryAction(
    id: string,
    prevState: ActionStateType,
    formData: FormData
): Promise<ActionStateType> {
    const attrResult = parseAttributes(formData);
    if (!attrResult.ok) return { errors: attrResult.errors, success: "" };

    const validation = buildPayload(formData, attrResult.data);
    if (!validation.success) {
        return {
            errors: validation.error.errors.map((e) => e.message),
            success: "",
        };
    }

    try {
        const token = await getToken();
        const res = await fetch(`${process.env.API_URL}/category/update/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(validation.data),
        });

        const result = await handleResponse(res, "Error al intentar actualizar la categoría.");
        if (!result.errors.length) {
            revalidatePath("/admin/category");
            revalidatePath(`/admin/category/edit/${id}`);
        }
        return result;
    } catch (error) {
        return {
            errors: [
                "No se pudo establecer conexión con el servidor de datos.",
                error instanceof Error ? error.message : "Error desconocido.",
            ],
            success: "",
        };
    }
}

// ─────────────────────────────────────────────────────────────
// Action: Eliminar categoría (soft delete)
// ─────────────────────────────────────────────────────────────

export async function deleteCategoryAction(
    categoryId: string,
    prevState: ActionStateType
): Promise<ActionStateType> {
    let isSuccessful = false;
    let errorResult: ActionStateType | null = null;

    try {
        const token = await getToken();
        const res = await fetch(`${process.env.API_URL}/category/${categoryId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const result = await handleResponse(res, "Conflicto al intentar remover la categoría.");
        
        if (!result.errors.length) {
            revalidatePath("/admin/category");
            isSuccessful = true;
        } else {
            errorResult = result;
        }
    } catch (error) {
        errorResult = {
            errors: [
                "Error crítico de red al procesar la baja de la entidad.",
                error instanceof Error ? error.message : "Error desconocido.",
            ],
            success: "",
        };
    }

    // 1. Si hubo errores, se retorna el estado para que lo pinte el componente
    if (errorResult) {
        return errorResult;
    }

    // 2. Si fue exitoso, Next.js ejecuta la redirección de forma nativa sin bloqueos
    if (isSuccessful) {
        redirect("/admin/products/category");
    }

    // Fallback por requerimiento de tipo de firma
    return { errors: [], success: "" };
}