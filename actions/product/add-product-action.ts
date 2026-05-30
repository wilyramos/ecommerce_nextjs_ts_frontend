"use server";

import getToken from "@/src/auth/token";
import { especificacionSchema } from "@/src/schemas";
import type { TApiVariant, TEspecificacion } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
};

export async function createProduct(prevState: ActionStateType, formData: FormData) {

    const hasVariantsError = formData.get("variants_error") === "true";
    if (hasVariantsError) {
        return {
            errors: ["No se puede guardar el producto porque existen variantes con errores de configuración."],
            success: ""
        };
    }

    // 1. Atributos
    const atributosString = formData.get('atributos') as string;
    let atributos: Record<string, string> = {};
    if (atributosString) {
        try {
            atributos = JSON.parse(atributosString);
        } catch (error) {
            console.error("Error en createProduct Action:", error);
            return { errors: ["Error al procesar atributos. Formato JSON inválido."], success: "" };
        }
    }

    // 2. Especificaciones
    const OwlsString = formData.get('especificaciones') as string;
    let especificaciones: TEspecificacion[] = [];
    if (OwlsString) {
        try {
            especificaciones = especificacionSchema.array().parse(JSON.parse(OwlsString));
        } catch (error) {
            console.error("Error en createProduct Action:", error);
            return { errors: ["Las especificaciones son inválidas."], success: "" };
        }
    }

    // 3. Variantes
    const rawVariants = formData.get("variants") ? JSON.parse(formData.get("variants") as string) : [];
    const cleanedVariants = rawVariants.map((variant: TApiVariant) => {
        const filteredAttributes: Record<string, string> = {};
        Object.entries(variant.atributos).forEach(([key, value]) => {
            if (value.trim() !== "") filteredAttributes[key] = value;
        });
        return { ...variant, atributos: filteredAttributes };
    });

    // 4. Captura e Inyección Segura de Slugs del Sistema
    const systemCollectionsRaw = formData.get("systemCollections") as string;
    const systemCollectionsIds: string[] = systemCollectionsRaw ? JSON.parse(systemCollectionsRaw) : [];
    console.log("System Collections IDs a enviar al backend:", systemCollectionsIds);

    const tagsRaw = formData.get('tags') as string;
    const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : [];

    const dimLength = formData.get('dimensions.length') as string;
    const dimWidth = formData.get('dimensions.width') as string;
    const dimHeight = formData.get('dimensions.height') as string;
    const dimensions = dimLength || dimWidth || dimHeight ? {
        length: dimLength ? Number(dimLength) : 0,
        width: dimWidth ? Number(dimWidth) : 0,
        height: dimHeight ? Number(dimHeight) : 0,
    } : undefined;

    const complementarios = formData.getAll('complementarios') as string[];
    const precioCompString = formData.get('precioComparativo') as string;

    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: Number(formData.get('precio')),
        precioComparativo: precioCompString && precioCompString.trim() !== '' ? Number(precioCompString) : undefined,
        costo: Number(formData.get('costo')),
        stock: Number(formData.get('stock')),
        categoria: formData.get('categoria'),
        brand: formData.get('brand') || undefined,
        line: formData.get('line') || undefined,
        sku: formData.get('sku') || undefined,
        barcode: formData.get('barcode') || undefined,
        imagenes: formData.getAll('imagenes[]') as string[],
        atributos,
        especificaciones,
        variants: cleanedVariants,
        complementarios,
        isActive: formData.get('isActive') === 'true',
        diasEnvio: formData.get('diasEnvio') ? Number(formData.get('diasEnvio')) : undefined,
        tags,
        weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
        dimensions,
        metaTitle: formData.get('metaTitle') || undefined,
        metaDescription: formData.get('metaDescription') || undefined,

        collections: systemCollectionsIds,
    };


    // 6. Enviar al Backend
    try {
        const token = await getToken();
        const response = await fetch(`${process.env.API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData) // Nota: Asegúrate de mapear "systemCollections" en tu createProductSchema de Zod compartida si es necesario.
        });

        const json = await response.json();
        if (!response.ok) {
            return { errors: [json.message || "Error al crear el producto."], success: "" };
        }

        return { errors: [], success: "Producto creado exitosamente" };

    } catch (error) {
        console.error("Error en createProduct Action:", error);
        return { errors: ["Error de conexión con el servidor."], success: "" };
    }
}