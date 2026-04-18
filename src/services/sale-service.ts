/*  
    File: frontend/src/actions/sale-actions.ts 
    @Author: whramos 
    @Date: 11-04-2024
    @Last Modified by: whramos
    @Last Modified time: 11-04-2024
*/

import "server-only";
import getToken from "../auth/token";
import { saleSchema, Sale } from "@/src/schemas/sale.schema";
import { z } from "zod";

/**
 * Interfaces para respuestas paginadas
 */
export interface PaginatedSales {
    success: boolean;
    sales: Sale[];
    total: number;
    totalPages: number;
    currentPage: number;
}

/**
 * SERVICIO DE VENTAS (SERVER-ONLY)
 */
export const SaleService = {
    
    /**
     * Obtiene el historial de ventas con filtros y paginación
     */
    getHistory: async (page: number = 1, limit: number = 10, search: string = ""): Promise<PaginatedSales> => {
        const token = await getToken();
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search })
        });

        const res = await fetch(`${process.env.API_URL}/sales/v2?${params.toString()}`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            next: { 
                tags: ['sales'], // Permite revalidar todas las ventas
                revalidate: 30   // Cache de 30 segundos para datos frescos
            }
        });

        if (!res.ok) throw new Error("Error al obtener historial de ventas");
        
        const data = await res.json();
        
        // Validamos el array de ventas con Zod para asegurar integridad
        const validatedSales = z.array(saleSchema).safeParse(data.sales);
        
        if (!validatedSales.success) {
            console.error("Zod Validation Error (Sales History):", validatedSales.error.format());
        }

        return data as PaginatedSales;
    },

    /**
     * Obtiene una venta o proforma específica por ID
     */
    getById: async (id: string): Promise<Sale | null> => {
        const token = await getToken();
        
        // Nota: Si tu backend no tiene un GET /:id, este servicio consumirá el endpoint de ticket o detalle
        const res = await fetch(`${process.env.API_URL}/sales/v2/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { tags: [`sale-${id}`] }
        });

        if (!res.ok) return null;

        const data = await res.json();
        const result = saleSchema.safeParse(data.sale || data);

        if (!result.success) {
            console.error(`Error validando venta ${id}:`, result.error.format());
            return null;
        }

        return result.data;
    },

    /**
     * Obtiene listado de proformas (Quotes) pendientes
     */
    getQuotes: async (): Promise<Sale[]> => {
        const token = await getToken();

        const res = await fetch(`${process.env.API_URL}/sales/v2/quotes`, {
            headers: { 'Authorization': `Bearer ${token}` },
            next: { 
                tags: ['quotes'],
                revalidate: 0 // Las proformas suelen ser volátiles, no cachear
            }
        });

        if (!res.ok) throw new Error("Error al obtener proformas");

        const data = await res.json();
        const validated = z.array(saleSchema).safeParse(data.quotes);

        return validated.success ? validated.data : [];
    }
};