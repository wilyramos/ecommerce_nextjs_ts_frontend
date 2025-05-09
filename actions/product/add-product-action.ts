"use server"

import { CreateProductSchema } from "@/src/schemas"


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

    console.log(productDate);

    const product = CreateProductSchema.safeParse(productDate)

    if (!product.success) {
        return {
            errors: product.error.issues.map((issue) => issue.message),
            success: ""
        }
    }

    return {
        errors: [],
        success: "Producto creado con exito"
    }
}