//File: frontend/actions/checkout/process-mp-payment.ts

"use server"

import getToken from "@/src/auth/token";
import { PaymentPayload } from "@/components/checkout/mercadopago/CheckoutMercadoPagoBricks";

export async function processPaymentMP(paymentData: PaymentPayload) {
    const token = await getToken();
    const url = process.env.API_URL;

    console.log("Request to processPaymentMP:", paymentData);

    const res = await fetch(`${url}/checkout/process-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData), // aquí ya va como en la doc
        cache: "no-store",
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error processing payment");
    }

    const responseData = await res.json();

    return responseData;
}
