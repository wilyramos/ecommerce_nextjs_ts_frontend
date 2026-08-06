// File: frontend/src/services/discount-service.ts

import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import {
    DiscountSchema,
    ValidateCouponResponseSchema,
    EvaluateAutomaticResponseSchema,
    DiscountAnalyticsResponseSchema,
    ApiResponseSchema,
    type CreateDiscountDTO,
    type DiscountResponse,
    type ValidateCouponItem,
    type ValidateCouponResponse,
    type EvaluateAutomaticResponse,
    type DiscountAnalyticsResponse,
} from "../schemas/discount.schema";
import { z } from "zod";

export class DiscountService {
    constructor(private readonly http: HttpClient) {}

    async getAllDiscounts(
        filters: { search?: string; page?: number; limit?: number } = {},
        token?: string
    ) {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const query = params.toString() ? `?${params.toString()}` : "";
        const PaginatedSchema = ApiResponseSchema(z.array(DiscountSchema));

        const response = await this.http.get<unknown>(`/discounts${query}`, {
            token,
            cache: "no-store",
        });

        const parsed = PaginatedSchema.parse(response);
        return {
            items: parsed.data,
            meta: parsed.meta!,
        };
    }

    // Método para obtener una promoción por su ID
    async getDiscountById(id: string, token?: string): Promise<DiscountResponse> {
        const SingleSchema = ApiResponseSchema(DiscountSchema);
        const response = await this.http.get<unknown>(`/discounts/${id}`, {
            token,
            cache: "no-store",
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async createDiscount(dto: CreateDiscountDTO, token?: string): Promise<DiscountResponse> {
        const SingleSchema = ApiResponseSchema(DiscountSchema);
        const response = await this.http.post<unknown>("/discounts", dto, { token });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async toggleStatus(id: string, token?: string): Promise<DiscountResponse> {
        const SingleSchema = ApiResponseSchema(DiscountSchema);
        const response = await this.http.patch<unknown>(`/discounts/${id}/toggle`, undefined, {
            token,
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async deleteDiscount(id: string, token?: string): Promise<void> {
        await this.http.delete(`/discounts/${id}`, { token });
    }

    // Evaluación automática al actualizar el carrito
    async evaluateAutomaticDiscounts(
        subtotal: number,
        cartItems: ValidateCouponItem[]
    ): Promise<EvaluateAutomaticResponse> {
        const SingleSchema = ApiResponseSchema(EvaluateAutomaticResponseSchema);
        const response = await this.http.post<unknown>("/discounts/evaluate-automatic", {
            subtotal,
            cartItems,
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    // Validación explícita por código en checkout
    async validateCoupon(
        code: string,
        subtotal: number,
        cartItems: ValidateCouponItem[],
        userId?: string
    ): Promise<ValidateCouponResponse> {
        const SingleSchema = ApiResponseSchema(ValidateCouponResponseSchema);
        const response = await this.http.post<unknown>("/discounts/validate", {
            code,
            subtotal,
            cartItems,
            userId,
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async getDiscountAnalytics(code: string, token?: string): Promise<DiscountAnalyticsResponse> {
        const SingleSchema = ApiResponseSchema(DiscountAnalyticsResponseSchema);
        const response = await this.http.get<unknown>(
            `/discounts/${encodeURIComponent(code)}/analytics`,
            { token, cache: "no-store" }
        );
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async getAutomaticDiscountsForProduct(productId: string, token?: string): Promise<DiscountResponse[]> {
        try {
            const SingleSchema = ApiResponseSchema(z.array(DiscountSchema));
            const response = await this.http.get<unknown>(`/discounts/product/${productId}/automatic`, {
                token,
                cache: "no-store",
            });
            const parsed = SingleSchema.parse(response);
            return parsed.data;
        } catch (error) {
            console.error("Error al obtener promociones automáticas del producto:", error);
            return [];
        }
    }
}

export const discountService = new DiscountService(apiHttpClient);