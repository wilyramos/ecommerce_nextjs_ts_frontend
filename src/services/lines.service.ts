import { cookies } from "next/headers";
import { ProductLine } from "@/src/schemas/line.schema";

const API_URL = process.env.API_URL;

class LinesService {

    constructor() {
        if (!API_URL) {
            throw new Error("API_URL is not defined in .env");
        }
    }

    /**
     * Helper privado para realizar peticiones GET autenticadas.
     * Reutiliza el token de las cookies para que el backend sepa quién pide los datos.
     */
    private async get<T>(endpoint: string): Promise<T> {
        const cookieStore = await cookies();
        const token = cookieStore.get("ecommerce-token")?.value;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Limpieza de URL
        const baseUrl = API_URL?.replace(/\/$/, "");
        const cleanEndpoint = endpoint.replace(/^\//, "");

        const res = await fetch(`${baseUrl}/${cleanEndpoint}`, {
            method: "GET",
            headers,
            cache: "no-store", // Vital para que el Admin siempre vea datos frescos
        });

        if (!res.ok) {
            // Manejo simple de errores de lectura
            if (res.status === 404) return [] as T; // Si no hay datos, retornamos array vacío o null según el caso
            throw new Error(`Error fetching ${endpoint}: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data || json;
    }

    // --- MÉTODOS DE LECTURA (Queries) ---
    // Solo lo que usa tu page.tsx

    /**
     * Obtiene todas las líneas para la tabla principal.
     */
    async getAll(): Promise<ProductLine[]> {
        return this.get<ProductLine[]>("lines");
    }

    /**
     * (Opcional) Si en algún lugar necesitas filtrar solo las activas
     */
    async getAllActive(): Promise<ProductLine[]> {
        return this.get<ProductLine[]>("lines?active=true");
    }

    /**
     * (Opcional) Útil si vas a crear una página de detalle /admin/lines/[slug]
     */
    async getBySlug(slug: string): Promise<ProductLine | null> {
        try {
            return await this.get<ProductLine>(`lines/slug/${slug}`);
        } catch (error) {
            console.error(`Error fetching line with slug ${slug}:`, error);
            return null;
        }
    }
}

export const linesService = new LinesService();