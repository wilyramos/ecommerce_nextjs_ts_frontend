// src/actions/order-actions.ts
'use server';

import { updateOrderStatus } from "@/src/services/orders";
import { revalidatePath } from "next/cache";

export async function updateStatusAction(id: string, status: string) {
    const result = await updateOrderStatus(id, status);

    if (result.success) {
        revalidatePath(`/admin/orders/${id}`);
        revalidatePath(`/admin/orders`);
    }

    return result;
}