"use server"

import { redirect } from "next/navigation"
import { LoginSchema, ErrorResponseSchema, SuccessSchemaLogin } from "@/src/schemas"
import { cookies } from "next/headers"


type ActionStateType = {
    errors: string[],
    success: string
}

export async function authenticateUserAction(prevState: ActionStateType, formData: FormData) {

    const loginCredentials = {
        email: formData.get('email'),
        password: formData.get('password')
    }


    const auth = LoginSchema.safeParse(loginCredentials);
    if (!auth.success) {
        const errors = auth.error.errors.map(error => error.message);
        return {
            errors,
            success: ""
        }
    }


    const url = `${process.env.API_URL}/auth/login`;
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: auth.data.email,
            password: auth.data.password,
        }),
    })

    const Response = await req.json()
    if (!req.ok) {
        const errorResponse = ErrorResponseSchema.parse(Response)
        return {
            errors: [errorResponse.message],
            success: ""
        }
    }
    console.log(Response);
    // Setear la cookie
    const successResponse = SuccessSchemaLogin.parse(Response)
    const { token } = successResponse;
    const { role } = Response;
    console.log(successResponse);
    (await cookies()).set({
        name: 'ecommerce-token',
        value: token,    
        path: '/',
        httpOnly: true,
    })


    if (role === 'administrador') {
        redirect('/admin')
    }

    redirect('/')


}