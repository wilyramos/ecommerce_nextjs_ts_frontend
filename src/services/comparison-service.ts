// frontend/src/services/comparison-service.ts

import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import {
    ComparisonSchema,
    ApiResponseSchema,
    type CreateComparisonDTO,
    type UpdateComparisonDTO,
    type ComparisonResponse,
} from "../schemas/comparison.schema";
import { z } from "zod";

export class ComparisonService {
    constructor(private readonly http: HttpClient) {}

    // ── PUBLIC ENDPOINTS ───────────────────────────────────────

    async getAllPublic(
        filters: { search?: string; page?: number; limit?: number } = {}
    ) {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const query = params.toString() ? `?${params.toString()}` : "";
        const PaginatedSchema = ApiResponseSchema(z.array(ComparisonSchema));

        const response = await this.http.get<unknown>(`/comparisons${query}`, {
            cache: "no-store",
        });

        const parsed = PaginatedSchema.parse(response);
        return {
            items: parsed.data,
            meta: parsed.meta!,
        };
    }

    async getBySlug(slug: string): Promise<ComparisonResponse> {
        const SingleSchema = ApiResponseSchema(ComparisonSchema);
        const response = await this.http.get<unknown>(`/comparisons/slug/${slug}`, {
            cache: "no-store",
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async getByProduct(productId: string): Promise<ComparisonResponse[]> {
        const ArraySchema = ApiResponseSchema(z.array(ComparisonSchema));
        const response = await this.http.get<unknown>(`/comparisons/product/${productId}`, {
            cache: "no-store",
        });
        const parsed = ArraySchema.parse(response);
        return parsed.data;
    }

    // ── ADMIN ENDPOINTS ────────────────────────────────────────

    async getAllAdmin(
        filters: { search?: string; page?: number; limit?: number } = {},
        token?: string
    ) {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));

        const query = params.toString() ? `?${params.toString()}` : "";
        const PaginatedSchema = ApiResponseSchema(z.array(ComparisonSchema));

        const response = await this.http.get<unknown>(`/comparisons/admin${query}`, {
            token,
            cache: "no-store",
        });

        const parsed = PaginatedSchema.parse(response);
        return {
            items: parsed.data,
            meta: parsed.meta!,
        };
    }

    async getById(id: string, token?: string): Promise<ComparisonResponse> {
        const SingleSchema = ApiResponseSchema(ComparisonSchema);
        const response = await this.http.get<unknown>(`/comparisons/admin/${id}`, {
            token,
            cache: "no-store",
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async createComparison(dto: CreateComparisonDTO, token?: string): Promise<ComparisonResponse> {
        const SingleSchema = ApiResponseSchema(ComparisonSchema);
        const response = await this.http.post<unknown>("/comparisons/admin", dto, { token });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async updateComparison(id: string, dto: UpdateComparisonDTO, token?: string): Promise<ComparisonResponse> {
        const SingleSchema = ApiResponseSchema(ComparisonSchema);
        const response = await this.http.put<unknown>(`/comparisons/admin/${id}`, dto, { token });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async toggleStatus(id: string, token?: string): Promise<ComparisonResponse> {
        const SingleSchema = ApiResponseSchema(ComparisonSchema);
        const response = await this.http.patch<unknown>(`/comparisons/admin/${id}/toggle-status`, undefined, {
            token,
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async toggleFeatured(id: string, token?: string): Promise<ComparisonResponse> {
        const SingleSchema = ApiResponseSchema(ComparisonSchema);
        const response = await this.http.patch<unknown>(`/comparisons/admin/${id}/toggle-featured`, undefined, {
            token,
        });
        const parsed = SingleSchema.parse(response);
        return parsed.data;
    }

    async deleteComparison(id: string, token?: string): Promise<void> {
        await this.http.delete(`/comparisons/admin/${id}`, { token });
    }
}

export const comparisonService = new ComparisonService(apiHttpClient);