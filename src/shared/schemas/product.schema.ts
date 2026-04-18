import { z } from "zod";

// Esquema para manejar objetos poblados o IDs simples
const populatedSchema = z.union([
  z.string(),
  z.object({
    _id: z.string(),
    nombre: z.string()
  })
]);

export const variantSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string().optional(),
  precio: z.number().optional(),
  costo: z.number().optional(),
  stock: z.number().default(0),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  atributos: z.record(z.string()).default({}),
});

export const productSchema = z.object({
  _id: z.string().optional(), // Opcional para cuando creamos uno nuevo
  nombre: z.string().min(1, "El nombre es requerido"),
  slug: z.string().optional(),
  descripcion: z.string().optional(), 
  precio: z.number().min(0).default(0),
  costo: z.number().min(0).optional().default(0),
  stock: z.number().min(0).default(0),
  minStock: z.number().min(0).optional().default(2),
  categoria: populatedSchema,
  brand: populatedSchema.optional(), 
  imagenes: z.array(z.string()).default([]),
  barcode: z.string().optional().nullable(),
  sku: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  variants: z.array(variantSchema).default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;