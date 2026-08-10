// frontend/src/services/product-service-v3.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import {
    AdminProductSearchResponseSchema,
    type ProductSearchResult
} from "../schemas/product-v3.schema";

export class ProductService {
    constructor(private readonly http: HttpClient) { }

    async searchForAdmin(
        query: string,
        limit: number = 10,
        token?: string
    ): Promise<ProductSearchResult[]> {
        const params = new URLSearchParams({
            q: query.trim(),
            limit: limit.toString(),
        });

        // La ruta base en HttpClient ya incluye /api, por lo que usamos la ruta montada en express: /products/v2
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