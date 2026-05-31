// File: frontend/actions/checkout/process-culqi-payment.ts

"use server";

import getToken from "@/src/auth/token";

export interface CulqiPaymentPayload {
    token?: string;   // pago con tarjeta
    order?: string;   // pago con billetera / PagoEfectivo
    amount: number;   // en céntimos: S/10.00 → 1000
    email: string;
    orderId: string;  // ID de la orden en tu sistema para metadata
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    console.log("📤 [SA] processPaymentCulqi iniciado:", {
        hasToken: !!paymentData.token,
        hasOrder: !!paymentData.order,
        amount: paymentData.amount,
        email: paymentData.email,
        orderId: paymentData.orderId,
    });



    const authToken = await getToken();

    if (!authToken) {
        console.error("❌ [SA] No hay token de autenticación en cookies");
        throw new Error("No autenticado. Por favor inicia sesión.");
    }

    const url = process.env.API_URL;

    if (!url) {
        console.error("❌ [SA] API_URL no definida en variables de entorno");
        throw new Error("API_URL no configurada.");
    }

    const endpoint = `${url}/checkout/process-payment-culqi`;
    console.log("🌐 [SA] Enviando a:", endpoint);
    console.log("📦 [SA] Payload:", paymentData);

    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(paymentData),
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        console.error("❌ [SA] Error del backend:", { status: res.status, data });
        throw new Error(data.message || "Error procesando el pago.");
    }

    console.log("✅ [SA] Respuesta exitosa del backend:", data);
    return data;
}