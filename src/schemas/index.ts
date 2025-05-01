import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string()
        .email({ message: 'Email no válido' }),
    name: z.string()
        .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    password: z.string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});


// For succes validation

export const SuccessSchema = z.string().min(1, { message: 'Valor inválido' });
