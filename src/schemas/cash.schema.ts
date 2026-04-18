//File: frontend/src/schemas/cash.schema.ts

import { z } from "zod";

export const CashStatusEnum = z.enum(['OPEN', 'CLOSED']);
export const MovementTypeEnum = z.enum(['INCOME', 'EXPENSE']);

export const cashShiftSchema = z.object({
    _id: z.string(),
    openedBy: z.union([z.string(), z.object({ _id: z.string(), nombre: z.string() }).passthrough()]),
    closedBy: z.union([z.string(), z.object({ _id: z.string(), nombre: z.string() }).passthrough()]).optional().nullable(),
    status: CashStatusEnum,
    openingDate: z.coerce.date(),
    closingDate: z.coerce.date().optional().nullable(),
    initialBalance: z.number(),
    totalSalesCash: z.number().default(0),
    totalIncomes: z.number().default(0),
    totalExpenses: z.number().default(0),
    expectedBalance: z.number().default(0),
    realBalance: z.number().optional().nullable(),
    difference: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
});

export const cashSummarySchema = z.object({
    shift: cashShiftSchema,
    calculatedTotal: z.number(),
    salesCount: z.number(),
});

export type CashShift = z.infer<typeof cashShiftSchema>;
export type CashSummary = z.infer<typeof cashSummarySchema>;