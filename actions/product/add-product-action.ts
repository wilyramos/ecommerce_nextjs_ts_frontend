"use server"

import { CreateProductSchema, SuccessResponse } from "@/src/schemas"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createProduct(prevState: ActionStateType, formData: FormData) {


    const productDate = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),       
        precio: Number(formData.get('precio')),
        categoria: formData.get('categoria'),
        stock: Number(formData.get('stock')),
    }

    const product = CreateProductSchema.safeParse(productDate)

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
            stock: product.data.stock
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

    return {
        errors: [],
        success: "Producto creado con exito"
    }
}