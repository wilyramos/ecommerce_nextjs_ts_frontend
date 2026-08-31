// frontend/src/schemas/comparison.schema.ts

import { z } from "zod";
import { ProductSearchResultSchema } from "./product-v3.schema";

export const ComparisonSpecSchema = z.object({
    key: z.string().min(1, "La característica es requerida"),
    values: z.array(z.string()).min(2, "Se requiere al menos 2 valores"),
    scores: z.array(z.number()).min(2, "Se requiere al menos 2 puntuaciones"),
    isKeyDifference: z.boolean().default(false),
});
export type ComparisonSpec = z.infer<typeof ComparisonSpecSchema>;

export const FAQItemSchema = z.object({
    pregunta: z.string().min(5, "La pregunta es muy corta"),
    respuesta: z.string().min(10, "La respuesta es muy corta"),
});
export type FAQItem = z.infer<typeof FAQItemSchema>;

export const ComparisonSchema = z.object({
    _id: z.string(),
    slug: z.string(),
    title: z.string(),
    metaDescription: z.string().optional(),
    products: z.array(z.union([z.string(), ProductSearchResultSchema])),
    veredictoRapido: z.string(),
    especificaciones: z.array(ComparisonSpecSchema),
    faqItems: z.array(FAQItemSchema),
    isActive: z.boolean(),
    isFeatured: z.boolean(),
    viewCount: z.number().default(0),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});
export type ComparisonResponse = z.infer<typeof ComparisonSchema>;

export const CreateComparisonDTOSchema = z.object({
    title: z.string().min(10, "El título debe tener al menos 10 caracteres").max(100, "Máximo 100 caracteres"),
    metaDescription: z.string().optional(),
    products: z.array(z.string()).min(2, "Debe seleccionar al menos 2 productos"),
    veredictoRapido: z.string().min(20, "El veredicto debe tener al menos 20 caracteres").max(300, "Máximo 300 caracteres"),
    especificaciones: z.array(ComparisonSpecSchema).optional().default([]),
    faqItems: z.array(FAQItemSchema).optional().default([]),
});
export type CreateComparisonDTO = z.infer<typeof CreateComparisonDTOSchema>;

export const UpdateComparisonDTOSchema = CreateComparisonDTOSchema.partial();
export type UpdateComparisonDTO = z.infer<typeof UpdateComparisonDTOSchema>;

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean(),
        statusCode: z.number(),
        message: z.string(),
        data: dataSchema,
        meta: z
            .object({
                total: z.number().optional(),
                page: z.number().optional(),
                pages: z.number().optional(),
                limit: z.number().optional(),
            })
            .optional(),
        timestamp: z.string(),
    });