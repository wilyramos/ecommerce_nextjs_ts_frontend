// File: frontend/src/schemas/auth-v3.schema.ts
import { z } from "zod";

export const LoginDTOSchema = z.object({
    email: z.string().email("Ingresa un correo electrónico válido").trim(),
    password: z.string().min(1, "La contraseña es requerida"),
});
export type LoginDTO = z.infer<typeof LoginDTOSchema>;

export const UpdatePasswordDTOSchema = z.object({
    currentPassword: z.string().min(1, "La contraseña actual es requerida"),
    newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu nueva contraseña"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});
export type UpdatePasswordDTO = z.infer<typeof UpdatePasswordDTOSchema>;

// Respuesta de login desde el backend
export type LoginResponse = {
    user: any; // Aquí puedes tipar IUser si lo tienes
    token: string;
};