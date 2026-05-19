// frontend/actions/comparison-action.ts
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
 * Helper esencial para reconstruir la estructura anidada del FormData 
 * (Convierte claves planas como "especificaciones[0][key]" en objetos y arrays reales)
 */
function parseNestedFormData(formData: FormData): Record<string, unknown> {
    const root: Record<string, any> = {};

    for (const [flatKey, value] of formData.entries()) {
        if (flatKey.startsWith("$")) continue; // Ignorar claves internas de Next.js

        const pathParts = flatKey.match(/[^\[\]]+/g);
        if (!pathParts) continue;

        let current = root;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            const isLast = i === pathParts.length - 1;

            if (isLast) {
                let finalValue: unknown = value;
                if (value === "true") finalValue = true;
                else if (value === "false") finalValue = false;
                else if (typeof value === "string") finalValue = value.trim();

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
    // Soporta tanto recibir FormData directo del Form como un objeto plano parsed
    const rawFields = formData instanceof FormData ? parseNestedFormData(formData) : formData;

    // Validar con Zod aplicando los superRefine de integridad
    const validatedFields = ComparisonSchema.safeParse(rawFields);
    
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Error de validación en los datos provistos.",
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
            message: "Comparativa creada de forma exitosa." 
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Ocurrió un error inesperado al procesar la solicitud.",
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
            message: "Error de validación en los datos de actualización.",
            errors: validatedFields.error.flatten().fieldErrors,
            fields: rawFields as Partial<ComparisonFormValues>,
        };
    }

    try {
        const result = await ComparisonService.update(id, validatedFields.data);
        const newSlug = result.data?.slug || slug;

        // Revalidación de caché bajo demanda de Next.js 15
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
            message: "Comparativa modificada correctamente." 
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Error al intentar actualizar el registro.",
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
            message: "La comparativa ha sido eliminada del catálogo." 
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Fallo crítico al eliminar la comparativa."
        };
    }
}