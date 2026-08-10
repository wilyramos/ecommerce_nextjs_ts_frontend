// frontend/src/schemas/product-v3.schema.ts
import { z } from "zod";

// ── Sub-schemas Base ─────────────────────────────────────────────────────────

export const SpecificationSchema = z.object({
    key: z.string().min(1, "La clave es obligatoria"),
    value: z.string().min(1, "El valor es obligatorio"),
    icon: z.string().nullable().optional(),
    isFeatured: z.boolean().optional().default(false)
});

export const ProductAttributeDetailSchema = z.object({
    value: z.string().min(1, "El valor es obligatorio"),
    icon: z.string().nullable().optional(),
    isFeatured: z.boolean().optional().default(false)
});

export const VariantSchema = z.object({
    _id: z.string().optional(),
    variantId: z.string().optional(),
    nombre: z.string().optional(),
    precio: z.number().min(0, "El precio no puede ser negativo").optional(),
    precioComparativo: z.number().min(0).optional(),
    costo: z.number().min(0).optional(),
    stock: z.number().min(0).default(0),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string()).default([]),
    atributos: z.record(z.string()).default({}),
});

export const DimensionsSchema = z.object({
    length: z.number().min(0).default(0),
    width: z.number().min(0).default(0),
    height: z.number().min(0).default(0),
});

// ── Schema Principal (Completo) ──────────────────────────────────────────────

export const ProductSchema = z.object({
    _id: z.string().optional(),
    productId: z.string().optional(),
    nombre: z.string().min(1, "El nombre del producto es obligatorio"),
    slug: z.string().min(1, "El slug es obligatorio"),
    descripcion: z.string().optional(),

    precio: z.number().min(0).default(0),
    precioComparativo: z.number().min(0).optional(),
    costo: z.number().min(0).default(0),

    imagenes: z.array(z.string()).default([]),

    // Aceptan tanto el ID (string) como el objeto completo si viene con populate
    categoria: z.union([z.string(), z.record(z.any())]),
    brand: z.union([z.string(), z.record(z.any())]).optional(),
    line: z.union([z.string(), z.record(z.any())]).optional(),

    stock: z.number().min(0).default(0),
    sku: z.string().optional(),
    barcode: z.string().optional(),

    isActive: z.boolean().default(true),

    atributos: z.record(z.string()).default({}),
    atributosDetalle: z.record(ProductAttributeDetailSchema).default({}),
    especificaciones: z.array(SpecificationSchema).default([]),

    diasEnvio: z.number().min(0).default(1),
    fechaDisponibilidad: z.coerce.date().optional(),

    variants: z.array(VariantSchema).default([]),
    complementarios: z.array(z.union([z.string(), z.record(z.any())])).default([]),
    tags: z.array(z.string()).default([]),

    weight: z.number().min(0).optional(),
    dimensions: DimensionsSchema.optional(),

    metaTitle: z.string().max(60, "Máximo 60 caracteres").optional(),
    metaDescription: z.string().max(160, "Máximo 160 caracteres").optional(),

    rating: z.number().min(0).max(5).default(0),
    numReviews: z.number().min(0).default(0),

    deletedAt: z.coerce.date().nullable().optional(),
    collections: z.array(z.string()).default([]),

    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// ── Schemas de Búsqueda (Reducidos para rendimiento) ─────────────────────────

export const ProductVariantSearchSchema = z.object({
    _id: z.string().optional(),
    variantId: z.string().optional(),
    nombre: z.string().optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
});

export const ProductSearchResultSchema = z.object({
    _id: z.string(),
    productId: z.string().optional(),
    nombre: z.string(),
    slug: z.string(),
    sku: z.string().optional(),
    precio: z.number().optional(),
    stock: z.number().optional(),
    isActive: z.boolean(),
    imagenes: z.array(z.string()).optional(),
    variants: z.array(ProductVariantSearchSchema).optional(),
});

export const AdminProductSearchResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(ProductSearchResultSchema),
});

// ── Tipos Inferidos ──────────────────────────────────────────────────────────

export type Product = z.infer<typeof ProductSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export type Specification = z.infer<typeof SpecificationSchema>;
export type ProductAttributeDetail = z.infer<typeof ProductAttributeDetailSchema>;
export type Dimensions = z.infer<typeof DimensionsSchema>;

export type ProductSearchResult = z.infer<typeof ProductSearchResultSchema>;
export type ProductVariantSearch = z.infer<typeof ProductVariantSearchSchema>;