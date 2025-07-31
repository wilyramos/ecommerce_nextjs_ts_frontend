'use server';

import getToken from "@/src/auth/token";
import { IzipayTokenSchema } from "@/src/schemas";


type CreateIzipayInput = {
    orderId: string;
    amount: number;
    currency: string;
    customerEmail: string;
};

export async function createCheckoutIzipay({
    orderId,
    amount,
    currency,
    customerEmail,
}: CreateIzipayInput): Promise<string> {
    const token = await getToken();
    const url = process.env.API_URL;

    const res = await fetch(`${url}/checkout/izipay/get-token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, amount, currency, customerEmail }),
    });

    if (!res.ok) {
        throw new Error('No se pudo crear la preferencia de Izipay');
    }

    const data = await res.json();

    if (!data.token) {
        console.error('Respuesta inesperada de Izipay backend:', data);
        throw new Error('Token de pago no recibido desde el servidor');
    }

    console.log('Izipay token received:', data);
    // tipar el token como string
    if (typeof data.token !== 'string') {
        throw new Error('Token de pago debe ser un string');
    }
    const parsedData = IzipayTokenSchema.safeParse(data);
    if (!parsedData.success) {
        console.error('Izipay token schema validation failed:', parsedData.error);
        throw new Error('Token de pago no válido');
    }
    console.log('Izipay token schema validation passed:', parsedData.data);
    // retornar el token 
    return parsedData.data.token;
}
