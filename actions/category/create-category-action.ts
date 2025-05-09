"use server"

import { CreateCategorySchema, SuccessResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createCategoryAction(prevState: ActionStateType, formData: FormData) {

    const category = CreateCategorySchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
    })

    if (!category.success) {
        return {
            errors: category.error.errors.map((error) => error.message),
            success: ""
        }
    }

    console.log("category", category.data)

    const token = (await cookies()).get('ecommerce-token')?.value
    console.log("token", token)
    const url = `${process.env.API_URL}/category/create`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: category.data.nombre,
            descripcion: category.data.descripcion
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