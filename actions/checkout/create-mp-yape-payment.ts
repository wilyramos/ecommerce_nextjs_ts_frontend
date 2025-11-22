// File: frontend/actions/checkout/create-mp-yape-payment.ts
'use server';

import getToken from "@/src/auth/token";

export async function createMPYapePayment(data: {
    orderId: string;
    token: string;
    amount: number;
    payerEmail: string;
}) {
    const sessionToken = await getToken();
    const url = process.env.API_URL;

    const res = await fetch(`${url}/checkout/mercadopago/yape`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
            token: data.token,
            transaction_amount: data.amount,
            payer: { email: data.payerEmail },
            description: `Pago de orden ${data.orderId}`,
            orderId: data.orderId
        })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Error procesando pago Yape");
    }

    return res.json();
}
