"use server"

import getToken from "@/src/auth/token"
import { CreateProductSchema, SuccessResponse } from "@/src/schemas"
// import { ErrorResponse } from "@/src/schemas" // TODO
import { revalidatePath } from "next/cache"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function EditProduct(id: string, prevState: ActionStateType, formData: FormData) {

    const productData = {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        precio: Number(formData.get("precio")),
        categoria: formData.get("categoria"),
        stock: Number(formData.get("stock")),
        imagenes: formData.getAll("imagenes[]") as string[],
    }
    // console.log("productData", productData)

    const product = CreateProductSchema.safeParse(productData);
    if (!product.success) {
        return {
            errors: product.error.errors.map(error => error.message),
            success: ""
        }
    }
    // console.log("product  ddd", product.data)

    const token = await getToken();
    const url = `${process.env.API_URL}/products/${id}`;
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product.data)
    });

    const json = await req.json();
    // console.log("json", json)
    if (!req.ok) {
        return {
            errors: [json.message],
            success: ""
        }
    }
    const success = SuccessResponse.parse(json);
    

    //Revalidate
    revalidatePath(`/admin/products/${id}`)

    return {
        errors: [],
        success: success.message
    }
}
