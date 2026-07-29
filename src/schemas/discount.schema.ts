// File: frontend/src/schemas/discount.schema.ts
import { z } from "zod";

export const DiscountTypeEnum = z.enum(["PERCENTAGE", "FIXED_AMOUNT"]);
export type DiscountType = z.infer<typeof DiscountTypeEnum>;

export const DiscountTargetEnum = z.enum(["ALL_PRODUCTS", "SPECIFIC_PRODUCTS"]);
export type DiscountTarget = z.infer<typeof DiscountTargetEnum>;

export const DiscountSchema = z.object({
    _id: z.string(),
    code: z.string().toUpperCase(),
    description: z.string(),
    type: DiscountTypeEnum,
    value: z.number(),
    target: DiscountTargetEnum,
    applicableProducts: z.array(z.string()).optional(),
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
    code: z
        .string()
        .min(3, "El código debe tener al menos 3 caracteres")
        .max(20, "Máximo 20 caracteres")
        .regex(/^[a-zA-Z0-9_-]+$/, "Formato alfanumérico sin espacios"),
    description: z.string().min(3, "Ingresa una descripción corta"),
    type: DiscountTypeEnum,
    value: z.number().min(0.01, "El valor debe ser mayor a 0"),
    target: DiscountTargetEnum.default("ALL_PRODUCTS"),
    minPurchaseAmount: z.number().min(0, "Monto mínimo debe ser 0 o superior").default(0),
    usageLimitTotal: z.number().nullable().optional(),
    usageLimitPerCustomer: z.number().min(1, "Mínimo 1 uso por cliente").default(1),
    startDate: z.string().min(1, "Selecciona fecha de inicio"),
    endDate: z.string().nullable().optional(),
});

export type CreateDiscountDTO = z.infer<typeof CreateDiscountDTOSchema>;

export const DiscountsPaginatedResponseSchema = z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: z.array(DiscountSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        pages: z.number(),
        limit: z.number(),
    }),
});

export type DiscountsPaginatedResponse = z.infer<typeof DiscountsPaginatedResponseSchema>;


export const ValidateCouponItemSchema = z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number(),
    price: z.number().optional(),
});

export type ValidateCouponItem = z.infer<typeof ValidateCouponItemSchema>;

export const ValidateCouponResponseSchema = z.object({
    code: z.string(),
    type: z.string(),
    value: z.number(),
    discountAmount: z.number(),
    newTotal: z.number(),
});

export type ValidateCouponResponse = z.infer<typeof ValidateCouponResponseSchema>;