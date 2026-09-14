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