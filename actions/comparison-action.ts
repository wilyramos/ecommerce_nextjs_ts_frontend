// File: frontend/actions/comparison-action.ts
"use server";

import { ComparisonService } from "@/src/services/comparison-service";
import { ComparisonSchema, ComparisonFormValues } from "@/src/schemas/comparison.schema";
import { revalidateTag, revalidatePath } from "next/cache";

export interface ActionResponse {
    success:  boolean;
    message:  string;
    errors?:  Record<string, string[]>;
    fields?:  Partial<ComparisonFormValues>;
}

// ── Parser de FormData ────────────────────────────────────────
// Reconstruye la estructura anidada desde los campos planos del formulario.
// Solo convierte a number los campos `scores[N]` — los valores de specs
// son strings técnicos ("30h", "8 micrófonos") y no deben castearse.

function parseNestedFormData(formData: FormData): Record<string, unknown> {
    const root: Record<string, any> = {};

    for (const [flatKey, value] of formData.entries()) {
        if (flatKey.startsWith("$")) continue;

        const parts = flatKey.match(/[^\[\]]+/g);
        if (!parts) continue;

        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part   = parts[i];
            const isLast = i === parts.length - 1;

            if (isLast) {
                let final: unknown = value;

                if (value === "true")       { final = true;  }
                else if (value === "false") { final = false; }
                else if (typeof value === "string") {
                    const trimmed = value.trim();
                    // scores son índices numéricos dentro de especificaciones[N][scores][N]
                    const isScore = part !== "key" && !isNaN(Number(part)) &&
                        parts[parts.length - 3] === "especificaciones" &&
                        parts[parts.length - 2] !== "values";

                    final = (isScore && trimmed !== "" && !isNaN(Number(trimmed)))
                        ? Number(trimmed)
                        : trimmed;
                }

                current[part] = final;
            } else {
                const next         = parts[i + 1];
                const nextIsIndex  = !isNaN(Number(next));

                if (current[part] === undefined) {
                    current[part] = nextIsIndex ? [] : {};
                }
                current = current[part];
            }
        }
    }

    return root;
}

// ── Actions ───────────────────────────────────────────────────

export async function createComparisonAction(
    _prev: ActionResponse,
    formData: unknown
): Promise<ActionResponse> {
    const raw       = formData instanceof FormData ? parseNestedFormData(formData) : formData;
    const validated = ComparisonSchema.safeParse(raw);

    if (!validated.success) {
        return {
            success: false,
            message: "Revisa los campos marcados en rojo.",
            errors:  validated.error.flatten().fieldErrors,
            fields:  raw as Partial<ComparisonFormValues>,
        };
    }

    try {
        await ComparisonService.create(validated.data);
        revalidateTag("comparisons");
        revalidatePath("/comparativas");
        return { success: true, message: "Comparativa creada correctamente." };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error inesperado al crear la comparativa.",
            fields:  raw as Partial<ComparisonFormValues>,
        };
    }
}

export async function updateComparisonAction(
    id: string,
    slug: string,
    _prev: ActionResponse,
    formData: unknown
): Promise<ActionResponse> {
    const raw       = formData instanceof FormData ? parseNestedFormData(formData) : formData;
    const validated = ComparisonSchema.safeParse(raw);

    if (!validated.success) {
        return {
            success: false,
            message: "Revisa los campos marcados en rojo.",
            errors:  validated.error.flatten().fieldErrors,
            fields:  raw as Partial<ComparisonFormValues>,
        };
    }

    try {
        const result  = await ComparisonService.update(id, validated.data);
        const newSlug = result.data?.slug || slug;

        revalidateTag("comparisons");
        revalidateTag(`comparison-${slug}`);
        revalidatePath("/comparativas");
        revalidatePath(`/comparativas/${slug}`);

        if (newSlug !== slug) {
            revalidateTag(`comparison-${newSlug}`);
            revalidatePath(`/comparativas/${newSlug}`);
        }

        return { success: true, message: "Comparativa actualizada correctamente." };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error inesperado al actualizar la comparativa.",
            fields:  raw as Partial<ComparisonFormValues>,
        };
    }
}

export async function deleteComparisonAction(
    id: string,
    slug: string,
    _prev: ActionResponse
): Promise<ActionResponse> {
    try {
        await ComparisonService.delete(id);
        revalidateTag("comparisons");
        revalidateTag(`comparison-${slug}`);
        revalidatePath("/comparativas");
        return { success: true, message: "Comparativa eliminada correctamente." };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error inesperado al eliminar la comparativa.",
        };
    }
}