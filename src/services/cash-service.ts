//File: frontend/src/services/cash-service.ts

/* File: frontend/src/services/cash-service.ts 
    @Author: whramos 
    @Date: 11-04-2024
    @Description: Server-only service for retrieving cash shift data and status.
*/

import "server-only";
import getToken from "../auth/token";
import { cashShiftSchema, cashSummarySchema, CashShift, CashSummary } from "@/src/schemas/cash.schema";

const API_URL = process.env.API_URL;

export const CashService = {
    /**
     * Verifica si existe un turno de caja abierto actualmente.
     * Endpoint: GET /api/cash/status
     */
    getStatus: async (): Promise<{ isOpen: boolean; shift: CashShift | null }> => {
        const token = await getToken();
        
        try {
            const res = await fetch(`${API_URL}/cash/v2/status`, {
                headers: { 'Authorization': `Bearer ${token}` },
                next: { 
                    tags: ['cash-status'],
                    revalidate: 0 // La caja es crítica, no debe cachearse por mucho tiempo
                }
            });

            if (!res.ok) return { isOpen: false, shift: null };

            const data = await res.json();
            
            if (!data.shift) return { isOpen: false, shift: null };

            const validated = cashShiftSchema.safeParse(data.shift);
            
            return {
                isOpen: data.isOpen,
                shift: validated.success ? validated.data : null
            };
        } catch (error) {
            console.error("CashService getStatus Error:", error);
            return { isOpen: false, shift: null };
        }
    },

    /**
     * Obtiene el resumen detallado de un arqueo de caja específico.
     * Endpoint: GET /api/cash/v2/summary/:shiftId
     */
    getSummary: async (shiftId: string): Promise<CashSummary | null> => {
        const token = await getToken();

        const res = await fetch(`${API_URL}/cash/v2/summary/${shiftId}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            cache: 'no-store'
        });

        if (!res.ok) return null;

        const data = await res.json();
        
        // El backend devuelve { success: true, summary: { ... } }
        const validated = cashSummarySchema.safeParse(data.summary);

        if (!validated.success) {
            console.error("Zod Validation Error (Cash Summary):", validated.error.format());
            return null;
        }

        return validated.data;
    }
};