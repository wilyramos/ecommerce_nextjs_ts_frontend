"use server"

import { resetPasswordSchema , ErrorResponse, SuccessResponse } from "@/src/schemas"


type ActionStateType = {
    errors: string[],
    success: string
}

export async function resetPassword(token: string, prevState: ActionStateType, formData: FormData) {
    
    
    const resetPasswordInput = {
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    const resetPassword = resetPasswordSchema.safeParse(resetPasswordInput)
    if (!resetPassword.success) {
        const errors = resetPassword.error.errors.map(error => error.message)
        return {
            errors,
            success: ""
        }
    }

    const url = `${process.env.API_URL}/auth/update-password/${token}`
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: resetPassword.data.password
        }),
    })

    const Response = await req.json()
    if (!req.ok) {
        const errorResponse = ErrorResponse.parse(Response)
        return {
            errors: [errorResponse.message],
            success: ""
        }
    }

    const success = SuccessResponse.parse(Response)
    // console.log(success);
    


    return {
        errors: [],
        success: success.message
    }


}