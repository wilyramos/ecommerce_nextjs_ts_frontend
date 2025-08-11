"use server";

import getToken from "@/src/auth/token";

export interface CulqiPaymentPayload {
    token?: string; // Para pagos con tarjeta
    order?: any;    // Para pagos con Yape / billetera
    amount: number; // En céntimos
    description: string;
}

export async function processPaymentCulqi(paymentData: CulqiPaymentPayload) {
    const token = await getToken();
    const url = process.env.API_URL;


    const datasend = {
        ...paymentData,
        amount: paymentData.amount,
        description: paymentData.description,
        email: "wilyramos21@gmail.com"
    };

    console.log("Request to processPaymentCulqi:", datasend);
    5
    const res = await fetch(`${url}/checkout/process-payment-culqi`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datasend),
        cache: "no-store",
    });

    console.log("Response from processPaymentCulqi:", res);


    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error processing Culqi payment");
    }

    const data = await res.json();
    return data;
}
