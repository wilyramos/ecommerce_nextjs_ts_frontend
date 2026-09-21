// File: frontend/actions/checkout/process-culqi-payment.ts

"use server";

import { getTokenOptional } from "@/src/auth/dal"; 

export interface CulqiPaymentPayload {
    token?: string;   
    order?: string;   
    amount: number;   
    email: string;
    orderNumber: string;
    authentication_3DS?: any;
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    const authToken = await getTokenOptional();
 
    const url = process.env.API_URL;
    if (!url) {
        throw new Error("API_URL no configurada.");
    }

    const endpoint = `${url}/checkout/v3/process-payment-culqi`;

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
        throw new Error(data.message || "Error procesando el pago.");
    }

    return data;
}