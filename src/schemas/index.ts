import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string()
        .email({ message: 'Email no válido' }),
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    password: z.string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});


// For succes validation

export const SuccessSchemaRegister = z.object({
    message: z.string(),
    userId: z.string(),
    token: z.string(),
})

export const ErrorResponseSchema = z.object({
    message: z.string(),
})

