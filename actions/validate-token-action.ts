"use server"

import { ErrorResponseSchema, TokenSchema, SuccessSchemaTokenValidation } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}

export async function validateToken(token: string, prevState: ActionStateType) {

    const resetPassword = TokenSchema.safeParse(token)
    if (!resetPassword.success) {
        return {
            errors: resetPassword.error.errors.map(error => error.message),
            success: ""
        }
    }

    const url = `${process.env.API_URL}/auth/validate-token/${token}`
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    const json = await res.json()
    if (!res.ok) {
        const errorResponse = ErrorResponseSchema.parse(json)
        return {
            errors: [errorResponse.message],
            success: ""
        }
    }

    const successResponse = SuccessSchemaTokenValidation.parse(json)

    return {
        errors: [],
        success: successResponse.message
    }
}