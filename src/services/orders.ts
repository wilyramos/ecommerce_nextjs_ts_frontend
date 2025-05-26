import getToken from "@/src/auth/token"
import { OrdersAPIResponse } from "@/src/schemas";


export const getOrders = async ({ page = 1, limit = 10 }) => {

    const token = await getToken();
    const url = `${process.env.API_URL}/orders?page=${page}&limit=${limit}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const orders = OrdersAPIResponse.parse(json);
    return orders;
}
