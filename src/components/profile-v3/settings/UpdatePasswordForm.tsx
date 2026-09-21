// File: frontend/src/components/profile-v3/settings/UpdatePasswordForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { updatePasswordAction } from "@/actions/auth-v3.actions";
import { InputV3 } from "@/components/ui/InputV3";

export function UpdatePasswordForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(updatePasswordAction, null);

    // Resetea el formulario cuando la actualización es exitosa
    useEffect(() => {
        if (state?.ok) {
            formRef.current?.reset();
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="max-w-md space-y-4 w-full">
            {/* Mensaje de Éxito */}
            {state?.ok && (
                <div className="rounded-radius-sm bg-emerald-50 border border-emerald-200 p-3 text-sm font-medium text-emerald-700">
                    {state.message}
                </div>
            )}

            {/* Mensaje de Error General */}
            {state?.error && !state.ok && (
                <div className="rounded-radius-sm bg-red-50 border border-red-200 p-3 text-sm font-medium text-red-700">
                    {state.error}
                </div>
            )}

            {/* Campos de Contraseña usando InputV3 */}
            <div className="space-y-4">
                <InputV3
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    label="Contraseña actual"
                    disabled={isPending}
                    error={state?.errors?.currentPassword?.[0]}
                />

                <InputV3
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    label="Nueva contraseña"
                    disabled={isPending}
                    error={state?.errors?.newPassword?.[0]}
                />

                <InputV3
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirmar nueva contraseña"
                    disabled={isPending}
                    error={state?.errors?.confirmPassword?.[0]}
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="mt-6 flex w-full sm:w-auto items-center justify-center rounded-radius-md bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Actualizando..." : "Actualizar Contraseña"}
            </button>
        </form>
    );
}