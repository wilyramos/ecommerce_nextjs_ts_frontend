// File: frontend/src/services/favorite-v3.service.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import { 
  FavoriteToggleResponseSchema, 
  FavoriteSyncResponseSchema,
  ApiResponseSchema
} from "../schemas/favorite-v3.schema";

export class FavoriteService {
  constructor(private readonly http: HttpClient) {}

  async toggle(productId: string, token: string) {
    const ResponseSchema = ApiResponseSchema(FavoriteToggleResponseSchema);
    const response = await this.http.post<unknown>("/favorites/v3/toggle", { productId }, { token });
    return ResponseSchema.parse(response).data;
  }

  async sync(productIds: string[], token: string) {
    const ResponseSchema = ApiResponseSchema(FavoriteSyncResponseSchema);
    const response = await this.http.post<unknown>("/favorites/v3/sync", { productIds }, { token });
    return ResponseSchema.parse(response).data;
  }

  async getMine(token: string) {
    const ResponseSchema = ApiResponseSchema(FavoriteSyncResponseSchema);
    const response = await this.http.get<unknown>("/favorites/v3/mine", { token });
    return ResponseSchema.parse(response).data;
  }
}

export const favoriteService = new FavoriteService(apiHttpClient);