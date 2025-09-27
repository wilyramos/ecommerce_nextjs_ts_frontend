import { z } from "zod";


export const brandBaseSchema = z.object({
    nombre: z.string().trim().min(1, "Nombre requerido"),
    slug: z.string().optional(),
    descripcion: z.string().trim().optional(),
    logo: z.string().optional(),
    isActive: z.boolean().default(true).optional(),
});

export const createBrandSchema = brandBaseSchema;
export const updateBrandSchema = brandBaseSchema.partial();

export const ApiBrandSchema = brandBaseSchema.extend({
    _id: z.string().optional(),
    updatedAt: z.string().optional(),
    createdAt: z.string().optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

export type TBrand = z.infer<typeof ApiBrandSchema>;