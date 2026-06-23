// File: frontend/src/modules/page/schemas/page.schema.ts

import { z } from 'zod';

/**
 * Schema para la validación y optimización SEO interna de la página
 */
export const seoSchema = z.object({
    metaTitle: z
        .string()
        .trim()
        .max(60, { message: 'El título SEO no debe superar los 60 caracteres.' })
        .optional()
        .or(z.literal('')),
    metaDescription: z
        .string()
        .trim()
        .max(160, { message: 'La descripción SEO no debe superar los 160 caracteres.' })
        .optional()
        .or(z.literal('')),
});

/**
 * Schema base para la creación de páginas institucionales
 */
export const createPageSchema = z.object({
    title: z
        .string()
        .trim()
        .min(3, { message: 'El título debe tener al menos 3 caracteres.' })
        .max(100, { message: 'El título no debe superar los 100 caracteres.' }),
    slug: z
        .string()
        .trim()
        .toLowerCase() // Corregido: .toLowerCase() en lugar de .lowercase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            message: 'El slug debe ser una ruta válida (ej: mi-pagina-de-soporte), sin espacios ni caracteres especiales.',
        })
        .optional()
        .or(z.literal('')),
    content: z
        .string()
        .min(10, { message: 'El contenido de la página debe tener al menos 10 caracteres.' }),
    isActive: z
        .boolean({ required_error: 'El estado de activación es obligatorio.' })
        .default(true),
    seo: seoSchema.optional(),
});

/**
 * Schema para la actualización de páginas institucionales
 */
export const updatePageSchema = createPageSchema.extend({
    id: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, { message: 'El identificador de la página no es válido.' }),
});

// Inferencia de tipos nativos a partir de los Schemas de Zod
export type CreatePageInput = z.infer<typeof createPageSchema>;
export type UpdatePageInput = z.infer<typeof updatePageSchema>;
export type SeoInput = z.infer<typeof seoSchema>;

/**
 * Estructura estándar para el manejo del estado del formulario (Server Actions + useActionState)
 * Evita el uso de 'any' mapeando las claves potenciales de los inputs
 */
export type PageActionState = {
    success: boolean;
    message: string | null;
    errors?: {
        [K in keyof CreatePageInput]?: string[];
    } & {
        id?: string[];
        'seo.metaTitle'?: string[];
        'seo.metaDescription'?: string[];
    };
    data?: unknown; // Corregido: 'unknown' en lugar de 'any' para máxima seguridad tipada
};