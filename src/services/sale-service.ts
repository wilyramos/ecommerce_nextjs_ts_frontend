/*  
    File: frontend/src/services/sale-service.ts
    @Author: whramos 
    @Date: 11-05-2024
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

export interface SaleFilters {
    page?: number;
    limit?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    cashShiftId?: string;
}

/**
 * SERVICIO DE VENTAS (SERVER-ONLY)
 */
export const SaleService = {

    /**
     * Obtiene el historial de ventas con filtros y paginación
     */
    getHistory: async (filters: SaleFilters = {}): Promise<PaginatedSales> => {
        const token = await getToken();

        const queryParams: Record<string, string> = {
            page: (filters.page || 1).toString(),
            limit: (filters.limit || 10).toString(),
        };

        if (filters.search) queryParams.search = filters.search;
        if (filters.startDate) queryParams.startDate = filters.startDate;
        if (filters.endDate) queryParams.endDate = filters.endDate;
        if (filters.status) queryParams.status = filters.status;
        if (filters.cashShiftId) queryParams.cashShiftId = filters.cashShiftId;

        const params = new URLSearchParams(queryParams);

        const res = await fetch(`${process.env.API_URL}/sales/v2?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            next: {
                tags: ['sales'],
                revalidate: 10
            }
        });

        if (!res.ok) throw new Error("Error al obtener historial de ventas");

        const data = await res.json();

        const validatedSales = z.array(saleSchema).safeParse(data.sales);

        if (!validatedSales.success) {
            console.log("Datos de ventas recibidos:", data.sales);
            console.error("Zod Validation Error (Sales History):", validatedSales.error.format());
        }

        return {
            success: true,
            sales: validatedSales.success ? validatedSales.data : (data.sales as Sale[]),
            total: Number(data.total) || 0,
            totalPages: Number(data.totalPages) || 1,
            currentPage: Number(data.currentPage) || 1
        };
    },

    /**
     * Obtiene una venta o proforma específica por ID
     */
    getById: async (id: string): Promise<Sale | null> => {
        const token = await getToken();

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
                revalidate: 0
            }
        });

        if (!res.ok) throw new Error("Error al obtener proformas");

        const data = await res.json();
        const validated = z.array(saleSchema).safeParse(data.quotes);

        return validated.success ? validated.data : (data.quotes as Sale[]);
    },

    /**
     * Genera la URL para exportación sin usar 'any'
     */
    getExportUrl: (filters: Omit<SaleFilters, 'page' | 'limit'>): string => {
        const cleanFilters: Record<string, string> = {};

        // Mapeo seguro de filtros para URLSearchParams
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                cleanFilters[key] = String(value);
            }
        });

        const params = new URLSearchParams(cleanFilters);
        return `${process.env.API_URL}/sales/v2/export?${params.toString()}`;
    }
};