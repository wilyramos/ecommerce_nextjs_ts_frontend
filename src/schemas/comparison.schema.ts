// frontend/src/schemas/comparison.schema.ts

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const optionalString = z.string().optional().or(z.literal(""));

// Soporta tanto ID string como objeto populado de Mongoose
const idOrPopulatedId = z
    .union([
        z.string().min(1, "ID inválido"),
        z.object({ _id: z.string() }).passthrough()
    ])
    .transform((val) => (typeof val === "string" ? val : (val._id as string)));

// ─────────────────────────────────────────────────────────────
// SUB-SCHEMAS
// ─────────────────────────────────────────────────────────────

export const ComparisonSpecSchema = z.object({
    key: z
        .string()
        .trim()
        .min(1, "La característica es requerida (ej: Batería)"),
    values: z
        .array(z.string().trim().min(1, "El valor no puede estar vacío"))
        .min(2, "Se necesita al menos un valor por producto"),
    scores: z
        .array(
            z.number()
                .min(0, "La puntuación mínima es 0")
                .max(100, "La puntuación máxima es 100")
        )
        .min(2, "Se necesita al menos un score por producto"),
    isKeyDifference: z.boolean().default(false),
});

export const ComparisonFAQSchema = z.object({
    pregunta:  z.string().trim().min(1, "La pregunta es requerida"),
    respuesta: z.string().trim().min(1, "La respuesta es requerida"),
});

// ─────────────────────────────────────────────────────────────
// BASE SCHEMA
// ─────────────────────────────────────────────────────────────

export const BaseComparisonSchema = z.object({
    slug:            optionalString,
    title:           z.string().trim().min(10, "Mínimo 10 caracteres").max(100, "Máximo 100 caracteres"),
    metaDescription: z.string().trim().max(160, "Máximo 160 caracteres").optional(),

    products:        z.array(idOrPopulatedId).min(2, "Se requieren al menos 2 productos"),
    veredictoRapido: z.string().trim().min(20, "Mínimo 20 caracteres").max(300, "Máximo 300 caracteres"),

    especificaciones: z.array(ComparisonSpecSchema).default([]),
    faqItems:         z.array(ComparisonFAQSchema).default([]),

    isActive:   z.boolean().default(true),
    isFeatured: z.boolean().default(false),
});

// ─────────────────────────────────────────────────────────────
// SCHEMA FINAL CON REFINAMIENTOS
// ─────────────────────────────────────────────────────────────

export const ComparisonSchema = BaseComparisonSchema.superRefine((data, ctx) => {
    const numProducts = data.products.length;

    // Unicidad de productos
    const uniqueProducts = new Set(data.products);
    if (uniqueProducts.size !== numProducts) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "No puedes seleccionar el mismo producto más de una vez",
            path: ["products"],
        });
    }

    // Cada spec debe tener exactamente N values y N scores (uno por producto)
    data.especificaciones.forEach((spec, i) => {
        if (spec.values.length !== numProducts) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Debe haber exactamente ${numProducts} valores (uno por producto)`,
                path: ["especificaciones", i, "values"],
            });
        }
        if (spec.scores.length !== numProducts) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Debe haber exactamente ${numProducts} scores (uno por producto)`,
                path: ["especificaciones", i, "scores"],
            });
        }
    });
});

// ─────────────────────────────────────────────────────────────
// RESPONSE SCHEMA — datos populados desde el backend
// ─────────────────────────────────────────────────────────────

export const PopulatedProductSchema = z.object({
    _id:      z.string(),
    nombre:   z.string(),
    slug:     z.string().optional(),
    imagenes: z.array(z.string()).optional(),
    precio:   z.union([z.number(), z.string()]).optional(),
    rating:   z.number().optional(),
    brand:    z.record(z.any()).optional(),
}).passthrough();

export const ComparisonResponseSchema = BaseComparisonSchema.extend({
    _id:       z.string(),
    slug:      z.string(),
    viewCount: z.number().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable().optional(),
    products:  z.array(z.union([z.string(), PopulatedProductSchema])),
});

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type ComparisonFormValues = z.infer<typeof ComparisonSchema>;
export type Comparison           = z.infer<typeof ComparisonResponseSchema>;
export type ComparisonSpec       = z.infer<typeof ComparisonSpecSchema>;
export type ComparisonFAQ        = z.infer<typeof ComparisonFAQSchema>;
export type PopulatedProduct     = z.infer<typeof PopulatedProductSchema>;