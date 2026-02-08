"use server"

import getToken from "@/src/auth/token"
import { especificacionSchema, SuccessResponse, type TEspecificacion } from "@/src/schemas"
// import { ErrorResponse } from "@/src/schemas" // TODO
import { revalidatePath } from "next/cache"
import type { TApiVariant } from "@/src/schemas"

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

    // parsear las especificaciones del formulario
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

    // valoidar precio comparativo
    const precioCompString = formData.get('precioComparativo') as string;
    const precioComparativo =
        precioCompString && precioCompString.trim() !== ''
            ? Number(precioCompString)
            : undefined;

    const rawVariants = formData.get('variants') ? JSON.parse(formData.get('variants') as string) : [];

    const cleanedVariants = rawVariants.map((variant: TApiVariant) => {
        // Filtrar atributos vacíos
        const filteredAttributes: Record<string, string> = {};
        Object.entries(variant.atributos).forEach(([key, value]) => {
            if (value.trim() !== "") {
                filteredAttributes[key] = value;
            }
        });

        return {
            ...variant,
            atributos: filteredAttributes
        };
    });

    const productData = {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        precio: Number(formData.get("precio")),
        precioComparativo: precioComparativo,
        costo: Number(formData.get("costo")),
        categoria: formData.get("categoria"),
        stock: Number(formData.get("stock")),
        sku: formData.get("sku"),
        barcode: formData.get("barcode"),
        imagenes: formData.getAll("imagenes[]") as string[],
        esDestacado: formData.get("esDestacado") === "true",
        esNuevo: formData.get("esNuevo") === "true",
        isActive: formData.get("isActive") === "true",
        atributos: atributos,
        brand: formData.get("brand") || undefined,
        especificaciones: especificaciones,
        diasEnvio: formData.get('diasEnvio') ? Number(formData.get('diasEnvio')) : undefined,
        variants: cleanedVariants,
        isFrontPage: formData.get('isFrontPage') === 'true',
        line: formData.get('line') || undefined,
    }

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