"use server";

import { verifySession } from "@/src/auth/dal";
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
 * Server Action para registrar una nueva comparativa.
 */
export async function createComparisonAction(
    _prevState: ActionResponse,
    values: unknown
): Promise<ActionResponse> {
    const session = await verifySession();

    // Tratamos los valores entrantes de forma segura para la persistencia del estado en el formulario
    const rawFields = values instanceof FormData
        ? (Object.fromEntries(values.entries()) as Partial<ComparisonFormValues>)
        : (values as Partial<ComparisonFormValues>);

    try {
        const validatedFields = ComparisonSchema.safeParse(values);
        if (!validatedFields.success) {
            return {
                success: false,
                message: "Error de validación en los datos provistos.",
                errors: validatedFields.error.flatten().fieldErrors,
                fields: rawFields,
            };
        }

        await ComparisonService.create(validatedFields.data, session.token);

        revalidateTag("comparisons");
        revalidatePath("/comparativas");

        return { success: true, message: "Comparativa creada de forma exitosa." };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Ocurrió un error inesperado al procesar la solicitud.";
        return {
            success: false,
            message: errorMessage,
            fields: rawFields,
        };
    }
}

/**
 * Server Action para modificar una comparativa existente.
 */
export async function updateComparisonAction(
    id: string,
    slug: string,
    _prevState: ActionResponse,
    values: unknown
): Promise<ActionResponse> {
    const session = await verifySession();

    const rawFields = values instanceof FormData
        ? (Object.fromEntries(values.entries()) as Partial<ComparisonFormValues>)
        : (values as Partial<ComparisonFormValues>);

    try {
        const validatedFields = ComparisonSchema.safeParse(values);
        if (!validatedFields.success) {
            return {
                success: false,
                message: "Error de validación en los datos de actualización.",
                errors: validatedFields.error.flatten().fieldErrors,
                fields: rawFields,
            };
        }

        await ComparisonService.update(id, validatedFields.data, session.token);

        revalidateTag("comparisons");
        revalidateTag(`comparison-${slug}`);
        revalidatePath("/comparativas");
        revalidatePath(`/comparativas/${slug}`);

        return { success: true, message: "Comparativa modificada correctamente." };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error al intentar actualizar el registro.";
        return {
            success: false,
            message: errorMessage,
            fields: rawFields,
        };
    }
}

/**
 * Server Action para aplicar borrado lógico (Soft Delete).
 */
export async function deleteComparisonAction(
    id: string, 
    slug: string,
    _prevState: ActionResponse
): Promise<ActionResponse> {
    const session = await verifySession();

    try {
        await ComparisonService.delete(id, session.token);

        revalidateTag("comparisons");
        revalidateTag(`comparison-${slug}`);
        revalidatePath("/comparativas");

        return { success: true, message: "La comparativa ha sido eliminada del catálogo." };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Fallo crítico al eliminar la comparativa.";
        return {
            success: false,
            message: errorMessage
        };
    }
}