// File: frontend/src/schemas/order-v3.schema.ts
import { z } from "zod";

// ============================================================================
// ── 1. SUB-ESQUEMAS DE FORMULARIO (Checkout Frontend)
// ============================================================================

export const CustomerProfileSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").trim(),
    apellidos: z.string().min(1, "Los apellidos son requeridos").trim(),
    email: z.string().email("Ingresa un correo electrónico válido").trim(),
    telefono: z.string().min(7, "El teléfono debe tener al menos 7 dígitos").trim(),
    tipoDocumento: z.enum(["DNI", "RUC", "CE"]).optional(),
    numeroDocumento: z.string().trim().optional(),
});
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;

export const ShippingAddressSchema = z.object({
    departamento: z.string().min(1, "El departamento es requerido").trim(),
    provincia: z.string().min(1, "La provincia es requerida").trim(),
    distrito: z.string().min(1, "El distrito es requerido").trim(),
    direccion: z.string().min(1, "La dirección es requerida").trim(),
    numero: z.string().trim().optional(),
    pisoDpto: z.string().trim().optional(),
    referencia: z.string().trim().optional(),
});
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const CartItemDTOSchema = z.object({
    productId: z.string().min(1, "ID de producto inválido"),
    variantId: z.string().optional(),
    quantity: z.number().int().positive("La cantidad debe ser mayor a 0"),
});
export type CartItemDTO = z.infer<typeof CartItemDTOSchema>;

// ============================================================================
// ── 2. ESQUEMAS DE MUTACIÓN (DTOs para POST/PUT)
// ============================================================================

export const CreateOrderDTOSchema = z.object({
    customerProfile: CustomerProfileSchema,
    shippingAddress: ShippingAddressSchema,
    items: z.array(CartItemDTOSchema).min(1, "El carrito no puede estar vacío"),
    notes: z.string().max(300, "Las notas no pueden superar 300 caracteres").optional(),
    currency: z.string().default("PEN"),
    discountCode: z.string().trim().optional(),
});
export type CreateOrderDTO = z.infer<typeof CreateOrderDTOSchema>;

// ============================================================================
// ── 3. ENVOLTORIO GENÉRICO DE RESPUESTA API (Fetch/Axios)
// ============================================================================

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean().optional(),
        statusCode: z.number().optional(),
        message: z.string().optional(),
        data: dataSchema,
        timestamp: z.string().optional(),
    });

// ============================================================================
// ── 4. ESQUEMAS DE RESPUESTA (Lectura desde el Backend)
// ============================================================================

export const OrderItemResponseSchema = z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    nombre: z.string(),
    quantity: z.number(),
    price: z.number(),
    imagen: z.string().optional(),
    sku: z.string().optional(),
});
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;

export const OrderResponseSchema = z.object({
    _id: z.string(),
    orderNumber: z.string(),
    culqiOrderId: z.string().optional(),
    culqiAmountInCents: z.number().optional(),
    user: z.string().nullable().optional(),
    customerProfile: CustomerProfileSchema,
    shippingAddress: ShippingAddressSchema,
    items: z.array(OrderItemResponseSchema),
    subtotal: z.number(),
    shippingCost: z.number(),
    discountAmount: z.number().default(0),
    totalPrice: z.number(),
    currency: z.string(),
    status: z.string(),
    payment: z.object({
        provider: z.string(),
        method: z.string().optional(),
        status: z.string(),
        transactionId: z.string().optional(),
    }).optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
});
export type OrderResponse = z.infer<typeof OrderResponseSchema>;

// NUEVO: Esquema Zod para validar y tipar correctamente la respuesta paginada
export const PaginatedOrderResponseSchema = z.object({
    success: z.boolean().optional(),
    message: z.string().optional(),
    data: z.array(OrderResponseSchema),
    total: z.number().optional().default(0),
    page: z.number().optional(),
    limit: z.number().optional()
});