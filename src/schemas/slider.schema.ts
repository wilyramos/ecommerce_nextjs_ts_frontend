// File: frontend/src/schemas/slider.schema.ts

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// ENUMS — sincronizados con sliderbanner.model.ts
// ─────────────────────────────────────────────────────────────

export const SliderLayoutEnum = z.enum([
    "default", "image-left", "image-center", "image-center-split",
    "background-media", "promo-box", "fullbleed", "split-diagonal",
    "minimal", "countdown", "video",
]);

export const SliderThemeEnum = z.enum(["dark", "light", "custom"]);
export const SliderContentTypeEnum = z.enum(["product", "brand", "category", "campaign", "custom"]);
export const SliderObjectFitEnum = z.enum(["contain", "cover", "fill"]);
export const SliderBorderStyleEnum = z.enum([
    "none", "simple", "double", "rounded-top", "rounded-all",
    "dashed", "dotted", "double-corner", "thick-solid",
]);

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const optionalString = z.string().optional().or(z.literal(""));

// ─────────────────────────────────────────────────────────────
// SUB-SCHEMAS
// ─────────────────────────────────────────────────────────────

export const SliderPriceSchema = z.object({
    current: z.number().min(0, "Precio inválido").optional(),
    compare: z.number().min(0).optional(),
    label: optionalString,
    suffix: optionalString,
    note: optionalString,
    currency: z.string().default("S/"),
    border: SliderBorderStyleEnum.default("none"),
});

export const SliderMediaSchema = z.object({
    imageUrl: z.string().min(1, "URL de imagen requerida"),
    videoUrl: optionalString,
    videoPoster: optionalString,
    altText: z.string().min(1, "Texto alternativo requerido"),
    objectFit: SliderObjectFitEnum.default("cover"),
    border: SliderBorderStyleEnum.default("none"),
});

export const SliderDesignSchema = z.object({
    layout: SliderLayoutEnum.default("default"),
    theme: SliderThemeEnum.default("dark"),
    bgColor: optionalString,
    accentColor: optionalString,
    textColor: optionalString,
    textMutedColor: optionalString,
    contentDistribution: z.object({
        leftSide: z.array(z.enum(["title", "subtitle", "description", "price"])).default([]),
        rightSide: z.array(z.enum(["title", "subtitle", "description", "price"])).default([]),
    }).optional(),
});

export const SliderCountdownSchema = z.object({
    endsAt: z.coerce.date().optional(),
    label: optionalString,
    showDays: z.boolean().default(true),
});

export const SliderScheduleSchema = z.object({
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
});

// ─────────────────────────────────────────────────────────────
// BASE SCHEMA
// ─────────────────────────────────────────────────────────────

export const BaseSliderBannerSchema = z.object({
    contentType: SliderContentTypeEnum.default("product"),

    // Referencias a documentos relacionados (se envían como ObjectId string)
    product: z.string().optional(),
    brand: z.string().optional(),
    category: z.string().optional(),

    title: optionalString,
    subtitle: optionalString,
    description: optionalString,
    destUrl: z.string().min(1, "URL de destino requerida"),

    price: SliderPriceSchema.optional(),
    media: SliderMediaSchema,
    design: SliderDesignSchema,
    countdown: SliderCountdownSchema.optional(),
    schedule: SliderScheduleSchema.optional(),

    isActive: z.boolean().default(true),
    order: z.number().int().min(0).optional(),
});

// ─────────────────────────────────────────────────────────────
// SCHEMA FINAL CON REFINAMIENTOS
// ─────────────────────────────────────────────────────────────

export const SliderBannerSchema = BaseSliderBannerSchema.superRefine((data, ctx) => {
    // 1. Relaciones según contentType
    if (data.contentType === "product" && !data.product) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Producto requerido para este tipo de contenido",
            path: ["product"],
        });
    }
    if (data.contentType === "brand" && !data.brand) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Marca requerida para este tipo de contenido",
            path: ["brand"],
        });
    }
    if (data.contentType === "category" && !data.category) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Categoría requerida para este tipo de contenido",
            path: ["category"],
        });
    }

    // 2. Precio: compare debe ser mayor que current
    if (
        data.price?.current !== undefined &&
        data.price?.compare !== undefined &&
        data.price.compare <= data.price.current
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "El precio de comparación debe ser mayor al precio actual",
            path: ["price", "compare"],
        });
    }

    // 3. Layout countdown requiere fecha de finalización
    if (data.design.layout === "countdown" && !data.countdown?.endsAt) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Fecha de finalización requerida para el layout countdown",
            path: ["countdown", "endsAt"],
        });
    }

    // 4. Countdown: la fecha debe ser futura
    if (data.countdown?.endsAt && data.countdown.endsAt <= new Date()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La fecha del countdown debe ser futura",
            path: ["countdown", "endsAt"],
        });
    }

    // 5. Schedule: endsAt debe ser posterior a startsAt
    if (data.schedule?.startsAt && data.schedule?.endsAt) {
        if (data.schedule.endsAt <= data.schedule.startsAt) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La fecha de fin debe ser posterior a la fecha de inicio",
                path: ["schedule", "endsAt"],
            });
        }
    }
});

// ─────────────────────────────────────────────────────────────
// RESPONSE SCHEMA — para datos que llegan del backend
// ─────────────────────────────────────────────────────────────

export const SliderBannerResponseSchema = BaseSliderBannerSchema.extend({
    _id: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
    // Las referencias pueden llegar como string (ObjectId) o como objeto poblado
    product: z.union([z.string(), z.record(z.any())]).optional(),
    brand: z.union([z.string(), z.record(z.any())]).optional(),
    category: z.union([z.string(), z.record(z.any())]).optional(),
});

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export type SliderBannerFormValues = z.infer<typeof SliderBannerSchema>;
export type SliderBanner = z.infer<typeof SliderBannerResponseSchema>;

// Tipos de sub-secciones — útiles para props de componentes UI
export type SliderPrice = z.infer<typeof SliderPriceSchema>;
export type SliderMedia = z.infer<typeof SliderMediaSchema>;
export type SliderDesign = z.infer<typeof SliderDesignSchema>;
export type SliderCountdown = z.infer<typeof SliderCountdownSchema>;
export type SliderSchedule = z.infer<typeof SliderScheduleSchema>;