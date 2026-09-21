// File: frontend/actions/auth-v3.actions.ts
"use server";

import { verifySession } from "@/src/auth/dal";
import { authService } from "@/src/services/auth-v3.service";
import { UpdatePasswordDTOSchema } from "@/src/schemas/auth-v3.schema";

export type ActionState = {
    ok: boolean;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
} | null;

// ── ACTION: ACTUALIZAR CONTRASEÑA ─────────────────────────────────────────
export async function updatePasswordAction(
    _prevState: ActionState, 
    formData: FormData
): Promise<ActionState> {
    const session = await verifySession();

    try {
        const rawData = {
            currentPassword: formData.get("currentPassword") as string,
            newPassword: formData.get("newPassword") as string,
            confirmPassword: formData.get("confirmPassword") as string,
        };

        const validation = UpdatePasswordDTOSchema.safeParse(rawData);

        if (!validation.success) {
            return {
                ok: false,
                error: "Verifica los datos ingresados.",
                errors: validation.error.flatten().fieldErrors,
            };
        }

        await authService.updatePassword(
            {
                currentPassword: validation.data.currentPassword,
                newPassword: validation.data.newPassword,
            },
            session.token
        );

        return { ok: true, message: "Contraseña actualizada correctamente." };
    } catch (error: unknown) {
        return {
            ok: false,
            // Validación estricta para evitar el uso de 'any'
            error: error instanceof Error ? error.message : "Error desconocido al actualizar la contraseña.",
        };
    }
}