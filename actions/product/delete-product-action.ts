"use server"

import getToken from "@/src/auth/token";
import { ErrorResponse } from "@/src/schemas";
import { revalidatePath } from "next/cache";
import { SuccessResponse } from "@/src/schemas";

type ActionStateType = {
    errors: string[],
    success: string
};

export async function DeleteProduct(productId: string, prevState: ActionStateType) {

    const token = await getToken();
    const url = `${process.env.API_URL}/products/${productId}`;
    const req = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const json = await req.json();
    if (!req.ok) {
        const error = ErrorResponse.parse(json);
        return {
            errors: [error.message],
            success: ""
        }
    }

    const success = SuccessResponse.parse(json);
    // revalidatePath('/admin/products');
    return {
        errors: [],
        success: success.message
    }
}