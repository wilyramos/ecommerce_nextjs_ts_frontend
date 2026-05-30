//File: frontend/actions/category/create-category-action.ts

"use server";

import {
    categoryFormSchema
} from "@/src/schemas/category.schema";
import { SuccessResponse, ErrorResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache";
import getToken from "@/src/auth/token";

export type ActionStateType = {
    errors: string[];
    success: string;
};

/**
 * Server Action para registrar una nueva categoría.
 */
export async function createCategoryAction(prevState: ActionStateType, formData: FormData): Promise<ActionStateType> {
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

    // Validación e inferencia estricta usando el esquema de formulario corregido
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
        const url = `${process.env.API_URL}/category/create`;
        
        const req = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryValidation.data)
        });

        const json = await req.json();

        if (!req.ok) {
            const errorParsed = ErrorResponse.safeParse(json);
            const errorMessage = errorParsed.success ? errorParsed.data.message : "Error interno en el servidor remoto.";
            return {
                errors: [errorMessage],
                success: ""
            };
        }

        const successParsed = SuccessResponse.parse(json);
        
        revalidatePath("/admin/category");

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

/**
 * Server Action para aplicar borrado lógico (Soft Delete) a una categoría.
 */
export async function deleteCategoryAction(categoryId: string, prevState: ActionStateType): Promise<ActionStateType> {
    try {
        const token = await getToken();
        const url = `${process.env.API_URL}/category/${categoryId}`;
        
        const req = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const json = await req.json();

        if (!req.ok) {
            const errorParsed = ErrorResponse.safeParse(json);
            const errorMessage = errorParsed.success ? errorParsed.data.message : "Conflicto al intentar remover la categoría.";
            return {
                errors: [errorMessage],
                success: ""
            };
        }

        const successParsed = SuccessResponse.parse(json);
        
        revalidatePath('/admin/category');
        
        return {
            errors: [],
            success: successParsed.message
        };
    } catch (error) {
        return {
            errors: ["Error crítico de red al procesar la baja de la entidad.", error instanceof Error ? error.message : "Error desconocido."],
            success: ""
        };
    }
}