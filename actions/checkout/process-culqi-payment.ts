"use server";

import getToken from "@/src/auth/token";

export interface CulqiPaymentPayload {
    token?: string;
    order?: any;
    amount: number;
    description: string;
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    const token = await getToken();
    const url = process.env.API_URL;

    if (!url) throw new Error("API_URL no configurada en las variables de entorno.");

    const datasend = {
        ...paymentData,
        email: "wilyramos21@gmail.com" // Email estático para pruebas de cargo
    };

    const res = await fetch(`${url}/checkout/process-payment-culqi`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datasend),
        cache: "no-store",
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error procesando el pago en el servidor backend.");
    }

    return await res.json();
}