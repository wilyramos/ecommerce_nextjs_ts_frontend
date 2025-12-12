"use server"

import { ErrorResponseSchema, CreateSaleSchema } from "@/src/schemas"
import { revalidatePath } from "next/cache"
import getToken from "@/src/auth/token"
import { verifySession } from '@/src/auth/dal';
import type { CreateSaleInput } from "@/src/schemas"


// Define the type for the action state
type ActionStateType = {
    errors: string[],
    success: string
}


export async function submitSaleAction(orderData: CreateSaleInput, prevState: ActionStateType) {

    //TODO: - validate orderData with zod schema

    console.log("data recibida", orderData)
    const token = await getToken();
    const { user } = await verifySession();

    const saleData = {
        ...orderData,
        employee: user._id,
    }

    const dataParsed = CreateSaleSchema.safeParse(saleData)

    if (!dataParsed.success) {
        return {
            errors: dataParsed.error.errors.map((error) => error.message),
            success: ''
        }
    }

    console.log(dataParsed.data)
    const url = `${process.env.API_URL}/sales`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(dataParsed.data),
    })

    const json = await req.json()
    // console.log("jsonnnnn", json)
    if (!req.ok) {
        const errors = ErrorResponseSchema.parse(json)
        return {
            errors: [errors.message],
            success: json.saleId ? json.saleId : ''
        }
    }

    // Revalidate the sale data

    revalidatePath("/pos")

    console.log("Venta creada con ID:", json.saleId);
    return {
        errors: [],
        success: json.saleId
    }
}