// File: frontend/src/schemas/collection.schema.ts

import { z } from "zod";

export const collectionProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(), // Cambiado de 'name' a 'nombre'
    precio: z.number().default(0), // Cambiado de 'price' a 'precio'
    imagenes: z.array(z.string()).default([]), // Cambiado de 'images' a 'imagenes'
    slug: z.string(),
    category: z.any().optional(), // Simplificado para evitar errores de validación complejos
});
// Esquema principal de la Colección
export const collectionSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "El nombre es requerido"),
    slug: z.string(),
    description: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    order: z.number().default(0),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// Esquema para la paginación devuelta por el servidor
export const collectionPaginationSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
});

// Esquema de respuesta detallada (Colección + Productos paginados)
export const collectionDetailResponseSchema = z.object({
    collection: collectionSchema,
    products: z.array(collectionProductSchema),
    pagination: collectionPaginationSchema,
});

// Esquema para creación (Payload enviado al backend)
export const createCollectionPayloadSchema = collectionSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
}).partial({
    slug: true, // Puede omitirse si el backend lo autogenera
    isActive: true,
    order: true,
});

// Esquema para actualización
export const updateCollectionPayloadSchema = createCollectionPayloadSchema.partial();

// Exportación de arreglos comunes
export const collectionsArraySchema = z.array(collectionSchema);

// Inferencia de tipos para TypeScript
export type CollectionProduct = z.infer<typeof collectionProductSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type CollectionDetailResponse = z.infer<typeof collectionDetailResponseSchema>;
export type CreateCollectionPayload = z.infer<typeof createCollectionPayloadSchema>;
export type UpdateCollectionPayload = z.infer<typeof updateCollectionPayloadSchema>;