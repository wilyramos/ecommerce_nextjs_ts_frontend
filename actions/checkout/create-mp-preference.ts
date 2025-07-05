'use server'

import type { CreatePreferenceInput } from "@/src/schemas/index"
import getToken from "@/src/auth/token";


export async function createMPPreference(orderData: CreatePreferenceInput) {


    const token = await getToken();


    // console.log('Creando preferencia de Mercado Pago con los siguientes datos:', orderData);
    const url = process.env.API_URL;



    const res = await fetch(`${url}/checkout/create-preference`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify(orderData),
    });

    if (!res.ok) throw new Error('No se pudo crear la preferencia');

    const data = await res.json();
    return data.init_point;
}