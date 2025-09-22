"use server"

import { createCategorySchema, SuccessResponse, categoryAttributesArraySchema } from "@/src/schemas";
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}

export async function createCategoryAction(prevState: ActionStateType, formData: FormData) {

    // parsear los atributos del formData
    const rawAttributes = formData.get("attributes");

    let attributesData;
    if (rawAttributes) {
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
            return {
                errors: ["Los atributos tienen un formato inválido."],
                success: ""
            }
        }
    } else {
        attributesData = undefined;
    }

    const category = createCategorySchema.safeParse({
        nombre: formData.get("name"),
        descripcion: formData.get("description"),
        parent: formData.get("parent") || undefined,
        attributes: attributesData,
        image: formData.get("image") || undefined,
    })

    console.log("imagen", formData.get("image"))

    if (!category.success) {
        return {
            errors: category.error.errors.map((error) => error.message),
            success: ""
        }
    }

    const token = (await cookies()).get('ecommerce-token')?.value
    const url = `${process.env.API_URL}/category/create`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: category.data.nombre,
            descripcion: category.data.descripcion,
            parent: category.data.parent ? category.data.parent : undefined,
            attributes: category.data.attributes,
            image: category.data.image,
        })
    })

    const json = await req.json()
    const success = SuccessResponse.parse(json)
    if (!req.ok) {
        return {
            errors: [success.message],
            success: ""
        }
    }

    // Revalidate for redirect
    revalidatePath("/admin/category")

    // console.log("category", category.data)

    return {
        errors: [],
        success: success.message
    }
}