import { z } from "zod";


export const productLineBaseSchema = z.object({
  nombre: z.string().min(1),
  slug: z.string().min(1),
  descripcion: z.string().optional(),
  image: z.string().url().optional(),
  brand: z.string(),
  category: z.string().optional(),
  descriptionSEO: z.string().optional(),
  h1Title: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const productLineSchema = productLineBaseSchema.extend({
  _id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ProductLine = z.infer<typeof productLineSchema>;
export type ProductLineBase = z.infer<typeof productLineBaseSchema>;