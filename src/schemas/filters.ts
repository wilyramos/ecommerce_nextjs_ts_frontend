//File: frontend/src/schemas/filters.ts

import { z } from "zod";

// --- Esquemas Base para Filtros ---

// 1. Opción genérica (para Marcas y Categorías)
export const filterOptionSchema = z.object({
    id: z.string().optional(), // Opcional por si la agregación no lo devuelve a veces
    nombre: z.string(),
    slug: z.string(),
});

// 2. Atributos Dinámicos (Color, Talla, etc.)
export const filterAttributeSchema = z.object({
    name: z.string(),
    values: z.array(z.string()),
});

// 3. Rango de Precio (Soluciona el error de number | null)
export const priceRangeSchema = z.object({
    min: z.number().nullable(), 
    max: z.number().nullable(),
});

// --- Esquema Principal de Filtros (Lo que devuelve $facet) ---
export const filterSchema = z.object({
    brands: z.array(filterOptionSchema).optional(),
    categories: z.array(filterOptionSchema).optional(),
    atributos: z.array(filterAttributeSchema).optional(),
    price: z.array(priceRangeSchema).optional(),
});

// --- Inferencia de Tipos (Exports para usar en Componentes) ---
export type FilterOption = z.infer<typeof filterOptionSchema>;
export type AttributeFilter = z.infer<typeof filterAttributeSchema>;
export type PriceRange = z.infer<typeof priceRangeSchema>;
export type FilterResponse = z.infer<typeof filterSchema>;
