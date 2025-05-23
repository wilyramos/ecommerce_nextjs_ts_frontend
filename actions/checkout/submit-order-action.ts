"use server"

import { ErrorResponseSchema } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}



export async function submitOrderAction(orderData: unknown, prevState: ActionStateType) {



    const order = orderData

    console.log(order)
    const url = `${process.env.API_URL}/orders`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
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