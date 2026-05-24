// File: frontend/src/schemas/collection.schema.ts

import { z } from "zod";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

export const COLLECTION_TYPES = ['promotion', 'theme', 'editorial', 'seasonal'] as const;
export type CollectionType = typeof COLLECTION_TYPES[number];

// ─── PRODUCTO DENTRO DE COLECCIÓN ─────────────────────────────────────────────

export const collectionProductSchema = z.object({
    _id:               z.string(),
    nombre:             z.string(),
    precio:             z.number().default(0),
    precioComparativo:  z.number().optional().nullable(),
    imagenes:           z.array(z.string()).default([]),
    slug:               z.string(),
    categoria:          z.any().optional(),
    stock:              z.number().optional(),
    esDestacado:        z.boolean().optional(),
});

// ─── COLECCIÓN SCHEMA BASE (Lecturas de la API) ──────────────────────────────

export const collectionSchema = z.object({
    _id:            z.string(),
    name:           z.string().min(1, "El nombre es requerido"),
    slug:           z.string(),
    type:           z.enum(COLLECTION_TYPES),
    description:    z.string().optional().nullable(),
    image:          z.string().optional().nullable(),
    bannerImage:    z.string().optional().nullable(),
    color:          z.string().optional().nullable(),
    icon:           z.string().optional().nullable(),
    order:          z.number().default(0),
    startsAt:       z.coerce.date().optional().nullable(),
    endsAt:         z.coerce.date().optional().nullable(),
    badgeLabel:     z.string().optional().nullable(),
    badgeColor:     z.string().optional().nullable(),
    seoTitle:       z.string().max(60).optional().nullable(),
    seoDescription: z.string().max(160).optional().nullable(),
    isActive:       z.boolean().default(true),
    createdAt:      z.coerce.date().optional(),
    updatedAt:      z.coerce.date().optional(),
});

// ─── PAGINACIÓN ───────────────────────────────────────────────────────────────

export const collectionPaginationSchema = z.object({
    total:  z.number(),
    page:   z.number(),
    limit:  z.number(),
    pages:  z.number(),
});

// ─── RESPUESTA DETALLADA (Slug público) ───────────────────────────────────────

export const collectionDetailResponseSchema = z.object({
    collection: collectionSchema,
    products:   z.array(collectionProductSchema),
    pagination: collectionPaginationSchema,
});

// ─── ESTRUCTURACIÓN DE PAYLOADS BASE (Sin Refinar) ────────────────────────────

// Construimos la base limpia eliminando los metadatos y sobreescribiendo tipos de inputs
const basePayloadFields = collectionSchema
    .omit({ _id: true, createdAt: true, updatedAt: true })
    .extend({
        startsAt: z.string().datetime({ offset: true }).optional().nullable(),
        endsAt:   z.string().datetime({ offset: true }).optional().nullable(),
    });

const createPayloadObject = basePayloadFields.partial({ slug: true, isActive: true, order: true });
const updatePayloadObject = createPayloadObject.partial();

// ─── SCHEMAS REFINADOS FINALES PARA VALIDACIÓN ────────────────────────────────

export const createCollectionPayloadSchema = createPayloadObject.superRefine((data, ctx) => {
    if (data.type === 'promotion' && data.startsAt && data.endsAt) {
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La fecha de fin debe ser mayor a la fecha de inicio',
                path: ['endsAt'],
            });
        }
    }
});

export const updateCollectionPayloadSchema = updatePayloadObject.superRefine((data, ctx) => {
    // En actualizaciones evaluamos la consistencia únicamente si ambas fechas vienen en el payload
    if (data.startsAt && data.endsAt) {
        if (new Date(data.startsAt) >= new Date(data.endsAt)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'La fecha de fin debe ser mayor a la fecha de inicio',
                path: ['endsAt'],
            });
        }
    }
});

// ─── ARRAYS ───────────────────────────────────────────────────────────────────

export const collectionsArraySchema     = z.array(collectionSchema);
export const promotionsArraySchema      = z.array(collectionSchema);

// ─── TIPOS INFERIDOS CORREGIDOS ───────────────────────────────────────────────

export type CollectionProduct           = z.infer<typeof collectionProductSchema>;
export type Collection                  = z.infer<typeof collectionSchema>;
export type CollectionDetailResponse    = z.infer<typeof collectionDetailResponseSchema>;
export type CreateCollectionPayload     = z.infer<typeof createCollectionPayloadSchema>;
export type UpdateCollectionPayload     = z.infer<typeof updateCollectionPayloadSchema>;