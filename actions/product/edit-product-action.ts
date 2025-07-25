"use server"

import getToken from "@/src/auth/token"
import { SuccessResponse } from "@/src/schemas"
// import { ErrorResponse } from "@/src/schemas" // TODO
import { revalidatePath } from "next/cache"

// New schema

import { updateProductSchema } from "@/src/schemas"



type ActionStateType = {
    errors: string[],
    success: string
}


export async function EditProduct(id: string, prevState: ActionStateType, formData: FormData) {

    // parsear los atributos del formulario
    const atributosString = formData.get("atributos") as string;
    let atributos: Record<string, string> = {};
    if (atributosString) {
        try {
            atributos = JSON.parse(atributosString);
        } catch (error) {
            console.error("Error parsing atributos:", error);
            return {
                errors: ["Error al procesar los atributos del producto."],
                success: ""
            }
        }
    }

    const productData = {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        precio: Number(formData.get("precio")),
        costo: Number(formData.get("costo")),
        categoria: formData.get("categoria"),
        stock: Number(formData.get("stock")),
        sku: formData.get("sku"),
        barcode: formData.get("barcode"),
        imagenes: formData.getAll("imagenes[]") as string[],
        esDestacado: formData.get("esDestacado") === "on",
        esNuevo: formData.get("esNuevo") === "on",
        isActive: formData.get("isActive") === "on",
        atributos: atributos
    }
    console.log("productData", productData)

    const product = updateProductSchema.safeParse(productData);
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
