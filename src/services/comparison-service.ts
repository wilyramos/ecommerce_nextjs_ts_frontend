import { Comparison, ComparisonFormValues } from "../schemas/comparison.schema";

const API_URL = process.env.API_URL;

export class ComparisonService {
    /**
     * Obtiene el listado de comparativas con filtros (público o administrativo).
     */
    static async getAll(filters: { isActive?: boolean; isFeatured?: boolean; search?: string; limit?: number; page?: number } = {}) {
        const params = new URLSearchParams();
        if (filters.isActive !== undefined) params.append("isActive", String(filters.isActive));
        if (filters.isFeatured !== undefined) params.append("isFeatured", String(filters.isFeatured));
        if (filters.search) params.append("search", filters.search);
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.page) params.append("page", String(filters.page));

        const res = await fetch(`${API_URL}/comparisons?${params.toString()}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { tags: ["comparisons"] } // Next.js 15 Cache Tag
        });

        if (!res.ok) throw new Error("Error al obtener las comparativas");
        return await res.json();
    }

    /**
     * Recupera una comparativa específica mediante su slug.
     */
    static async getBySlug(slug: string, isPublic: boolean = true): Promise<{ status: string; data: Comparison }> {
        const res = await fetch(`${API_URL}/comparisons/slug/${slug}?isPublic=${isPublic}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { tags: [`comparison-${slug}`], revalidate: 3600 } // Caché de 1 hora o bajo demanda
        });

        if (!res.ok) throw new Error("Comparativa no encontrada");
        return await res.json();
    }

    /**
     * Obtiene comparativas vinculadas a un producto específico para enlazado interno SEO.
     */
    static async getRelatedToProduct(productId: string, limit?: number): Promise<{ status: string; data: Comparison[] }> {
        const params = limit ? `?limit=${limit}` : "";
        const res = await fetch(`${API_URL}/comparisons/product/${productId}${params}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            next: { tags: [`product-comparisons-${productId}`] }
        });

        if (!res.ok) throw new Error("Error al obtener comparativas del producto");
        return await res.json();
    }

    /**
     * Envía la petición de creación al backend con el token de autorización JWT.
     */
    static async create(data: ComparisonFormValues, token: string) {
        const res = await fetch(`${API_URL}/comparisons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al crear la comparativa");
        return result;
    }

    /**
     * Envía la petición de actualización al backend.
     */
    static async update(id: string, data: Partial<ComparisonFormValues>, token: string) {
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al actualizar la comparativa");
        return result;
    }

    /**
     * Ejecuta el borrado lógico en el backend.
     */
    static async delete(id: string, token: string) {
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al eliminar la comparativa");
        return result;
    }
}