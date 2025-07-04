"use server";

import type { CreateOrderInput } from "@/src/schemas";
import type { Order } from "@/src/schemas";
import getToken from "@/src/auth/token";

type CreateOrderResponse = {
    message: string;
    order: Order;
};

export async function createOrderAction(order: CreateOrderInput): Promise<CreateOrderResponse> {
    const token = await getToken();
    const url = `${process.env.API_URL}/orders`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(order),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message || "Error al crear la orden");
    }

    return {
        message: json.message,
        order: json.order as Order,
    };
}
