// File: frontend/actions/comparison-action.ts
"use server";

import { ComparisonService } from "@/src/services/comparison-service";
import { ComparisonSchema, ComparisonFormValues } from "@/src/schemas/comparison.schema";
import { revalidateTag, revalidatePath } from "next/cache";

export interface ActionResponse {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
    fields?: Partial<ComparisonFormValues>;
}

/**
 * Helper para reconstruir la estructura anidada de FormData de forma segura.
 * Controla explícitamente cuándo convertir a Number para no romper la validación Zod de los strings.
 */
function parseNestedFormData(formData: FormData): Record<string, unknown> {
    const root: Record<string, any> = {};

    for (const [flatKey, value] of formData.entries()) {
        // Ignorar claves internas inyectadas por Next.js / React
        if (flatKey.startsWith("$")) continue;

        const pathParts = flatKey.match(/[^\[\]]+/g);
        if (!pathParts) continue;

        let current = root;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const isLast = i === pathParts.length - 1;

            if (isLast) {
                let finalValue: unknown = value;
                
                if (value === "true") {
                    finalValue = true;
                } else if (value === "false") {
                    finalValue = false;
                } else if (typeof value === "string") {
                    const trimmed = value.trim();
                    // FIX CRÍTICO: Solo convertimos a número explícitamente si el campo se llama 'score'
                    // Esto evita que valores técnicos como "120" fallen al esperar un string.
                    if (part === "score" && trimmed !== "" && !isNaN(Number(trimmed))) {
                        finalValue = Number(trimmed);
                    } else {
                        finalValue = trimmed;
                    }
                }

                current[part] = finalValue;
            } else {
                const nextPart = pathParts[i + 1];
                const shouldBeArray = !isNaN(Number(nextPart));

                if (current[part] === undefined) {
                    current[part] = shouldBeArray ? [] : {};
                }
                
                current = current[part];
            }
        }
    }

    return root;
}

export async function createComparisonAction(
    _prevState: ActionResponse,
    formData: unknown
): Promise<ActionResponse> {
    const rawFields = formData instanceof FormData ? parseNestedFormData(formData) : formData;
    const validatedFields = ComparisonSchema.safeParse(rawFields);
    
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Por favor, revisa los campos en rojo. Hay errores de validación.",
            errors: validatedFields.error.flatten().fieldErrors,
            fields: rawFields as Partial<ComparisonFormValues>
        };
    }

    try {
        await ComparisonService.create(validatedFields.data);

        revalidateTag("comparisons");
        revalidatePath("/comparativas");

        return { 
            success: true, 
            message: "Comparativa creada y publicada de forma exitosa." 
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Ocurrió un error inesperado al procesar la solicitud con el servidor.",
            fields: rawFields as Partial<ComparisonFormValues>,
        };
    }
}

export async function updateComparisonAction(
    id: string,
    slug: string,
    _prevState: ActionResponse,
    formData: unknown
): Promise<ActionResponse> {
    const rawFields = formData instanceof FormData ? parseNestedFormData(formData) : formData;
    const validatedFields = ComparisonSchema.safeParse(rawFields);
    
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Existen errores de validación en los datos ingresados.",
            errors: validatedFields.error.flatten().fieldErrors,
            fields: rawFields as Partial<ComparisonFormValues>,
        };
    }

    try {
        const result = await ComparisonService.update(id, validatedFields.data);
        const newSlug = result.data?.slug || slug;

        revalidateTag("comparisons");
        revalidateTag(`comparison-${slug}`);
        revalidatePath("/comparativas");
        revalidatePath(`/comparativas/${slug}`);
        
        if (newSlug !== slug) {
            revalidateTag(`comparison-${newSlug}`);
            revalidatePath(`/comparativas/${newSlug}`);
        }

        return { 
            success: true, 
            message: "Comparativa actualizada y sincronizada correctamente." 
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Fallo al intentar actualizar el registro en la base de datos.",
            fields: rawFields as Partial<ComparisonFormValues>,
        };
    }
}

export async function deleteComparisonAction(
    id: string, 
    slug: string,
    _prevState: ActionResponse
): Promise<ActionResponse> {
    try {
        await ComparisonService.delete(id);

        revalidateTag("comparisons");
        revalidateTag(`comparison-${slug}`);
        revalidatePath("/comparativas");

        return { 
            success: true, 
            message: "La comparativa ha sido dada de baja del catálogo." 
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Fallo crítico al intentar eliminar la comparativa."
        };
    }
}