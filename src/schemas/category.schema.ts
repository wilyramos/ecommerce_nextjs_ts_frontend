// File: frontend/src/schemas/category.schema.ts
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const optionalString = z.string().optional().or(z.literal(""));

// ─────────────────────────────────────────────────────────────
// SUB-SCHEMAS (Atributos)
// ─────────────────────────────────────────────────────────────

export const categoryAttributeSchema = z.object({
  // Almeja el comportamiento con 'lowercase: true' y 'trim: true' de Mongoose
  name: z.string()
    .trim()
    .min(1, 'El nombre del atributo es obligatorio')
    .transform(val => val.toLowerCase()),
  // Almeja el comportamiento con 'lowercase: true' y 'trim: true' en los elementos del array
  values: z.array(
    z.string()
      .trim()
      .min(1, 'El valor no puede estar vacío')
      .transform(val => val.toLowerCase())
  )
    .min(1, 'Debe añadir al menos un valor')
    .refine(
      (vals) => new Set(vals.map(v => v.toLowerCase().trim())).size === vals.length,
      { message: 'No se permiten valores duplicados dentro del mismo atributo' }
    ),
  isVariant: z.boolean().default(false),
});

export type CategoryAttribute = z.infer<typeof categoryAttributeSchema>;

export const categoryAttributesArraySchema = z.array(categoryAttributeSchema)
  .default([])
  .refine(
    (attrs) => new Set(attrs.map(a => a.name.toLowerCase().trim())).size === attrs.length,
    { message: 'No se permiten atributos con el mismo nombre en la categoría' }
  );

// ─────────────────────────────────────────────────────────────
// SCHEMA PARA FORMULARIOS Y MUTACIONES (Create / Update)
// ─────────────────────────────────────────────────────────────

export const categoryFormSchema = z.object({
  nombre: z.string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'El nombre no debe superar los 50 caracteres'),
  descripcion: optionalString,
  slug: optionalString,
  // Sincronizado con 'default: null' de Mongoose para categorías raíz
  parent: z.string()
    .nullable()
    .optional()
    .transform(val => val === "" || val === "null" || val === undefined ? null : val),
  attributes: categoryAttributesArraySchema,
  image: z.string()
    .url('Debe ser una URL válida de imagen')
    .or(z.literal(""))
    .optional(),
  isActive: z.boolean().default(true),
  order: z.number({ coerce: true })
    .int('Debe ser un número entero')
    .nonnegative('No puede ser un valor negativo')
    .default(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// ─────────────────────────────────────────────────────────────
// SCHEMAS DE RESPUESTA DE API (Consultas / Queries)
// ─────────────────────────────────────────────────────────────

export const categoryParentSchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  slug: z.string(),
});
export type CategoryParent = z.infer<typeof categoryParentSchema>;

export const apiCategorySchema = z.object({
  _id: z.string(),
  nombre: z.string(),
  descripcion: z.string().optional(),
  slug: z.string(),
  image: z.string().optional(),
  isActive: z.boolean().optional().default(true),
  order: z.number().optional().default(0),
  attributes: z.array(categoryAttributeSchema).optional().default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  // Sincronizado con 'deletedAt' tipo Date o null del modelo
  deletedAt: z.string().datetime().nullable().optional(),
  // Soporta el ObjectId crudo o el objeto poblado según los métodos del controlador
  parent: z.union([z.string(), categoryParentSchema])
    .nullable()
    .optional()
    .default(null),
});

export const apiCategoryListSchema = z.array(apiCategorySchema);

export type CategoryResponse = z.infer<typeof apiCategorySchema>;
export type CategoryListResponse = z.infer<typeof apiCategoryListSchema>;