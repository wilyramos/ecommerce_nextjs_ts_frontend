"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifySession } from "@/src/auth/dal";
import {
    createSaleSchema,
    type CreateSalePayload,
    type Sale
} from "@/src/schemas/sale.schema";

/**
 * Interface de respuesta del Backend (Express Controller)
 */
interface BackendSaleResponse {
    success: boolean;
    message: string;
    receiptNumber?: string;
    sale: Sale;
}

/**
 * Interface de respuesta de la Acción para el Frontend
 */
export type SaleActionResponse =
    | { success: true; data: BackendSaleResponse }
    | { success: false; error: string; errors?: Record<string, string[]> };

/**
 * Procesa la creación de una venta real en el POS.
 */
export async function createSaleAction(
    payload: CreateSalePayload
): Promise<SaleActionResponse> {

    // 1. Verificación de Sesión (DAL con Cache)
    const session = await verifySession();

    // Obtenemos el token directamente para la cabecera Authorization
    const token = (await cookies()).get("ecommerce-token")?.value;

    if (!session.isAuth || !token) {
        return { success: false, error: "Sesión no válida o expirada." };
    }

    // 2. Validación de Contrato (Zod)
    const validatedFields = createSaleSchema.safeParse(payload);

    if (!validatedFields.success) {
        return {
            success: false,
            error: "Error de validación en los datos de la venta.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        // 3. Petición al Backend Express
        const response = await fetch(`${process.env.API_URL}/sales/v2`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(validatedFields.data),
        });

        const result: BackendSaleResponse = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: result.message || "Error al procesar la venta en el servidor."
            };
        }

        // 4. Revalidación de datos en el cliente
        // Revalida las rutas donde el stock o los ingresos hayan cambiado
        revalidatePath("/terminal");
        revalidatePath("/inventory");
        revalidatePath("/reports");

        return {
            success: true,
            data: result
        };

    } catch (error) {
        console.error("CREATE_SALE_ACTION_ERROR:", error);
        return {
            success: false,
            error: "No se pudo establecer conexión con el servicio de ventas.",
        };
    }
}