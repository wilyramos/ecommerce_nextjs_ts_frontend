import "server-only";


import getToken from "../auth/token";
import { purchasesResponseSchema, purchaseSchemaPopulated } from "@/src/schemas";



export const getPurchase = async (id: string) => {
    try {
        const token = await getToken();
        const url = `${process.env.API_URL}/purchases/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log("daa", data)
        const result = purchaseSchemaPopulated.safeParse(data);

        if (!result.success) {
            return null;
        }

        return result.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

type getPurchasesParams = {
    page?: number;
    limit?: number;
    numeroCompra?: string;
    proveedor?: string;
    fecha?: string;
    // total?: string;
}

export const getPurchases = async ({ page = 1, limit = 10, ...filters }: getPurchasesParams) => {
    try {

        const token = await getToken();
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                params.append(key, value);
            }
        }

        params.set('page', page.toString());
        params.set('limit', limit.toString());
        const url = `${process.env.API_URL}/purchases?${params.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });


        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        const result = purchasesResponseSchema.safeParse(data);
        if (!result.success) {
            console.error("Schema validation error:", result.error.format());
            return null;
        }
        return result.data;
    } catch (error) {
        console.error(error);
        return  null;
    }
}