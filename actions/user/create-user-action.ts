"use server"

import { CheckoutRegisterSchema, ErrorResponseSchema } from '@/src/schemas'

type SuccessResponse = {
    message: string,
    userId: string,
}

export type ActionStateType = {
    errors: string[],
    success: SuccessResponse | null
}


export async function createUserAction(prevState: ActionStateType, formData: FormData) {

    // Creation object with only the data we need
    const registerData = {
        nombre: formData.get('nombre'),
        apellidos: formData.get('apellidos'),
        tipoDocumento: formData.get('tipoDocumento'),
        numeroDocumento: formData.get('numeroDocumento'),
        email: formData.get('email'),
        telefono: formData.get('telefono'),
    }

    // Validate the data using Zod
    const validationResult = CheckoutRegisterSchema.safeParse(registerData);
    
    if (!validationResult.success) {
        const errors = validationResult.error.errors.map(error => error.message);
        return {
            errors,
            success: null,
        }
    };

    console.log('Validated data:', validationResult.data);

    const url = `${process.env.API_URL}/auth/create-user-if-not-exists`;
    const req = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre: validationResult.data.nombre,
            apellidos: validationResult.data.apellidos,
            tipoDocumento: validationResult.data.tipoDocumento,
            numeroDocumento: validationResult.data.numeroDocumento,
            email: validationResult.data.email,
            telefono: validationResult.data.telefono,
        }),
    });

    console.log('Response status:', req);
    if (!req.ok) {
        const errorData = await req.json();
        return {
            errors: [errorData.message],
            success: null,
        }
    }

    const data = await req.json();

    console.log('data:', data);
    return {
        errors: [],
        success: {
            message: data.message,
            userId: data.userId,
        }
    }
}