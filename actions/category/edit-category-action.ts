//File: frontend/actions/category/edit-category-action.ts

"use server";

import getToken from "@/src/auth/token";
import { categoryFormSchema } from "@/src/schemas/category.schema";
import { SuccessResponse, ErrorResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache";

export type ActionStateType = {
    errors: string[];
    success: string;
};

/**
 * Server Action para modificar una categoría existente.
 */
export async function editCategoryAction(
    id: string,
    prevState: ActionStateType,
    formData: FormData
): Promise<ActionStateType> {
    const rawAttributes = formData.get("attributes");
    let parsedAttributes: unknown[] = [];

    if (rawAttributes) {
        try {
            const parsed = JSON.parse(rawAttributes as string);
            if (!Array.isArray(parsed)) {
                return {
                    errors: ["Los atributos deben estructurarse dentro de una lista válida."],
                    success: ""
                };
            }
            parsedAttributes = parsed;
        } catch (error) {
            return {
                errors: ["Los atributos tienen un formato JSON inválido.", error instanceof Error ? error.message : "Error desconocido."],
                success: ""
            };
        }
    }

    // Validación e inferencia con el esquema unificado (utilizando los nuevos nombres de los inputs del formulario)
    const categoryValidation = categoryFormSchema.safeParse({
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        parent: formData.get("parent"),
        order: formData.get("order"),
        image: formData.get("image"),
        isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
        attributes: parsedAttributes,
    });

    if (!categoryValidation.success) {
        return {
            errors: categoryValidation.error.errors.map((error) => error.message),
            success: ""
        };
    }

    try {
        const token = await getToken();
        const url = `${process.env.API_URL}/category/update/${id}`;

        const req = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryValidation.data)
        });

        const json = await req.json();

        if (!req.ok) {
            const errorParsed = ErrorResponse.safeParse(json);
            const errorMessage = errorParsed.success ? errorParsed.data.message : "Error al intentar actualizar la categoría.";
            return {
                errors: [errorMessage],
                success: ""
            };
        }

        const successParsed = SuccessResponse.parse(json);

        // Revalidación selectiva de las rutas administrativas del panel
        revalidatePath("/admin/category");
        revalidatePath(`/admin/category/edit/${id}`);

        return {
            errors: [],
            success: successParsed.message
        };
    } catch (error) {
        return {
            errors: ["No se pudo establecer conexión con el servidor de datos.", error instanceof Error ? error.message : "Error desconocido."],
            success: ""
        };
    }
}