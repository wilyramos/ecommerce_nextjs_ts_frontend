import { z } from "zod";
import { productSchema } from "./product.schema";

// ============================================================================
// ── ENUMS DE CONTROL (Espejo del Backend)
// ============================================================================

export const OrderStatusEnum = z.enum([
    'awaiting_payment',
    'processing',
    'shipped',
    'delivered',
    'canceled',
    'paid_but_out_of_stock'
]);
export type OrderStatus = z.infer<typeof OrderStatusEnum>;

export const PaymentStatusEnum = z.enum([
    'pending',
    'approved',
    'rejected',
    'refunded'
]);
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;

export const TipoDocumentoEnum = z.enum(['DNI', 'RUC', 'CE']);
export type TipoDocumento = z.infer<typeof TipoDocumentoEnum>;

// ============================================================================
// ── SUB-SCHEMAS DE SOPORTE
// ============================================================================

export const ShippingAddressSchema = z.object({
    departamento: z.string().trim().min(1, 'El departamento es requerido'),
    provincia:    z.string().trim().min(1, 'La provincia es requerida'),
    distrito:     z.string().trim().min(1, 'El distrito es requerido'),
    direccion:    z.string().trim().min(1, 'La dirección es requerida'),
    numero:       z.string().trim().optional(),
    pisoDpto:     z.string().trim().optional(),
    referencia:   z.string().trim().optional()
});
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;

export const CustomerProfileSchema = z.object({
    nombre:          z.string().trim().min(1, 'El nombre es requerido'),
    apellidos:       z.string().trim().min(1, 'Los apellidos son requeridos'),
    email:           z.string().trim().email('Ingresa un correo electrónico válido'),
    telefono:        z.string().trim().min(7, 'El teléfono debe tener al menos 7 dígitos'),
    tipoDocumento:   TipoDocumentoEnum.optional(),
    numeroDocumento: z.string().trim().optional()
});
export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;

/**
 * Estructura exacta que espera el backend para procesar la orden (Input del Carrito).
 */
export const CartItemInputSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de producto inválido'),
    variantId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de variante inválido').optional(),
    quantity:  z.number().int().positive('La cantidad debe ser mayor a 0')
});
export type CartItemInput = z.infer<typeof CartItemInputSchema>;

/**
 * Ítem histórico devuelto por la API.
 * Permite que `productId` sea el ID string clásico o el sub-esquema del producto
 * completamente poblado con sus variantes, stocks dinámicos e imágenes.
 */
export const OrderItemResponseSchema = z.object({
    productId:         z.union([z.string().regex(/^[0-9a-fA-F]{24}$/), productSchema]),
    variantId:         z.string().optional(),
    variantAttributes: z.record(z.string(), z.string()).optional(),
    quantity:          z.number().int().positive(),
    price:             z.number().min(0),
    nombre:            z.string().trim().min(1),
    imagen:            z.string().optional(),
    sku:               z.string().optional(),
    barcode:           z.string().optional()
});
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;

export const PaymentInfoSchema = z.object({
    provider:      z.string(),
    method:        z.string().optional(),
    transactionId: z.string().optional(),
    status:        PaymentStatusEnum,
    rawResponse:   z.unknown().optional() 
});
export type PaymentInfo = z.infer<typeof PaymentInfoSchema>;

export const StatusHistorySchema = z.object({
    status:    OrderStatusEnum,
    changedAt: z.coerce.date() 
});
export type StatusHistory = z.infer<typeof StatusHistorySchema>;

// ============================================================================
// ── FILTROS DE CONSULTA
// ============================================================================

export const OrderFiltersSchema = z.object({
    status:  OrderStatusEnum.optional(),
    email:   z.string().optional(),
    userId:  z.string().optional(),
    page:    z.number().optional(),
    limit:   z.number().optional(),
    from:    z.string().optional(),
    to:      z.string().optional()
});
export type OrderFilters = z.infer<typeof OrderFiltersSchema>;

// ============================================================================
// ── 1. DTO PARA CREAR ORDEN (REQUEST → Backend)
// ============================================================================

export const CreateOrderDTOSchema = z.object({
    customerProfile: CustomerProfileSchema,
    items:           z.array(CartItemInputSchema).min(1, 'El carrito no puede estar vacío'),
    shippingAddress: ShippingAddressSchema,
    notes:           z.string().max(300, 'Las notas no pueden superar los 300 caracteres').optional(),
    currency:        z.string().default('PEN')
});
export type CreateOrderDTO = z.infer<typeof CreateOrderDTOSchema>;

// ============================================================================
// ── 2. ORDEN COMPLETA (RESPONSE ← Backend)
// ============================================================================

export const OrderResponseSchema = z.object({
    _id:          z.string(),
    orderNumber:  z.string(),
    culqiOrderId: z.string().optional(), // Inyectado para habilitar el flujo multipago (ord_live_...)
    
    // user puede ser el ObjectId string o el documento poblado de forma opcional.
    user: z.union([
        z.string().regex(/^[0-9a-fA-F]{24}$/),
        z.object({
            _id:       z.string(),
            nombre:    z.string(),
            apellidos: z.string().optional(),
            email:     z.string()
        })
    ]).optional(), 

    customerProfile: CustomerProfileSchema,
    items:           z.array(OrderItemResponseSchema),
    subtotal:        z.number(),
    shippingCost:    z.number(),
    totalPrice:      z.number(),
    currency:        z.string(),
    status:          OrderStatusEnum,
    statusHistory:   z.array(StatusHistorySchema),
    shippingAddress: ShippingAddressSchema,
    payment:         PaymentInfoSchema.optional(),
    trackingNumber:  z.string().optional(),
    notes:           z.string().optional(),
    createdAt:       z.coerce.date(),
    updatedAt:       z.coerce.date()
});
export type OrderResponse = z.infer<typeof OrderResponseSchema>;

// ============================================================================
// ── 3. ENVOLTORIOS DE RESPUESTA DE LA API
// ============================================================================

export const OrderApiResponseSchema = z.object({
    ok:   z.literal(true),
    data: OrderResponseSchema
});
export type OrderApiResponse = z.infer<typeof OrderApiResponseSchema>;

export const OrderPaginatedApiResponseSchema = z.object({
    ok:   z.literal(true),
    data: z.array(OrderResponseSchema), 
    meta: z.object({
        total: z.number(),
        page:  z.number(),
        pages: z.number()
    })
});
export type OrderPaginatedApiResponse = z.infer<typeof OrderPaginatedApiResponseSchema>;

// ============================================================================
// ── 4. LABELS Y MAPEOS PARA MÓDULOS DE UI (Frontend Helpers)
// ============================================================================

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    awaiting_payment:      'Esperando pago',
    processing:            'En proceso',
    shipped:               'Enviado',
    delivered:             'Entregado',
    canceled:              'Cancelado',
    paid_but_out_of_stock: 'Pagado — sin stock',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    awaiting_payment:      'yellow',
    processing:            'blue',
    shipped:               'purple',
    delivered:             'green',
    canceled:              'red',
    paid_but_out_of_stock: 'orange',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    pending:  'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    refunded: 'Reembolsado',
};

export const CANCELABLE_STATUSES: OrderStatus[] = [
    'awaiting_payment',
    'processing',
];

export const TERMINAL_STATUSES: OrderStatus[] = [
    'delivered',
    'canceled',
];

// ============================================================================
// ── 5. RESPUESTAS OPTIMIZADAS PARA POLLING
// ============================================================================

export const OrderStatusOnlyResponseSchema = z.object({
    ok: z.literal(true),
    data: z.object({
        status: OrderStatusEnum,
        payment: z.object({
            status: PaymentStatusEnum
        }).optional()
    })
});
export type OrderStatusOnlyResponse = z.infer<typeof OrderStatusOnlyResponseSchema>;