//File: frontend/actions/checkout/create-mp-preference.ts

//File: frontend/actions/checkout/create-mp-preference.ts

'use server'

import getToken from "@/src/auth/token";


export async function createMPPreferenceWithOrderId( orderId: string) {
    const token = await getToken();
    const url = process.env.API_URL;

    const res = await fetch(`${url}/checkout/create-preference-orderid`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({ orderId }),
    });

    if (!res.ok) throw new Error('No se pudo crear la preferencia');

    const data = await res.json();
    return data.init_point;
}