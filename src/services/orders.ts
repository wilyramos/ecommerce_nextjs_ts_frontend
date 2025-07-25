import "server-only"


import getToken from "@/src/auth/token"
import { OrderResponseSchemaPopulate, OrdersAPIResponse } from "@/src/schemas";

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
    console.log("Orders fetched:", orders);
    return orders;
}

export const getOrder = async (id: string) => {
    const token = await getToken();

    console.log("Fetching order with ID:", id);
    console.log("Using token:", token);
    const url = `${process.env.API_URL}/orders/${id}`;

    console.log("Fetching order from URL:", url);

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!req.ok) {
        return null;
    }

    console.log("Response status:", req);
    const json = await req.json();

    console.log("Response from order fetch:", json);
    const order = OrderResponseSchemaPopulate.parse(json);
    return order;
}

export const getOrdersByUser = async ({ page = 1, limit = 5 }) => {
    const token = await getToken();
    const url = `${process.env.API_URL}/orders/user/me?page=${page}&limit=${limit}`;

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
