// File: frontend/src/schemas/brand.schema.ts

import { z } from "zod";

export const brandBaseSchema = z.object({
    nombre: z.string().min(1, { message: "El nombre es requerido." }),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    logo: z.string().url().or(z.literal("")).optional(), // Permite string vacío si no hay logo
    isActive: z.boolean().optional().default(true),
});

export const brandSchema = brandBaseSchema.extend({
    _id: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(), // Asegura la propiedad estricta para el sitemap
});

export type Brand = z.infer<typeof brandSchema>;
export type BrandBase = z.infer<typeof brandBaseSchema>;