// File: frontend/src/schemas/collection.schema.ts

import { z } from "zod";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

export const COLLECTION_TYPES = [
    'featured',
    'new_arrivals',
    'best_sellers',
    'on_sale',
    'promotion',
    'theme',
    'editorial',
    'seasonal',
] as const;

export const HOMEPAGE_LAYOUT_TYPES = ['grid', 'carousel'] as const;

export type CollectionType = typeof COLLECTION_TYPES[number];
export type HomepageLayoutType = typeof HOMEPAGE_LAYOUT_TYPES[number];

// ─── PRODUCTO DENTRO DE COLECCIÓN ─────────────────────────────────────────────

export const collectionProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    precio: z.number().default(0),
    precioComparativo: z.number().optional().nullable(),
    imagenes: z.array(z.string()).default([]),
    slug: z.string(),
    categoria: z.any().optional(),
    stock: z.number().optional(),
    brand: z.union([
        z.string(),
        z.object({
            _id: z.string(),
            nombre: z.string(),
        }).passthrough()
    ]).optional().nullable(),
    atributos: z.record(z.string(), z.string()).default({}),
});

// ─── COLECCIÓN SCHEMA BASE (Lecturas de la API) ──────────────────────────────

export const collectionSchema = z.object({
    _id: z.string(),
    name: z.string().min(1, "El nombre es requerido"),
    slug: z.string(),
    type: z.enum(COLLECTION_TYPES),
    description: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    bannerImage: z.string().optional().nullable(),
    color: z.string().optional().nullable(),
    order: z.number().default(0),
    startsAt: z.coerce.date().optional().nullable(),
    endsAt: z.coerce.date().optional().nullable(),
    badgeLabel: z.string().optional().nullable(),
    badgeColor: z.string().optional().nullable(),
    seoTitle: z.string().max(60).optional().nullable(),
    seoDescription: z.string().max(160).optional().nullable(),
    isActive: z.boolean().default(true),
    isSystem: z.boolean().default(false),
    showInHomepage: z.boolean().default(false),
    homepageOrder: z.number().default(0),
    maxHomepageItems: z.number().min(1).max(50).default(8),
    homepageLayout: z.enum(HOMEPAGE_LAYOUT_TYPES).default('grid'),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

// ─── PAGINACIÓN ───────────────────────────────────────────────────────────────

export const collectionPaginationSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
});

// ─── RESPUESTA DETALLADA (Slug público) ───────────────────────────────────────

export const collectionDetailResponseSchema = z.object({
    collection: collectionSchema,
    products: z.array(collectionProductSchema),
    pagination: collectionPaginationSchema,
});

// ─── RESPUESTA HOMEPAGE ───────────────────────────────────────────────────────

export const homepageSectionSchema = z.object({
    collection: collectionSchema,
    products: z.array(collectionProductSchema),
});

export const homepageSectionsResponseSchema = z.array(homepageSectionSchema);

// ─── PAYLOADS (Crear / Actualizar) ────────────────────────────────────────────

const basePayloadFields = collectionSchema
    .omit({ _id: true, isSystem: true, createdAt: true, updatedAt: true })
    .extend({
        // El frontend envía strings ISO; el backend convierte a Date
        startsAt: z.string().datetime({ offset: true }).optional().nullable(),
        endsAt: z.string().datetime({ offset: true }).optional().nullable(),
    });

const createPayloadObject = basePayloadFields.partial({
    slug: true,
    isActive: true,
    order: true,
    showInHomepage: true,
    homepageOrder: true,
    maxHomepageItems: true,
    homepageLayout: true,
});

const updatePayloadObject = createPayloadObject.partial();

// ─── VALIDACIONES REFINADAS ───────────────────────────────────────────────────

const dateRangeRefinement = (data: { startsAt?: string | null; endsAt?: string | null }, ctx: z.RefinementCtx) => {
    if (data.startsAt && data.endsAt) {
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La fecha de fin debe ser mayor a la fecha de inicio',
                path: ['endsAt'],
            });
        }
    }
};

export const createCollectionPayloadSchema = createPayloadObject.superRefine(dateRangeRefinement);
export const updateCollectionPayloadSchema = updatePayloadObject.superRefine(dateRangeRefinement);

// ─── ARRAYS ───────────────────────────────────────────────────────────────────

export const collectionsArraySchema = z.array(collectionSchema);
export const promotionsArraySchema = z.array(collectionSchema);
export const homepageLayoutArraySchema = z.array(homepageSectionSchema);

// ─── TIPOS INFERIDOS ──────────────────────────────────────────────────────────

export type CollectionProduct = z.infer<typeof collectionProductSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type HomepageSection = z.infer<typeof homepageSectionSchema>;
export type CollectionDetailResponse = z.infer<typeof collectionDetailResponseSchema>;
export type CreateCollectionPayload = z.infer<typeof createCollectionPayloadSchema>;
export type UpdateCollectionPayload = z.infer<typeof updateCollectionPayloadSchema>;