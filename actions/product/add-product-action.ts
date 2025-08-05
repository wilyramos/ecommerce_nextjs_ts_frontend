"use server"

import getToken from "@/src/auth/token"
import { CreateProductSchema, SuccessResponse } from "@/src/schemas"

// Nuevo
import { createProductSchema } from "@/src/schemas"
import { isAborted } from "zod"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createProduct(prevState: ActionStateType, formData: FormData) {


    // parsear los atributos del formulario
    const atributosString = formData.get('atributos') as string;
    let atributos: Record<string, string> = {};
    if (atributosString) {
        try {
            atributos = JSON.parse(atributosString);
        } catch (error) {
            console.error("Error parsing atributos:", error);
            return {
                errors: ["Error parsing atributos. Please ensure it is a valid JSON string."],
                success: ""
            }
        }
    }

    // console.log("atributos", atributos)

    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: Number(formData.get('precio')),
        costo: Number(formData.get('costo')),
        categoria: formData.get('categoria'),
        stock: Number(formData.get('stock')),
        sku: formData.get('sku') || undefined,
        barcode: formData.get('barcode') || undefined,
        imagenes: formData.getAll('imagenes[]') as string[],
        esDestacado: formData.get('esDestacado') === 'true',
        esNuevo: formData.get('esNuevo') === 'true',
        isActive: formData.get('isActive') === 'true',
        atributos: atributos
    }


    // Validar con zod 
    const result = createProductSchema.safeParse(productData)
    if (!result.success) {
        return {
            errors: result.error.issues.map((issue) => issue.message),
            success: ""
        }
    }

    // Hacer la petición al API
    const token = await getToken()
    const url = `${process.env.API_URL}/products`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(result.data)
    });

    const json = await response.json()
    const parsed = SuccessResponse.safeParse(json)

    if (!response.ok || !parsed.success) {
        return {
            errors: [parsed.success ? parsed.data.message : "Error desconocido al crear el producto."],
            success: ""
        };
    }

    return {
        errors: [],
        success: json.message
    }

}