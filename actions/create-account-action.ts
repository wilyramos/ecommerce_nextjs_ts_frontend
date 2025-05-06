"use server"

import { RegisterSchema, SuccessSchemaRegister, ErrorResponseSchema } from '@/src/schemas'

type ActionStateType = {
    errors: string[],
}

type SuccessResponse = {
    message: string,
    userId: string,
    token: string
}

export async function createAccountAction(prevState: ActionStateType, formData: FormData) {

    // Creation object with only the data we need
    const registerData = {
        email: formData.get('email'),
        nombre: formData.get('nombre'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    // Validate the data using Zod
    const validationResult = RegisterSchema.safeParse(registerData);
    if (!validationResult.success) {
        const errors = validationResult.error.errors.map(error => error.message);
        return {
            errors,
            success: {} as SuccessResponse
        }
    }


    // If validation is successful, you can proceed with the registration logic

    const url = `${process.env.API_URL}/auth/register`;
    
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: validationResult.data.nombre,
            email: validationResult.data.email,
            password: validationResult.data.password,
        }),
    })
    // console.log(req)

    if (!req.ok) {
        const errorResponse = await req.json()
        return {
            errors: [errorResponse.message],
            success: {} as SuccessResponse
        }
    }

    const json = await req.json()

    const success = SuccessSchemaRegister.parse(json)
    // console.log("Success", success)

    return {
        errors: prevState.errors,
        success
    }
}