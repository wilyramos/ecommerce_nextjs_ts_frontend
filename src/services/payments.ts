import "server-only"
import type { OrderCreateInput } from "../schemas";


export const createMPPreference = async (orderData: OrderCreateInput) => {

    const url = `${process.env.API_URL}/checkout/create-preference`;

    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    const json = await req.json();
    if (!req.ok) {
        throw new Error('No se pudo crear la preferencia');
    }

    return json.init_point;

}

