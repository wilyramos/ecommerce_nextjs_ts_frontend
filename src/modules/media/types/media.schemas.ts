import { z } from 'zod';
import {
    ALLOWED_FOLDERS_LIST,
    ALLOWED_RESOURCE_TYPES_LIST,
    ALLOWED_IMAGE_MIMETYPES,
    ALLOWED_VIDEO_MIMETYPES,
    MAX_IMAGE_SIZE_BYTES,
    MAX_VIDEO_SIZE_BYTES,
    MAX_FILES_PER_REQUEST,
} from './media.constants';

export const MediaFolderSchema = z.enum(ALLOWED_FOLDERS_LIST);
export const ResourceTypeSchema = z.enum(ALLOWED_RESOURCE_TYPES_LIST);

// ─── Entidad Media ────────────────────────────────────────────────────────────

export const MediaSchema = z.object({
    _id: z.string(),
    publicId: z.string().min(1),
    secureUrl: z.string().url(),
    folder: MediaFolderSchema,
    resourceType: ResourceTypeSchema,
    format: z.string().min(1),
    bytes: z.number().int().nonnegative(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    duration: z.number().positive().optional(),
    uploadedBy: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// ─── Respuestas del backend ───────────────────────────────────────────────────

export const UploadErrorItemSchema = z.object({
    index: z.number().int().nonnegative(),
    filename: z.string(),
    reason: z.string(),
});

export const UploadResponseSchema = z.object({
    success: z.boolean(),
    uploaded: z.number().int().nonnegative(),
    failed: z.number().int().nonnegative(),
    data: z.array(MediaSchema),
    errors: z.array(UploadErrorItemSchema).nullable().optional(),
});

export const DeleteMediaResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export const MediaListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(MediaSchema),
    total: z.number().int().nonnegative(),
    pages: z.number().int().nonnegative(),
});

// ─── Parámetros de query ──────────────────────────────────────────────────────

export const MediaListParamsSchema = z.object({
    folder: MediaFolderSchema,
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(20),
});

// ─── Validación de archivos en cliente ────────────────────────────────────────

type AllowedImageMimetype = typeof ALLOWED_IMAGE_MIMETYPES[number];
type AllowedVideoMimetype = typeof ALLOWED_VIDEO_MIMETYPES[number];

const isImageMime = (type: string): type is AllowedImageMimetype =>
    (ALLOWED_IMAGE_MIMETYPES as readonly string[]).includes(type);

const isVideoMime = (type: string): type is AllowedVideoMimetype =>
    (ALLOWED_VIDEO_MIMETYPES as readonly string[]).includes(type);

export const SingleFileSchema = z
    .custom<File>((val) => val instanceof File, 'Debe ser un archivo válido')
    .refine(
        (file) => isImageMime(file.type) || isVideoMime(file.type),
        { message: 'Tipo de archivo no soportado' }
    )
    .superRefine((file, ctx) => {
        if (isImageMime(file.type) && file.size > MAX_IMAGE_SIZE_BYTES) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `La imagen supera el límite de ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024} MB`,
            });
        }
        if (isVideoMime(file.type) && file.size > MAX_VIDEO_SIZE_BYTES) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `El video supera el límite de ${MAX_VIDEO_SIZE_BYTES / 1024 / 1024} MB`,
            });
        }
    });

export const UploadMediaParamsSchema = z.object({
    files: z
        .array(SingleFileSchema)
        .min(1, 'Debes seleccionar al menos un archivo')
        .max(MAX_FILES_PER_REQUEST, `Máximo ${MAX_FILES_PER_REQUEST} archivos por subida`),
    folder: MediaFolderSchema,
});