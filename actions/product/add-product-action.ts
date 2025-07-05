"use server"

import { CreateProductSchema, SuccessResponse, ErrorResponse } from "@/src/schemas"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function createProduct(prevState: ActionStateType, formData: FormData) {

    console.log("formDataaaaA", formData)


    // parsear los atributos del formulario
    const atributosString = formData.get('atributos') as string;
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
        esDestacado: formData.get('esDestacado') === 'on',
        esNuevo: formData.get('esNuevo') === 'on',
        atributos: atributos
    }

    // format variantes

    // console.log("productData", productData)


    // console.log("productDataaaa", productData)

    const product = CreateProductSchema.safeParse(productData)
    // console.log("product", product)

    if (!product.success) {
        return {
            errors: product.error.issues.map((issue) => issue.message),
            success: ""
        }
    }

    console.log("product.data", product.data)

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
            costo: product.data.costo,
            categoria: product.data.categoria,
            stock: product.data.stock,
            sku: product.data.sku,
            barcode: product.data.barcode,
            imagenes: product.data.imagenes,
            esDestacado: product.data.esDestacado,
            esNuevo: product.data.esNuevo,
            atributos: product.data.atributos
        })
    });

    const Response = await req.json();
    // console.log("jsonn", json)
    if (!req.ok) {
        return {
            errors: [Response.message],
            success: ""
        }
    }
    
    
}