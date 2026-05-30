// File: frontend/src/schemas/category.schema.ts

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const optionalString = z
  .string()
  .optional()
  .or(z.literal(""));

// ─────────────────────────────────────────────────────────────
// SUB-SCHEMAS — Atributos
// ─────────────────────────────────────────────────────────────

export const categoryAttributeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre del atributo es obligatorio")
    .transform((val) => val.toLowerCase()),

  values: z
    .array(
      z
        .string()
        .trim()
        .min(1, "El valor no puede estar vacío")
        .transform((val) => val.toLowerCase())
    )
    .min(1, "Debe añadir al menos un valor")
    .refine(
      // 'vals' ya contiene strings limpios y en minúsculas por el transform de arriba
      (vals) => new Set(vals).size === vals.length,
      { message: "No se permiten valores duplicados dentro del mismo atributo" }
    ),

  isVariant: z.boolean().default(false),
});

export type CategoryAttribute = z.infer<typeof categoryAttributeSchema>;

export const categoryAttributesArraySchema = z
  .array(categoryAttributeSchema)
  .default([])
  .refine(
    // 'a.name' ya viene transformado a minúsculas por el esquema hijo
    (attrs) => new Set(attrs.map((a) => a.name)).size === attrs.length,
    { message: "No se permiten atributos con el mismo nombre en la categoría" }
  );

// ─────────────────────────────────────────────────────────────
// SCHEMA PARA FORMULARIOS Y MUTACIONES (Create / Update)
// ─────────────────────────────────────────────────────────────

export const categoryFormSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no debe superar los 50 caracteres"),

  descripcion: optionalString,

  // Campo de solo lectura en UI, no se envía al backend
  slug: optionalString,

  parent: z
    .string()
    .nullable()
    .optional()
    .transform((val) =>
      val === "" || val === "null" || val === undefined ? null : val
    ),

  attributes: categoryAttributesArraySchema,

  image: z
    .string()
    .url("Debe ser una URL válida de imagen")
    .or(z.literal(""))
    .optional(),

  isActive: z.boolean().default(true),

  order: z
    .number({ coerce: true })
    .int("Debe ser un número entero")
    .nonnegative("No puede ser un valor negativo")
    .default(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// ─────────────────────────────────────────────────────────────
// PAYLOAD — Lo que realmente se envía al backend
// ─────────────────────────────────────────────────────────────

export const categoryPayloadSchema = categoryFormSchema.omit({ slug: true });

export type CategoryPayload = z.infer<typeof categoryPayloadSchema>;

// ─────────────────────────────────────────────────────────────
// SCHEMAS DE RESPUESTA DE API (Queries)
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
  isActive: z.boolean().default(true),
  order: z.number().default(0),
  attributes: z.array(categoryAttributeSchema).default([]),
  parent: z
    .union([z.string(), categoryParentSchema])
    .nullable()
    .optional()
    .default(null),

  // z.coerce.date() evita que falle si la API no retorna el formato estricto UTC con 'Z'
  deletedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const apiCategoryListSchema = z.array(apiCategorySchema);

export type CategoryResponse = z.infer<typeof apiCategorySchema>;
export type CategoryListResponse = z.infer<typeof apiCategoryListSchema>;