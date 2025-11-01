"use server"

import getToken from "@/src/auth/token"
import { SuccessResponse } from "@/src/schemas"

// Nuevo
import { createProductSchema, especificacionSchema } from "@/src/schemas"
import type { TEspecificacion } from "@/src/schemas"

type ActionStateType = {
    errors: string[],
    success: string
}

export async function createProduct(prevState: ActionStateType, formData: FormData) {


    console.log("formData entries:", Array.from(formData.entries()));

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

    // validaor las specificaciones del formulario
    const especificacionesString = formData.get('especificaciones') as string;
    let especificaciones: TEspecificacion[] = [];
    if (especificacionesString) {
        try {
            const parsed = JSON.parse(especificacionesString);
            especificaciones = especificacionSchema.array().parse(parsed);
        } catch (error) {
            console.error("Error parsing especificaciones:", error);
            return {
                errors: ["Las especificaciones son inválidas."],
                success: ""
            }
        }
    }

    // valoidar precio 
    const precioCompString = formData.get('precioComparativo') as string;
    const precioComparativo = 
    precioCompString && precioCompString.trim() !== ''
        ? Number(precioCompString)
        : undefined;    

    // console.log("atributos", atributos)

    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: Number(formData.get('precio')),
        precioComparativo: precioComparativo,
        costo: Number(formData.get('costo')),
        categoria: formData.get('categoria'),
        stock: Number(formData.get('stock')),
        sku: formData.get('sku') || undefined,
        barcode: formData.get('barcode') || undefined,
        imagenes: formData.getAll('imagenes[]') as string[],
        esDestacado: formData.get('esDestacado') === 'true',
        esNuevo: formData.get('esNuevo') === 'true',
        isActive: formData.get('isActive') === 'true',
        atributos: atributos,
        especificaciones: especificaciones,
        brand: formData.get('brand') || undefined,
        diasEnvio: formData.get('diasEnvio') ? Number(formData.get('diasEnvio')) : undefined,
    }

    console.log("productData", productData)


    // Validar con zod 
    const result = createProductSchema.safeParse(productData)
    console.log("createProductSchema result", result)
    if (!result.success) {
        return {
            errors: result.error.issues.map((issue) => issue.message),
            success: ""
        }
    }

    console.log("Validated product data:", JSON.stringify(result.data));
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