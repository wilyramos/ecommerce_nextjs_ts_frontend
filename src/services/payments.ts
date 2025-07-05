import "server-only"
import type { CreatePreferenceInput } from "@/src/schemas/index"
import getToken from "@/src/auth/token"
 

//TODO: ESTA POR IMPLEMENTAR

export const createMPPreference = async (orderData: CreatePreferenceInput) => {


    const token = await getToken();
    console.log("Tokennn:", token);
    const url = `${process.env.API_URL}/checkout/create-preference`;

    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData),
    });

    console.log("Response status:", req.status);

    const json = await req.json();
    console.log("Response JSON:", json);
    if (!req.ok) {
        throw new Error('No se pudo crear la preferencia');
    }
    console.log("Response JSON:", json);

    return json.init_point;

}

