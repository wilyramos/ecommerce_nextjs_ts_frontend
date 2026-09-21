// File: frontend/src/services/auth-v3.service.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";

export class AuthService {
    constructor(private readonly http: HttpClient) { }

    /**
     * Inicia sesión y obtiene el token y datos del usuario
     */

    /**
     * Actualiza la contraseña del usuario autenticado
     */
    async updatePassword(
        payload: { currentPassword: string; newPassword: string },
        token: string
    ): Promise<boolean> {
        await this.http.put<unknown>("/auth/v3/update-password", payload, {
            token,
            cache: "no-store"
        });
        return true;
    }
}

export const authService = new AuthService(apiHttpClient);