// File: src/schemas/catalog.ts
import { z } from "zod";
// import type { TApiProduct } from "./index";
import { ApiProductSchema } from "./index";

// ==========================================
// 1. SCHEMAS AUXILIARES (Reutilizables)
// ==========================================

// Estructura común para filtros (Marca, Categoría, Línea) que vienen del backend
const FilterItemSchema = z.object({
    id: z.string(),
    nombre: z.string(),
    slug: z.string(),
    count: z.number().optional(),
});

// ==========================================
// 3. FILTROS (SIDEBAR)
// ==========================================

export const CatalogFiltersSchema = z.object({
    brands: z.array(FilterItemSchema).default([]),
    lines: z.array(FilterItemSchema).default([]),
    categories: z.array(FilterItemSchema).default([]),
    atributos: z.array(
        z.object({
            name: z.string(),
            values: z.array(
                z.union([
                    z.object({ value: z.string(), count: z.number() }),
                    z.string() 
                ])
            )
        })
    ).default([]),
    price: z.array(
        z.object({
            min: z.number().nullable().optional(),
            max: z.number().nullable().optional(),
        })
    ).default([]),
});


// ==========================================
// 4. RESPUESTA COMPLETA DE LA API
// ==========================================

export const CatalogResponseSchema = z.object({
    products: z.array(ApiProductSchema),

    pagination: z.object({
        currentPage: z.number(),
        totalPages: z.number(),
        totalItems: z.number(),
    }),

    filters: CatalogFiltersSchema,

    context: z.object({
        categoryName: z.string().nullable(),
        brandName: z.string().nullable(),
        lineName: z.string().nullable(),
        searchQuery: z.string().nullable(),

        // campos de colección
        collectionName: z.string().optional().nullable(),
        collectionDesc: z.string().optional().nullable(),
        collectionImage: z.string().optional().nullable(),
        collectionColor: z.string().optional().nullable(),
        collectionIcon: z.string().optional().nullable(),

        // nuevos campos
        collectionType: z.string().optional().nullable(),
        collectionBannerImage: z.string().optional().nullable(),
        collectionBadgeLabel: z.string().optional().nullable(),
        collectionBadgeColor: z.string().optional().nullable(),
        collectionStartsAt: z.coerce.date().optional().nullable(),
        collectionEndsAt: z.coerce.date().optional().nullable(),
        collectionSeoTitle: z.string().optional().nullable(),
        collectionSeoDesc: z.string().optional().nullable(),
    }),

    isFallback: z.boolean(),
});

// ==========================================
// 5. TIPOS INFERIDOS (Exports)
// ==========================================

export type CatalogFilters = z.infer<typeof CatalogFiltersSchema>;
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;
export type FilterItem = z.infer<typeof FilterItemSchema>;