"use server"

import { ErrorResponseSchema, OrderSchema } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}



export async function submitOrderAction(orderData: unknown, prevState: ActionStateType) {

    //TODO: - validate orderData with zod schema
    const dataParsed = OrderSchema.safeParse(orderData)
    if (!dataParsed.success) {
        return {
            errors: dataParsed.error.errors.map((error) => error.message),
            success: ''
        }
    }

    console.log(dataParsed.data)
    const url = `${process.env.API_URL}/orders`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataParsed.data),
    })

    const json = await req.json()
    if (!req.ok) {
        const errors = ErrorResponseSchema.parse(json)
        return {
            errors: [errors.message],
            success: "",
        }
    }

    return {
        errors: [],
        success: "Order submitted successfully",
    }
}