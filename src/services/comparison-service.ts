import { Comparison, ComparisonFormValues } from "../schemas/comparison.schema";
import { verifySession } from "../auth/dal";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

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
            next: { tags: ["comparisons"] }
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
            next: { tags: [`comparison-${slug}`], revalidate: 3600 }
        });

        if (!res.ok) throw new Error("Comparativa no encontrada");
        return await res.json();
    }

    /**
     * Recupera una comparativa específica mediante su ID único (Para administración).
     */
    static async getById(id: string): Promise<{ status: string; data: Comparison }> {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            },
            next: { tags: [`comparison-${id}`] }
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
     * Envía la petición de creación al backend resolviendo la sesión internamente.
     */
    static async create(data: ComparisonFormValues) {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al crear la comparativa");
        return result;
    }

    /**
     * Envía la petición de actualización al backend resolviendo la sesión internamente.
     */
    static async update(id: string, data: Partial<ComparisonFormValues>) {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.token}`
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al actualizar la comparativa");
        return result;
    }

    /**
     * Ejecuta el borrado lógico en el backend resolviendo la sesión internamente.
     */
    static async delete(id: string) {
        const session = await verifySession();
        const res = await fetch(`${API_URL}/comparisons/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${session.token}`
            }
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message || "Error al eliminar la comparativa");
        return result;
    }
}