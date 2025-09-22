"use server"

import getToken from "@/src/auth/token"
import { updateCategorySchema, categoryAttributesArraySchema } from "@/src/schemas"
import { ErrorResponse } from "@/src/schemas"
import { revalidatePath } from "next/cache"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function EditCategory(id: string, prevState: ActionStateType, formData: FormData) {

    // parsear los atributos del formData
    const rawAttributes = formData.get("attributes");
    let attributesData;

    try {
        const parsed = JSON.parse(rawAttributes as string);

        const result = categoryAttributesArraySchema.safeParse(parsed);
        if (!result.success) {
            return {
                errors: result.error.errors.map(error => error.message),
                success: ""
            }
        }
        attributesData = result.data;

    } catch (error) {
        // console.error("Error parsing attributes:", error);
        return {
            errors: ["Error al procesar los atributos de la categoría."],
            success: ""
        }
    }
    // Formatear los atributos

    const categoryData = {
        nombre: formData.get("name"),
        descripcion: formData.get("description"),
        parent: formData.get("parent") || null,
        attributes: attributesData,
        image: formData.get("image") || undefined,
    }

    console.log("imagen", categoryData.image)
    // console.log("categoryData", categoryData)
    // console.log("attributesData", attributesData)

    const category = updateCategorySchema.safeParse(categoryData);
    if (!category.success) {
        return {
            errors: category.error.errors.map(error => error.message),
            success: ""
        }
    }

    const token = await getToken();
    // console.log("tokennnn", token)
    const url = `${process.env.API_URL}/category/update/${id}`;
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(category.data)
    });

    const json = await req.json();

    if (!req.ok) {
        const error = ErrorResponse.parse(json);
        return {
            errors: [error.message],
            success: ""
        }
    }

    // Revalidate
    revalidatePath(`/admin/products/category/${id}`)

    return {
        errors: [],
        success: json.message
    }
}