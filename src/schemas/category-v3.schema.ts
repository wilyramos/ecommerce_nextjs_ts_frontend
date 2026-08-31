// File: frontend/src/schemas/category-v3.schema.ts
import { z } from "zod";

// ── 1. Sub-esquemas ────────────────────────────────────────────────────────

export const CategoryAttributeSchema = z.object({
    name: z.string().min(1, "El nombre del atributo es requerido"),
    values: z.array(z.string()).min(1, "Debe proveer al menos un valor"),
    isVariant: z.boolean().optional().default(false),
    icon: z.string().nullable().optional(),
    isFilterable: z.boolean().optional().default(true),
});
export type CategoryAttribute = z.infer<typeof CategoryAttributeSchema>;

// ── 2. Esquema de Categoría Base ─────────────────────────────────────────

export const CategoryBaseSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    descripcion: z.string().optional(),
    slug: z.string().optional(),
    parent: z.string().nullable().optional(),
    image: z.string().optional(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
    attributes: z.array(CategoryAttributeSchema).default([]),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    deletedAt: z.coerce.date().nullable().optional(),
});
export type CategoryResponse = z.infer<typeof CategoryBaseSchema>;

// ── 3. Tipado Recursivo para el Árbol (Tree) ─────────────────────────────

export type CategoryTreeItem = CategoryResponse & {
    children: CategoryTreeItem[];
};

export type CategoryTreeInput = z.input<typeof CategoryBaseSchema> & {
    children: CategoryTreeInput[];
};

export const CategoryTreeSchema: z.ZodType<CategoryTreeItem, z.ZodTypeDef, CategoryTreeInput> = CategoryBaseSchema.extend({
    children: z.lazy(() => CategoryTreeSchema.array()),
});

// ── 4. Esquemas de Mutación (DTOs) ───────────────────────────────────────

export const CreateCategoryDTOSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
    descripcion: z.string().optional(),
    slug: z.string().optional(),
    parent: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de categoría padre inválido").nullable().optional(),
    image: z.string().optional().or(z.literal("")),
    isActive: z.boolean().optional().default(true),
    order: z.coerce.number().int().optional().default(0),
    attributes: z.array(CategoryAttributeSchema).optional().default([]),
});
export type CreateCategoryDTO = z.infer<typeof CreateCategoryDTOSchema>;

export const UpdateCategoryDTOSchema = CreateCategoryDTOSchema.partial();
export type UpdateCategoryDTO = z.infer<typeof UpdateCategoryDTOSchema>;

// ── 5. Envoltorio Genérico de Respuesta API ──────────────────────────────

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        statusCode: z.number(),
        message: z.string(),
        data: dataSchema,
        timestamp: z.string(),
    });