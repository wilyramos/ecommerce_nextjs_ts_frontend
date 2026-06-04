// File: frontend/src/schemas/product.schema.ts

import { z } from "zod";

/**
 * Helper para campos poblados (ID o Objeto)
 * Se asegura de que acepte tanto el string del ID como el objeto con data básica.
 */
const populatedField = z.union([
    z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
    z.object({
        _id: z.string(),
        nombre: z.string(),
        slug: z.string().optional(),
        precio: z.number().optional(),
        imagenes: z.array(z.string()).optional(),
    }).passthrough()
]);

export const specificationSchema = z.object({
    key: z.string().trim().min(1, "La clave de la especificación es requerida"),
    value: z.string().trim().min(1, "El valor de la especificación es requerido"),
});

export const variantSchema = z.object({
    _id: z.string().optional(),
    nombre: z.string().optional(),
    precio: z.number().min(0).optional(),
    precioComparativo: z.number().min(0).optional(),
    costo: z.number().min(0).optional(),
    stock: z.number().min(0, "El stock no puede ser negativo").default(0),
    sku: z.string().trim().optional(),
    barcode: z.string().trim().optional(),
    imagenes: z.array(z.string()).default([]),
    // Sincronizado con el Map de Mongoose de la base de datos
    atributos: z.record(z.string(), z.string()).default({}),
});

export const productSchema = z.object({
    _id: z.string().optional(),
    nombre: z.string().trim().min(1, "El nombre del producto es requerido"),
    slug: z.string().trim().min(1, "El slug es requerido"),
    descripcion: z.string().optional(),
    precio: z.number().min(0).default(0),
    precioComparativo: z.number().min(0).optional(),
    costo: z.number().min(0).default(0),
    imagenes: z.array(z.string()).default([]),

    categoria: populatedField,
    brand: populatedField.optional().nullable(),
    line: populatedField.optional().nullable(),

    stock: z.number().min(0, "El stock no puede ser negativo").default(0),
    sku: z.string().trim().optional().nullable(),
    barcode: z.string().trim().optional().nullable(),
    isActive: z.boolean().default(true),

    // Sincronizado con el Map de Mongoose de la base de datos
    atributos: z.record(z.string(), z.string()).default({}),
    especificaciones: z.array(specificationSchema).default([]),
    variants: z.array(variantSchema).default([]),

    // Lista de productos relacionados poblados o ID strings
    complementarios: z.array(populatedField).default([]),

    // Mejoras técnicas añadidas del modelo de backend
    tags: z.array(z.string()).default([]),
    weight: z.number().min(0).optional().nullable(),
    dimensions: z.object({
        length: z.number().min(0).default(0),
        width: z.number().min(0).default(0),
        height: z.number().min(0).default(0),
    }).optional(),

    diasEnvio: z.number().int().min(0).default(1),
    fechaDisponibilidad: z.coerce.date().optional().nullable(),

    // SEO Metadatos
    metaTitle: z.string().trim().max(60).optional().nullable(),
    metaDescription: z.string().trim().max(160).optional().nullable(),

    // Feedback Social
    rating: z.number().min(0).max(5).default(0),
    numReviews: z.number().int().min(0).default(0),

    // Control de Soft Delete y Agrupaciones en producción
    deletedAt: z.coerce.date().optional().nullable(),
    collections: z.array(z.string()).default([]),

    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// ============================================================================
// ── TIPOS INFERIDOS E INTERFACES COMPLEMENTARIAS
// ============================================================================

export type Product = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof variantSchema>;
export type Specification = z.infer<typeof specificationSchema>;

export const productListSchema = z.array(productSchema);

/**
 * Estructura de validación para respuestas paginadas de catálogos y colecciones
 */
export const paginatedProductsSchema = z.object({
    success: z.boolean(),
    products: productListSchema,
    total: z.number().int(),
    totalPages: z.number().int(),
    currentPage: z.number().int(),
});
export type PaginatedProducts = z.infer<typeof paginatedProductsSchema>;

/**
 * Estructura para peticiones con envoltorio de API ({ ok: true, data: Product })
 */
export const productApiResponseSchema = z.object({
    ok: z.literal(true),
    data: productSchema
});
export type ProductApiResponse = z.infer<typeof productApiResponseSchema>;