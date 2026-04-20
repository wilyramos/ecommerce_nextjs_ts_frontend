import { z } from "zod";

export const brandBaseSchema = z.object({
    nombre: z.string().min(1),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    logo: z.string().url().optional(),
    isActive: z.boolean().optional().default(true),
});

export const brandSchema = brandBaseSchema.extend({
    _id: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export type Brand = z.infer<typeof brandSchema>;
export type BrandBase = z.infer<typeof brandBaseSchema>;