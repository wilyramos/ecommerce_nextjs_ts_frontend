// File: frontend/src/schemas/inventory.schema.ts

import { z } from "zod";

// ── 1. Ítem de Inventario (Tabla Principal) ──────────────────────────────────
export const InventoryItemSchema = z.object({
    productId: z.string(),
    variantId: z.string().nullable().optional(),
    nombre: z.string(),
    sku: z.string(),
    barcode: z.string().optional(),
    stock: z.number(),
    price: z.number(),
    imagen: z.string().nullable().optional(),
    isActive: z.boolean(),
    hasVariants: z.boolean(),
});

export type InventoryItem = z.infer<typeof InventoryItemSchema>;

// ── 2. Respuesta Paginada del Listado ─────────────────────────────────────────
export const InventoryPaginatedResponseSchema = z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: z.array(InventoryItemSchema),
    meta: z.object({
        total: z.number(),
        page: z.number(),
        pages: z.number(),
        limit: z.number(),
    }),
});

export type InventoryPaginatedResponse = z.infer<typeof InventoryPaginatedResponseSchema>;

// ── 3. DTO para Ajuste Manual de Stock ───────────────────────────────────────
export const AdjustStockDTOSchema = z.object({
    productId: z.string().min(1, "El ID de producto es requerido"),
    variantId: z.string().optional(),
    newStock: z.number().min(0, "El stock debe ser un número igual o mayor a 0"),
    reason: z.string().min(3, "Ingresa un motivo descriptivo para la auditoría"),
});

export type AdjustStockDTO = z.infer<typeof AdjustStockDTOSchema>;

// ── 4. Historial de Auditoría (Logs de Movimientos) ──────────────────────────
export const InventoryLogProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    sku: z.string().optional(),
});

export const InventoryLogSchema = z.object({
    _id: z.string(),
    productId: InventoryLogProductSchema,
    variantId: z.string().optional(),
    type: z.enum(["adjustment", "sale", "return", "purchase"]),
    quantityChange: z.number(),
    previousStock: z.number(),
    newStock: z.number(),
    reason: z.string(),
    actionBy: z.string(),
    referenceId: z.string().optional(),
    createdAt: z.string(),
});

export type InventoryLog = z.infer<typeof InventoryLogSchema>;

export const InventoryLogsResponseSchema = z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: z.array(InventoryLogSchema),
});

export type InventoryLogsResponse = z.infer<typeof InventoryLogsResponseSchema>;