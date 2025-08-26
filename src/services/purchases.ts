import "server-only";


import getToken from "../auth/token";
import { purchasesResponseSchema, purchaseSchema } from "@/src/schemas";



export const getPurchase = async (id: string) => {
    try {
        const token = await getToken();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/purchases/${id}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        const result = purchaseSchema.safeParse(data);

        if (!result.success) {
            throw new Error("Invalid response");
        }

        return result.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch purchase");
    }
}

type getPurchasesProps = {
    page?: number;
    limit?: number;
    query?: string;
    sort?: string;
}
export const getPurchases = async (props: getPurchasesProps) => {
    try {
        console.log("Fetching purchases with params:", props);
        const token = await getToken();
        const url = `${process.env.API_URL}/purchases`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        console.log("Purchases data:", data);
        const result = purchasesResponseSchema.safeParse(data);
        console.log("Parsed purchases data:", result);

        if (!result.success) {
            throw new Error("Invalid response");
        }

        return result.data;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch purchases");
    }
}