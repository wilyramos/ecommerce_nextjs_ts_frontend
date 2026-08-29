// File: frontend/actions/checkout/process-culqi-payment.ts

"use server";

import { getTokenOptional } from "@/src/auth/dal"; 

export interface CulqiPaymentPayload {
    token?: string;   
    order?: string;   
    amount: number;   
    email: string;
    orderNumber: string;
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    console.log(" [SA] processPaymentCulqi iniciado:", {
        hasToken: !!paymentData.token,
        hasOrder: !!paymentData.order,
        amount: paymentData.amount,
        email: paymentData.email,
        orderNumber: paymentData.orderNumber, 
    });

    const authToken = await getTokenOptional();
 
    const url = process.env.API_URL;
    if (!url) {
        console.error("[SA] API_URL no definida en variables de entorno");
        throw new Error("API_URL no configurada.");
    }

    const endpoint = `${url}/checkout/v3/process-payment-culqi`;
    console.log("🌐 [SA] Enviando a:", endpoint);

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
    }

    const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(paymentData),
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        console.error(" [SA] Error del backend:", { status: res.status, data });
        throw new Error(data.message || "Error procesando el pago.");
    }

    console.log("[SA] Respuesta exitosa del backend:", data);
    return data;
}