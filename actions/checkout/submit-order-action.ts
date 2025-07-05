"use server"

import { ErrorResponseSchema, OrderCreateSchema } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}



export async function submitOrderAction(orderData: unknown, prevState: ActionStateType) {

    //TODO: - validate orderData with zod schema
    const dataParsed = OrderCreateSchema.safeParse(orderData)
    if (!dataParsed.success) {
        const errors = dataParsed.error.errors.map(error => error.message)
        return {
            errors,
            success: ""
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