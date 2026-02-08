"use server";

import getToken from "@/src/auth/token";

// Schemas
import { createProductSchema, especificacionSchema } from "@/src/schemas";
import type { TApiVariant, TEspecificacion } from "@/src/schemas";

type ActionStateType = {
    errors: string[];
    success: string;
};

export async function createProduct(prevState: ActionStateType, formData: FormData) {

    // 1. Parsear atributos (JSON string -> Object)
    const atributosString = formData.get('atributos') as string;
    let atributos: Record<string, string> = {};
    if (atributosString) {
        try {
            atributos = JSON.parse(atributosString);
        } catch (error) {
            console.error("Error parsing atributos:", error);
            return {
                errors: ["Error al procesar atributos. Formato JSON inválido."],
                success: ""
            };
        }
    }

    // 2. Validar especificaciones (JSON string -> Array)
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
            };
        }
    }

    // 3. Validar precio comparativo (Empty string -> undefined)
    const precioCompString = formData.get('precioComparativo') as string;
    const precioComparativo =
        precioCompString && precioCompString.trim() !== ''
            ? Number(precioCompString)
            : undefined;

    // 4. Parsear Variantes
    const rawVariants = formData.get("variants")
        ? JSON.parse(formData.get("variants") as string)
        : [];

    const cleanedVariants = rawVariants.map((variant: TApiVariant) => {
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

    // 5. Construir objeto de datos
    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        precio: Number(formData.get('precio')),
        precioComparativo: precioComparativo,
        costo: Number(formData.get('costo')),
        stock: Number(formData.get('stock')),

        // Relaciones
        categoria: formData.get('categoria'),
        brand: formData.get('brand') || undefined,
        line: formData.get('line') || undefined,

        // Identificadores
        sku: formData.get('sku') || undefined,
        barcode: formData.get('barcode') || undefined,

        // Arrays y Objetos
        imagenes: formData.getAll('imagenes[]') as string[],
        atributos: atributos,
        especificaciones: especificaciones,
        variants: cleanedVariants,

        // Booleanos y Configuración
        esDestacado: formData.get('esDestacado') === 'true',
        esNuevo: formData.get('esNuevo') === 'true',
        isActive: formData.get('isActive') === 'true',
        isFrontPage: formData.get('isFrontPage') === 'true',
        diasEnvio: formData.get('diasEnvio') ? Number(formData.get('diasEnvio')) : undefined,
    };

    // 6. Validar con Zod
    const result = createProductSchema.safeParse(productData);

    if (!result.success) {
        console.log("Error de validación Zod:", result.error.format());
        return {
            errors: result.error.issues.map((issue) => issue.message),
            success: ""
        };
    }

    // 7. Enviar al Backend
    try {
        const token = await getToken();
        const url = `${process.env.API_URL}/products`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(result.data)
        });

        const json = await response.json();

        if (!response.ok) {
            return {
                errors: [json.message || "Error al crear el producto en el servidor."],
                success: ""
            };
        }

        return {
            errors: [],
            success: "Producto creado exitosamente"
        };

    } catch (error) {
        console.error("Error en la petición fetch:", error);
        return {
            errors: ["Error de conexión con el servidor."],
            success: ""
        };
    }
}