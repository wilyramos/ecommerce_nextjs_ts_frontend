// src/services/lines.service.ts
import "server-only"

import { verifySession } from "@/src/auth/dal";
import { ProductLine } from "@/src/schemas/line.schema";

const API_URL = process.env.API_URL;

class LinesService {
    private async get<T>(endpoint: string): Promise<T> {
        const { token } = await verifySession();

        const baseUrl = API_URL?.replace(/\/$/, "");
        const cleanEndpoint = endpoint.replace(/^\//, "");

        const res = await fetch(`${baseUrl}/${cleanEndpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            if (res.status === 404) return [] as T;
            throw new Error(`Error fetching ${endpoint}: ${res.statusText}`);
        }

        const json = await res.json();
        return json.data || json;
    }

    async getAll(): Promise<ProductLine[]> {
        return this.get<ProductLine[]>("lines");
    }

    async getAllActive(): Promise<ProductLine[]> {
        return this.get<ProductLine[]>("lines?active=true");
    }

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