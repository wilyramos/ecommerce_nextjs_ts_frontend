"use server"

import getToken from "@/src/auth/token";
import { ErrorResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache";
import { SuccessResponse } from "@/src/schemas";

type ActionStateType = {
    errors: string[],
    success: string
};

export async function UpdateStatusProduct(productId: string, prevState: ActionStateType) {



    console.log("Updating status for product:", productId, "with previous state:", prevState);

    const token = await getToken();
    const url = `${process.env.API_URL}/products/${productId}/status`;
    const req = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            isActive: !prevState.success // Toggle status based on previous state
        })
    });

    console.log("Request to update status:", req);

    const json = await req.json();

    console.log("Response from update status:", json);
    if (!req.ok) {
        const error = ErrorResponse.parse(json);
        return {
            errors: [error.message],
            success: ""
        }
    }

    const success = SuccessResponse.parse(json);
    // Revalidate

    revalidatePath(`/admin/products/${productId}`)

    return {
        errors: [],
        success: success.message
    }
}