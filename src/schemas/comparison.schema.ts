//File: frontend/src/schemas/comparison.schema.ts

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const optionalString = z.string().optional().or(z.literal(""));

// Convertidor flexible para soportar tanto IDs puros (string) como Objetos Populados de Mongoose
const idOrPopulatedId = z
    .union([
        z.string().min(1, "ID inválido"),
        z.object({ _id: z.string() }).passthrough()
    ])
    .transform((val) => (typeof val === "string" ? val : (val._id as string)));

// ─────────────────────────────────────────────────────────────
// SUB-SCHEMAS — Sincronizados con backend/src/modules/comparison/comparison.model.ts
// ─────────────────────────────────────────────────────────────

export const ComparisonSpecSchema = z.object({
    key: z.string().trim().min(1, "La característica técnica es requerida (Ej: Pantalla)"),
    values: z.array(z.string().trim().min(1, "El valor técnico no puede estar vacío")),
    category: z.string().trim().default("General"),
    explanation: optionalString,
    isKeyDifference: z.boolean().default(false),
});

export const ProductEditorialSchema = z.object({
    product: idOrPopulatedId.nullable().optional().or(z.literal("")),
    resumenIdoneidad: z.string()
        .trim()
        .min(10, "El resumen de idoneidad debe tener al menos 50 caracteres")
        .max(300, "El resumen de idoneidad no debe superar los 300 caracteres"),
    pros: z.array(z.string().trim().min(10, "Cada punto a favor debe tener al menos 10 caracteres")),
    contras: z.array(z.string().trim().min(10, "Cada contra debe tener al menos 10 caracteres")),
});

export const ComparisonFAQSchema = z.object({
    pregunta: z.string().trim().min(1, "La pregunta es requerida"),
    respuesta: z.string().trim().min(1, "La respuesta es requerida"),
    keywords: z.array(z.string().trim()).default([]),
});

// ─────────────────────────────────────────────────────────────
// BASE SCHEMA
// ─────────────────────────────────────────────────────────────

export const BaseComparisonSchema = z.object({
    title: z.string()
        .trim()
        .min(20, "El título principal debe tener al menos 20 caracteres")
        .max(100, "El título principal no debe superar los 100 caracteres"),
    slug: optionalString,
    metaTitle: z.string().trim().max(60, "El Meta Title SEO no debe superar los 60 caracteres").optional(),
    metaDescription: z.string().trim().max(160, "La Meta Description SEO no debe superar los 160 caracteres").optional(),

    products: z.array(idOrPopulatedId),

    introduccion: z.string().trim().min(150, "La introducción editorial debe tener al menos 150 caracteres para SEO"),
    veredictoRapido: optionalString,
    conclusion: z.string().trim().min(150, "La conclusión final debe tener al menos 150 caracteres para SEO"),

    especificaciones: z.array(ComparisonSpecSchema).default([]),
    analisisEditorial: z.array(ProductEditorialSchema).default([]),
    palabrasClaveSecundarias: z.array(z.string().trim()).default([]),
    faqItems: z.array(ComparisonFAQSchema).default([]),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
});

// ─────────────────────────────────────────────────────────────
// SCHEMA FINAL CON REFINAMIENTOS DE INTEGRIDAD (Formularios)
// ─────────────────────────────────────────────────────────────

export const ComparisonSchema = BaseComparisonSchema.superRefine((data, ctx) => {
    // 1. Cantidad mínima de productos
    if (data.products.length < 2) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Se requieren al menos 2 productos para realizar una comparativa técnica",
            path: ["products"],
        });
        return;
    }

    // 2. Unicidad de productos implicados
    const uniqueProducts = new Set(data.products);
    if (uniqueProducts.size !== data.products.length) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No puedes seleccionar el mismo producto más de una vez en la comparativa",
            path: ["products"],
        });
    }

    // 3. Sincronización de valores en la tabla técnica
    data.especificaciones.forEach((spec, index) => {
        if (spec.values.length !== data.products.length) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `La fila de especificación debe contener exactamente ${data.products.length} valores (uno por cada producto)`,
                path: ["especificaciones", index, "values"],
            });
        }
    });

    // 4. Alineación exacta del Análisis Editorial con los Productos
    if (data.analisisEditorial.length > 0) {
        const editorialIds = data.analisisEditorial.map((e) => e.product);

        data.products.forEach((prodId) => {
            const count = editorialIds.filter((id) => id === prodId).length;
            if (count === 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Este producto carece de su bloque obligatorio de análisis editorial (Pros/Contras)",
                    path: ["analisisEditorial"],
                });
            } else if (count > 1) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Este producto tiene bloques editoriales duplicados",
                    path: ["analisisEditorial"],
                });
            }
        });

        data.analisisEditorial.forEach((edit, index) => {
            if (!uniqueProducts.has(edit.product?.toString() || "")) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El análisis hace referencia a un producto que fue removido de la comparativa",
                    path: ["analisisEditorial", index, "product"],
                });
            }
        });
    }
});

// ─────────────────────────────────────────────────────────────
// RESPONSE SCHEMA — Para datos que llegan populados desde el backend
// ─────────────────────────────────────────────────────────────

export const PopulatedProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    imagenes: z.array(z.string()).optional(),
    precio: z.union([z.number(), z.string()]).optional(),
}).passthrough(); // Permite propiedades adicionales del producto sin romper el esquema

export const ComparisonResponseSchema = BaseComparisonSchema.extend({
    _id: z.string(),
    slug: z.string(),
    viewCount: z.number(),
    avgTimeOnPage: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),

    products: z.array(z.union([z.string(), PopulatedProductSchema])), analisisEditorial: z.array(
        ProductEditorialSchema.extend({
            product: z.union([z.string(), z.record(z.any())]),
        })
    ),
});

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type ComparisonFormValues = z.infer<typeof ComparisonSchema>;
export type Comparison = z.infer<typeof ComparisonResponseSchema>;

export type ComparisonSpec = z.infer<typeof ComparisonSpecSchema>;
export type ProductEditorial = z.infer<typeof ProductEditorialSchema>;
export type ComparisonFAQ = z.infer<typeof ComparisonFAQSchema>;

export type PopulatedProduct = z.infer<typeof PopulatedProductSchema>;
