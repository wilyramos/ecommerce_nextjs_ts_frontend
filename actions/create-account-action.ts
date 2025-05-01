"use server"

import { RegisterSchema, SuccessSchema } from '@/src/schemas'
import { SuiteContext } from 'node:test';

type ActionStateType = {
    errors: string[],
}

export async function createAccountAction(prevState: ActionStateType, formData: FormData) {

    // Creation object with only the data we need
    const registerData = {
        email: formData.get('email'),
        name: formData.get('name'),
        password: formData.get('password'),
        password_confirmation: formData.get('password_confirmation')
    }

    // Validate the data using Zod
    const validationResult = RegisterSchema.safeParse(registerData);
    if (!validationResult.success) {
        const errors = validationResult.error.errors.map((error) => error.message);
        return {
            errors,
            success: ""
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
            name: registerData.name,
            email: registerData.email,
            password: registerData.password,
        }),
    })

    console.log(req)

    if (!req.ok) {
        const errorResponse = await req.json()
        console.log(errorResponse)
        return {
            errors: [errorResponse.message],
            success: ""
        }
    }
    

    return {
        errors: [],
        // success
    }
}