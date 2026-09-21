// File: frontend/src/services/user-v3.service.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import {
    UserBaseSchema,
    ApiResponseSchema,
    type UserResponse,
    type UpdateProfileDTO,
} from "../schemas/user-v3.schema";

export const USER_PROFILE_CACHE_TAG = "user-profile-v3";

export class UserService {
    constructor(private readonly http: HttpClient) { }

    async getProfile(token: string): Promise<UserResponse> {
        const ResponseSchema = ApiResponseSchema(UserBaseSchema);
        const response = await this.http.get<unknown>("/users/v3/profile", {
            token,
            next: { tags: [USER_PROFILE_CACHE_TAG] },
        });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    async updateProfile(dto: UpdateProfileDTO, token: string): Promise<UserResponse> {
        const ResponseSchema = ApiResponseSchema(UserBaseSchema);
        const response = await this.http.put<unknown>("/users/v3/profile", dto, {
            token,
        });
        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }
}

export const userService = new UserService(apiHttpClient);