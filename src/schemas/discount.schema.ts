// File: frontend/src/schemas/discount.schema.ts

import { z } from "zod";

export const DiscountTypeEnum = z.enum([
    "PERCENTAGE",
    "FIXED_AMOUNT",
    "FREE_SHIPPING",
    "BUY_X_GET_Y",
]);
export type DiscountType = z.infer<typeof DiscountTypeEnum>;

export const DiscountAppliesViaEnum = z.enum(["CODE", "AUTOMATIC"]);
export type DiscountAppliesVia = z.infer<typeof DiscountAppliesViaEnum>;

export const DiscountTargetEnum = z.enum([
    "ALL_PRODUCTS",
    "SPECIFIC_PRODUCTS",
    "SPECIFIC_CATEGORIES",
    "SPECIFIC_BRANDS",
    "SPECIFIC_COLLECTIONS",
    "SPECIFIC_LINES",
]);
export type DiscountTarget = z.infer<typeof DiscountTargetEnum>;

export const GiftProductDetailSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string(),
    imagenes: z.array(z.string()).optional(),
    precio: z.number().optional(),
});
export type GiftProductDetail = z.infer<typeof GiftProductDetailSchema>;

export const BxgyConfigSchema = z.object({
    buyQuantity: z.number().min(1),
    getQuantity: z.number().min(1),
    getDiscountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE"]).default("FREE"),
    getDiscountValue: z.number().default(100),
    getProducts: z.array(z.string()).optional(),
    getCategories: z.array(z.string()).optional(),
});
export type BxgyConfig = z.infer<typeof BxgyConfigSchema>;

export const DiscountSchema = z.object({
    _id: z.string(),
    code: z.string().toUpperCase().optional(),
    title: z.string(),
    description: z.string(),
    appliesVia: DiscountAppliesViaEnum,
    type: DiscountTypeEnum,
    value: z.number(),
    target: DiscountTargetEnum,
    giftProductsDetails: z.array(GiftProductDetailSchema).optional(),
    bxgyConfig: BxgyConfigSchema.nullable().optional(),

    applicableProducts: z.array(z.string()).optional(),
    applicableCategories: z.array(z.string()).optional(),
    applicableBrands: z.array(z.string()).optional(),
    applicableCollections: z.array(z.string()).optional(),
    applicableLines: z.array(z.string()).optional(),

    minPurchaseAmount: z.number(),
    usageLimitTotal: z.number().nullable(),
    currentUsageCount: z.number(),
    usageLimitPerCustomer: z.number(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable().optional(),
    isActive: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type DiscountResponse = z.infer<typeof DiscountSchema>;

export const CreateDiscountDTOSchema = z.object({
    title: z.string().min(3, "El título promocional es requerido"),
    description: z.string().min(3, "Ingresa una descripción corta"),
    appliesVia: DiscountAppliesViaEnum.default("CODE"),
    code: z
        .string()
        .min(3, "El código debe tener al menos 3 caracteres")
        .max(20, "Máximo 20 caracteres")
        .regex(/^[a-zA-Z0-9_-]+$/, "Formato alfanumérico sin espacios")
        .optional(),
    type: DiscountTypeEnum,
    value: z.number().min(0, "El valor debe ser 0 o superior").default(0),
    target: DiscountTargetEnum.default("ALL_PRODUCTS"),

    bxgyConfig: BxgyConfigSchema.optional(),

    applicableProducts: z.array(z.string()).optional(),
    applicableCategories: z.array(z.string()).optional(),
    applicableBrands: z.array(z.string()).optional(),
    applicableCollections: z.array(z.string()).optional(),
    applicableLines: z.array(z.string()).optional(),

    minPurchaseAmount: z.number().min(0, "Monto mínimo debe ser 0 o superior").default(0),
    usageLimitTotal: z.number().nullable().optional(),
    usageLimitPerCustomer: z.number().min(1, "Mínimo 1 uso por cliente").default(1),
    startDate: z.string().min(1, "Selecciona fecha de inicio"),
    endDate: z.string().nullable().optional(),
});

export type CreateDiscountDTO = z.infer<typeof CreateDiscountDTOSchema>;

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

export const ValidateCouponItemSchema = z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number(),
    price: z.number(),
});

export type ValidateCouponItem = z.infer<typeof ValidateCouponItemSchema>;

export const ValidateCouponResponseSchema = z.object({
    code: z.string().optional(),
    title: z.string().optional(),
    type: DiscountTypeEnum,
    value: z.number(),
    discountAmount: z.number(),
    isFreeShipping: z.boolean().optional(),
    newTotal: z.number(),
});

export type ValidateCouponResponse = z.infer<typeof ValidateCouponResponseSchema>;

// Detalle de descuento por ítem
export const ItemDiscountDetailSchema = z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    discountAmount: z.number(),
});

export type ItemDiscountDetail = z.infer<typeof ItemDiscountDetailSchema>;

// Schema de evaluación automática
export const EvaluateAutomaticResponseSchema = z.object({
    appliedDiscount: z
        .object({
            id: z.string(),
            title: z.string(),
            type: z.string(),
            appliesVia: z.string(),
        })
        .nullable(),
    discountAmount: z.number(),
    newTotal: z.number(),
    itemDiscounts: z.array(ItemDiscountDetailSchema).optional(),
});

export type EvaluateAutomaticResponse = z.infer<typeof EvaluateAutomaticResponseSchema>;

export const DiscountAnalyticsResponseSchema = z.object({
    code: z.string(),
    title: z.string().optional(),
    ordersPlaced: z.number(),
    revenueGenerated: z.number(),
    discountsGiven: z.number(),
    currentUsageCount: z.number(),
    usageLimitTotal: z.number().nullable(),
    isActive: z.boolean(),
});

export type DiscountAnalyticsResponse = z.infer<typeof DiscountAnalyticsResponseSchema>;

export const ProductActivePromotionSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: DiscountTypeEnum,
    appliesVia: DiscountAppliesViaEnum,
    bxgyConfig: BxgyConfigSchema.optional().nullable(),
});

export type ProductActivePromotion = z.infer<typeof ProductActivePromotionSchema>;