// File: frontend/src/services/category-v3.service.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import { z } from "zod";
import {
    CategoryBaseSchema,
    CategoryTreeSchema,
    ApiResponseSchema,
    type CreateCategoryDTO,
    type UpdateCategoryDTO,
    type CategoryResponse,
    type CategoryTreeItem,
} from "../schemas/category-v3.schema";

export const CATEGORIES_CACHE_TAG = "categories-tree";
export const getCategoryItemTag = (id: string) => `category-${id}`;
export const getCategorySlugTag = (slug: string) => `category-slug-${slug}`;

export interface CategoryDeletePreview {
    canDelete: boolean;
    childrenCount: number;
    childrenNames: string[];
    productsCount: number;
}

const DeletePreviewSchema = z.object({
    canDelete: z.boolean(),
    childrenCount: z.number(),
    childrenNames: z.array(z.string()),
    productsCount: z.number(),
});

export class CategoryService {
    constructor(private readonly http: HttpClient) {}

    async getTree(): Promise<CategoryTreeItem[]> {
        const ResponseSchema = ApiResponseSchema(z.array(CategoryTreeSchema));
        const response = await this.http.get<unknown>("/categories/v3/tree", {
            next: { tags: [CATEGORIES_CACHE_TAG] },
        });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async getById(id: string): Promise<CategoryResponse> {
        const ResponseSchema = ApiResponseSchema(CategoryBaseSchema);
        const response = await this.http.get<unknown>(`/categories/v3/${id}`, {
            next: { tags: [CATEGORIES_CACHE_TAG, getCategoryItemTag(id)] },
        });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async getBySlug(slug: string): Promise<CategoryResponse> {
        const ResponseSchema = ApiResponseSchema(CategoryBaseSchema);
        const response = await this.http.get<unknown>(`/categories/v3/slug/${slug}`, {
            next: { tags: [CATEGORIES_CACHE_TAG, getCategorySlugTag(slug)] },
        });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async getDeletePreview(id: string, token?: string): Promise<CategoryDeletePreview> {
        const ResponseSchema = ApiResponseSchema(DeletePreviewSchema);
        const response = await this.http.get<unknown>(`/categories/v3/${id}/delete-preview`, {
            token,
            cache: "no-store",
        });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async createCategory(dto: CreateCategoryDTO, token?: string): Promise<CategoryResponse> {
        const ResponseSchema = ApiResponseSchema(CategoryBaseSchema);
        const response = await this.http.post<unknown>("/categories/v3", dto, { token });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async updateCategory(id: string, dto: UpdateCategoryDTO, token?: string): Promise<CategoryResponse> {
        const ResponseSchema = ApiResponseSchema(CategoryBaseSchema);
        const response = await this.http.put<unknown>(`/categories/v3/${id}`, dto, { token });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async toggleStatus(id: string, token?: string): Promise<CategoryResponse> {
        const ResponseSchema = ApiResponseSchema(CategoryBaseSchema);
        const response = await this.http.patch<unknown>(`/categories/v3/${id}/toggle-status`, undefined, { token });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async bulkUpdateStatus(ids: string[], isActive: boolean, token?: string): Promise<void> {
        await this.http.put("/categories/v3/bulk-status", { ids, isActive }, { token });
    }

    async bulkDelete(ids: string[], token?: string): Promise<void> {
        await this.http.post("/categories/v3/bulk-delete", { ids }, { token });
    }

    async reorder(payload: { items: { id: string; order: number; parent?: string | null }[] }, token?: string): Promise<void> {
        await this.http.put("/categories/v3/reorder", payload, { token });
    }

    async deleteCategory(id: string, token?: string): Promise<void> {
        await this.http.delete(`/categories/v3/${id}`, { token });
    }
}

export const categoryService = new CategoryService(apiHttpClient);