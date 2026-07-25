"use server";

import getToken from "@/src/auth/token";
import { updateProductSchema, especificacionSchema, SuccessResponse } from "@/src/schemas";
import type { TApiVariant, TEspecificacion, ProductAttributeDetail } from "@/src/schemas";
import { revalidatePath, revalidateTag } from "next/cache";

type ActionStateType = {
    errors: string[];
    success: string;
};

export async function EditProduct(id: string, prevState: ActionStateType, formData: FormData) {

    // 1. Atributos Planos (Filtros Rápidos)
    const atributosString = formData.get("atributos") as string;
    let atributos: Record<string, string> = {};
    if (atributosString) {
        try {
            atributos = JSON.parse(atributosString);
        } catch (error) {
            console.error("Error parsing atributos:", error);
            return { errors: ["Error al procesar los atributos del producto."], success: "" };
        }
    }

    // 1b. Atributos Detalle (Metadata, Iconos y Destaques Visuales) - NUEVO
    const atributosDetalleString = formData.get('atributosDetalle') as string;
    let atributosDetalle: Record<string, ProductAttributeDetail> = {};
    if (atributosDetalleString) {
        try {
            atributosDetalle = JSON.parse(atributosDetalleString);
        } catch (error) {
            console.error("Error parsing atributosDetalle:", error);
            return { errors: ["Error al procesar detalles visuales de los atributos."], success: "" };
        }
    }

    // 2. Especificaciones
    const especificacionesString = formData.get('especificaciones') as string;
    let especificaciones: TEspecificacion[] = [];
    if (especificacionesString) {
        try {
            const parsed = JSON.parse(especificacionesString);
            especificaciones = especificacionSchema.array().parse(parsed);
        } catch (error) {
            console.error("Error parsing especificaciones:", error);
            return { errors: ["Las especificaciones son inválidas."], success: "" };
        }
    }

    // 3. Precio comparativo
    const precioCompString = formData.get('precioComparativo') as string;
    const precioComparativo =
        precioCompString && precioCompString.trim() !== ''
            ? Number(precioCompString)
            : undefined;

    // 4. Variantes
    const variantsRawString = formData.get('variants') as string;
    const rawVariants: TApiVariant[] = variantsRawString ? JSON.parse(variantsRawString) : [];

    const cleanedVariants = rawVariants.map((variant: TApiVariant) => {
        const filteredAttributes: Record<string, string> = {};
        Object.entries(variant.atributos).forEach(([key, value]) => {
            if (value.trim() !== "") filteredAttributes[key] = value;
        });
        return { ...variant, atributos: filteredAttributes };
    });

    // 5. Tags e IDs relacionales de Colecciones
    const tagsRaw = formData.get('tags') as string;
    const tags: string[] = tagsRaw ? JSON.parse(tagsRaw) : [];

    const systemCollectionsRaw = formData.get("systemCollections") as string;
    const systemCollectionsIds: string[] = systemCollectionsRaw ? JSON.parse(systemCollectionsRaw) : [];

    // 6. Dimensiones Logísticas
    const dimLength = formData.get('dimensions.length') as string;
    const dimWidth = formData.get('dimensions.width') as string;
    const dimHeight = formData.get('dimensions.height') as string;
    const dimensions =
        dimLength || dimWidth || dimHeight
            ? {
                length: dimLength ? Number(dimLength) : 0,
                width: dimWidth ? Number(dimWidth) : 0,
                height: dimHeight ? Number(dimHeight) : 0,
            }
            : undefined;

    // 7. Complementarios
    const complementarios = formData.getAll('complementarios') as string[];

    // 8. Construir productData asimilando la metadata mapeada limpia
    const productData = {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        precio: Number(formData.get("precio")),
        precioComparativo,
        costo: Number(formData.get("costo")),
        stock: Number(formData.get("stock")),
        categoria: formData.get("categoria"),
        brand: formData.get("brand") || undefined,
        line: formData.get("line") || undefined,
        sku: formData.get("sku") || undefined,
        barcode: formData.get("barcode") || undefined,
        imagenes: formData.getAll("imagenes[]") as string[],
        atributos,
        atributosDetalle, // Enviado de manera atómica
        especificaciones,
        variants: cleanedVariants,
        complementarios: complementarios.length > 0 ? complementarios : [],
        isActive: formData.get("isActive") === "true",
        diasEnvio: formData.get('diasEnvio') ? Number(formData.get('diasEnvio')) : undefined,
        tags,
        weight: formData.get('weight') ? Number(formData.get('weight')) : undefined,
        dimensions,
        metaTitle: formData.get('metaTitle') || undefined,
        metaDescription: formData.get('metaDescription') || undefined,
        collections: systemCollectionsIds,
    };

    // 9. Validar con Zod (Asegúrate de haber añadido atributosDetalle a updateProductSchema)
    const product = updateProductSchema.safeParse(productData);
    if (!product.success) {
        console.error("❌ Errores estructurales de Zod:", product.error.format());
        return {
            errors: product.error.errors.map(error => error.message),
            success: ""
        };
    }

    // 10. Enviar al Backend vía PUT
    try {
        const token = await getToken();
        const req = await fetch(`${process.env.API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product.data)
        });

        const json = await req.json();
        if (!req.ok) {
            console.error("❌ El backend rechazó la petición PUT:", json);
            return { errors: [json.message || "Error al actualizar el producto."], success: "" };
        }

        const success = SuccessResponse.parse(json);

        // 11. Purga y Revalidación de Caché en Next.js
        revalidatePath(`/admin/products/${id}`);
        revalidatePath("/admin/products");
        revalidateTag("homepage-sections");

        return { errors: [], success: success.message };

    } catch (error) {
        console.error("❌ Fallo crítico de red en EditProduct:", error);
        return { errors: ["Error de conexión con el servidor."], success: "" };
    }
}