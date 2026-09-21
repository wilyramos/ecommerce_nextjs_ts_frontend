// File: frontend/src/services/product-service-v3.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import {
  AdminProductSearchResponseSchema,
  type ProductSearchResult,
} from "../schemas/product-v3.schema";
import type { TApiProduct } from "@/src/schemas";

export class ProductService {
  constructor(private readonly http: HttpClient) {}

  async getById(id: string): Promise<TApiProduct> {
    const response = await this.http.get<{ success: boolean; data: TApiProduct }>(
      `/products/v3/${id}`
    );
    return response.data;
  }

  async getByIds(ids: string[]): Promise<TApiProduct[]> {
    if (ids.length === 0) return [];
    
    // Si tu backend soporta batch:
    try {
      const response = await this.http.post<{ success: boolean; data: TApiProduct[] }>(
        `/products/v3/batch`,
        { ids }
      );
      return response.data;
    } catch {
      // Fallback resiliente concurrente en cliente
      const settles = await Promise.allSettled(ids.map((id) => this.getById(id)));
      return settles
        .filter(
          (result): result is PromiseFulfilledResult<TApiProduct> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value);
    }
  }

  async searchForAdmin(
    query: string,
    limit: number = 10,
    token?: string
  ): Promise<ProductSearchResult[]> {
    const params = new URLSearchParams({
      q: query.trim(),
      limit: limit.toString(),
    });

    const response = await this.http.get<unknown>(
      `/products/v3/admin/search?${params.toString()}`,
      {
        token,
        cache: "no-store",
      }
    );

    const parsed = AdminProductSearchResponseSchema.parse(response);
    return parsed.data;
  }
}

export const productService = new ProductService(apiHttpClient);