import { z } from "zod";

/**
 * Helper para campos poblados (ID o Objeto)
 */
const populatedField = z.union([
    z.string(),
    z.object({
        _id: z.string(),
        nombre: z.string(),
        slug: z.string().optional(),
    }).passthrough()
]);

export const specificationSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export const variantSchema = z.object({
    _id: z.string().optional(),
    nombre: z.string().optional(),
    precio: z.number().min(0).optional(),
    precioComparativo: z.number().min(0).optional(),
    costo: z.number().min(0).optional(),
    stock: z.number().min(0).default(0),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string()).default([]),
    atributos: z.record(z.string()).default({}),
});

export const productSchema = z.object({
    _id: z.string().optional(),
    nombre: z.string().min(1, "El nombre es requerido"),
    slug: z.string(),
    descripcion: z.string().optional(),
    precio: z.number().min(0).default(0),
    precioComparativo: z.number().min(0).optional(),
    costo: z.number().min(0).default(0),
    imagenes: z.array(z.string()).default([]),
    
    // Relaciones Pobladas
    categoria: populatedField,
    brand: populatedField.optional().nullable(),
    line: populatedField.optional().nullable(),
    
    stock: z.number().min(0).default(0),
    sku: z.string().optional().nullable(),
    barcode: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    esDestacado: z.boolean().default(false),
    esNuevo: z.boolean().default(false),
    
    atributos: z.record(z.string()).default({}),
    especificaciones: z.array(specificationSchema).default([]),
    variants: z.array(variantSchema).default([]),
    
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// Tipos inferidos
export type Product = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof variantSchema>;

// Respuesta paginada del backend
export interface PaginatedProducts {
    success: boolean;
    products: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
}