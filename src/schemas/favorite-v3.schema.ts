// File: frontend/src/schemas/favorite-v3.schema.ts
import { z } from "zod";

export const FavoriteToggleResponseSchema = z.object({
  action: z.enum(["added", "removed"]),
  productId: z.string()
});
export type FavoriteToggleResponse = z.infer<typeof FavoriteToggleResponseSchema>;

export const FavoriteSyncResponseSchema = z.array(z.string());

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string(),
  });