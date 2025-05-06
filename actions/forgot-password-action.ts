"use server"


import { ForgotPasswordSchema, ErrorResponseSchema, SuccessSchemaForgotPassword } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}

 

export async function forgotPassword(prevState: ActionStateType, formData: FormData) {
   
    const forgotPassword = ForgotPasswordSchema.safeParse({
        email: formData.get('email')
    })

    if(!forgotPassword.success) {

        return {

            errors: forgotPassword.error.errors.map(error => error.message),
            success: ""
        }
    }

    const url = `${process.env.API_URL}/auth/forgot-password`;
    const req = await fetch(url, {
        method: "POST",
        body: JSON.stringify(forgotPassword.data),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    console.log(req)
    const Response = await req.json()

    if(!req.ok) {
        const errorResponse = ErrorResponseSchema.parse(Response)
        return {
            errors: [errorResponse.message],
            success: ""
        }
    }

    const successResponse = SuccessSchemaForgotPassword.parse(Response)
    return {
        errors: [],
        success: successResponse.message
    }
}