import "server-only"


import getToken from "@/src/auth/token"
import { OrdersListResponseSchema, OrdersSummarySchema } from "@/src/schemas";

// === new 
import { OrderPopulatedSchema } from "@/src/schemas";


type GetOrdersParams = {
    page?: number;
    limit?: number;
    pedido?: string;
    fecha?: string;
    estadoPago?: string;
    estadoEnvio?: string;
}

export const getOrders = async ({ page = 1, limit = 25, ...filters }: GetOrdersParams) => {

    const token = await getToken();

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            params.append(key, value);
        }
    }

    params.set('page', page.toString());
    params.set('limit', limit.toString());

    const url = `${process.env.API_URL}/orders?${params.toString()}`;

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
    const orders = OrdersListResponseSchema.parse(json);
    return orders;
}

export const getOrder = async (id: string) => {
    const token = await getToken();

    const url = `${process.env.API_URL}/orders/${id}`;

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

    const order = OrderPopulatedSchema.parse(json);
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
    const orders = OrdersListResponseSchema.parse(json);
    return orders;
}



interface GetOrdersReportsParams {
    fechaInicio?: string;
    fechaFin?: string;
}

export const getSummaryOrders = async (params: GetOrdersReportsParams) => {
    try {
        const token = await getToken();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);


        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/orders/reports/sales-summary?${queryParams.toString()}`;

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
        console.log("Sales summary:", json);
        const summary = OrdersSummarySchema.parse(json);
        console.log("Parsed summary:", summary);
        return summary;
    } catch (error) {
        console.error("Error fetching sales summary:", error);
        return null;
    }
}
