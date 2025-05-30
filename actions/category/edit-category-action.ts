"use server"

import getToken from "@/src/auth/token"
import { CreateCategorySchema, SuccessResponse } from "@/src/schemas"
import { ErrorResponse } from "@/src/schemas"
import { revalidatePath } from "next/cache"



type ActionStateType = {
    errors: string[],
    success: string
}


export async function EditCategory(id: string, prevState: ActionStateType, formData: FormData) {

    const categoryData = {
        nombre: formData.get("name"),
        descripcion: formData.get("description"),
        parent: formData.get("parent") || null
    }

    const category = CreateCategorySchema.safeParse(categoryData);
    if (!category.success) {
        return {
            errors: category.error.errors.map(error => error.message),
            success: ""
        }
    }

    const token = await getToken();
    console.log("tokennnn", token)
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
