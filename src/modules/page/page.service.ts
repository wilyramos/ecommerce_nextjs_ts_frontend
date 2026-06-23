// File: frontend/src/modules/media/page/services/page.service.ts
import "server-only";

import { getTokenOptional } from "../../auth/dal";
import { CreatePageInput, UpdatePageInput } from "./page.schema";

const API_URL = process.env.API_URL;

/**
 * Helper interno para generar las cabeceras con el token de sesión si existe
 */
async function getHeaders(isMutation = false): Promise<HeadersInit> {
    const token = await getTokenOptional();
    const headers: Record<string, string> = {};

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    if (isMutation) {
        headers["Content-Type"] = `application/json`;
    }

    return headers;
}

export const PageService = {
    /**
     * Obtiene el listado completo y paginado de páginas para la administración
     */
    async getAllPages(page: number = 1, limit: number = 10) {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/pages/admin?page=${page}&limit=${limit}`, {
            method: "GET",
            headers,
            next: { tags: ["pages-list"] },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener el listado de páginas.");
        }

        return response.json();
    },

    /**
     * Obtiene el detalle de una página mediante su ID
     */
    async getPageById(id: string) {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/pages/${id}`, {
            method: "GET",
            headers,
            next: { tags: [`page-${id}`] },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Error al obtener el detalle de la página.");
        }

        return response.json();
    },

    /**
     * Envía la petición para registrar una nueva página
     */
    async createPage(data: CreatePageInput) {
        const headers = await getHeaders(true);
        const response = await fetch(`${API_URL}/pages`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || "Error al crear la página institucional.");
        }

        return result;
    },

    /**
     * Envía la petición para actualizar una página existente
     */
    async updatePage(id: string, data: Omit<UpdatePageInput, "id">) {
        const headers = await getHeaders(true);
        const response = await fetch(`${API_URL}/pages/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || "Error al actualizar la página institucional.");
        }

        return result;
    },

    /**
     * Remueve físicamente una página del sistema si cumple las reglas de negocio
     */
    async deletePage(id: string) {
        const headers = await getHeaders();
        const response = await fetch(`${API_URL}/pages/${id}`, {
            method: "DELETE",
            headers,
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.message || "Error al intentar eliminar la página.");
        }

        return result;
    },
};