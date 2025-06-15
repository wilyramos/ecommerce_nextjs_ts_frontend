"use server"

import { CreateCategorySchema, SuccessResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createCategoryAction(prevState: ActionStateType, formData: FormData) {

    console.log("createCategoryAction", formData)

    const category = CreateCategorySchema.safeParse({
        nombre: formData.get("name"),
        descripcion: formData.get("description"),
        parent: formData.get("parent") || undefined
    })

    console.log("category", category)

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
            parent: category.data.parent ? category.data.parent : undefined
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