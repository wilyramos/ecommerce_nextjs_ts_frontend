//File: frontend/src/infrastructure/api/api-server-client.ts

import { cookies } from "next/headers";

export async function apiServerClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = process.env.API_URL || "http://localhost:4000/api";
    
    // Aquí sí usamos la utilidad de servidor
    const cookieStore = await cookies();
    const token = cookieStore.get("ecommerce-token")?.value;

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en la petición de servidor");
    }

    return data as T;
}