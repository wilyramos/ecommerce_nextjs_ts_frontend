"use server"

import { ErrorResponseSchema, saleSchema } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}


export async function submitSaleAction(orderData: unknown, prevState: ActionStateType) {

    //TODO: - validate orderData with zod schema
    const dataParsed = saleSchema.safeParse(orderData)
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
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataParsed.data),
    })

    const json = await req.json()
    if (!req.ok) {
        // const errors = ErrorResponseSchema.safeParse(json)
        return {
            errors: [json.message || "An error occurred while submitting the sale"],
            success: "",
        }
    }

    return {
        errors: [],
        success: "Order submitted successfully",
    }
}