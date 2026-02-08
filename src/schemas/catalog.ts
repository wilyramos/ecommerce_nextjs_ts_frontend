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
});

// ==========================================
// 3. FILTROS (SIDEBAR)
// ==========================================

export const CatalogFiltersSchema = z.object({
    brands: z.array(FilterItemSchema).default([]),
    lines: z.array(FilterItemSchema).default([]), // <--- Filtro de Líneas
    categories: z.array(FilterItemSchema).default([]),
    
    // Atributos dinámicos (Color, Talla, etc.)
    // Estructura: { name: "Color", values: ["Rojo", "Azul"] }
    atributos: z.array(
        z.object({
            name: z.string(), // El backend devuelve esto en _id del group
            values: z.array(z.string())
        })
    ).default([]),
    
    // Rango de precio
    price: z.array(
        z.object({
            min: z.number().nullable().optional(),
            max: z.number().nullable().optional()
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
        lineName: z.string().nullable(), // <--- Contexto para SEO/Breadcrumbs
        searchQuery: z.string().nullable(),
    }),
    
    isFallback: z.boolean(),
});

// ==========================================
// 5. TIPOS INFERIDOS (Exports)
// ==========================================

export type CatalogFilters = z.infer<typeof CatalogFiltersSchema>;
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;
export type FilterItem = z.infer<typeof FilterItemSchema>;