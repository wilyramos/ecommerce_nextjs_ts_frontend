import { z } from "zod";

export const categoryAttributeSchema = z.object({
  name: z.string().min(1),
  values: z.array(z.string().min(1)),
  isVariant: z.boolean().optional().default(false),
});

export const categoryAttributesArraySchema = z.array(categoryAttributeSchema);

export const categoryBaseSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  slug: z.string().optional(),
  parent: z.string().nullable().optional(),
  attributes: categoryAttributesArraySchema.optional(),
  image: z.string().url().optional(),
  isActive: z.boolean().optional().default(true),
});

export const categorySchema = categoryBaseSchema.extend({
  _id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Category = z.infer<typeof categorySchema>;
export type CategoryBase = z.infer<typeof categoryBaseSchema>;