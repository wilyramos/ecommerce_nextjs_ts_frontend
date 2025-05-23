"use server"

import { CreateProductSchema, SuccessResponse } from "@/src/schemas"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createProduct(prevState: ActionStateType, formData: FormData) {


    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),       
        precio: Number(formData.get('precio')),
        categoria: formData.get('categoria'),
        stock: Number(formData.get('stock')),
        imagenes: formData.getAll('imagenes') 
    }
    // console.log("productData", productData)

    const product = CreateProductSchema.safeParse(productData)
    console.log("productt", product)

    if (!product.success) {
        return {
            errors: product.error.issues.map((issue) => issue.message),
            success: ""
        }
    }

    const token = (await cookies()).get('ecommerce-token')?.value
    const url = `${process.env.API_URL}/products`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nombre: product.data.nombre,
            descripcion: product.data.descripcion,
            precio: product.data.precio,
            categoria: product.data.categoria,
            stock: product.data.stock,
            imagenes: product.data.imagenes
        })
    })

    const json = await req.json();
    // console.log("jsonn", json)
    if (!req.ok) {
        return {
            errors: [json.message],
            success: ""
        }
    }
    const success = SuccessResponse.parse(json)
    console.log("successss", success)
    return {
        errors: [],
        success: success.message
    }
}