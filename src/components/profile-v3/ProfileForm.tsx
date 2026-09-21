// File: frontend/components/profile-v3/ProfileForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfileUserAction, type ActionState } from "@/actions/user-v3.actions";
import { type UserResponse } from "@/src/schemas/user-v3.schema";
import { H3, P, Hr } from "@/components/ui/TypographyV3";
import { InputV3 } from "@/components/ui/InputV3";
import { ButtonV3 } from "@/components/ui/ButtonV3";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
    initialUser: UserResponse;
}

export function ProfileForm({ initialUser }: ProfileFormProps) {
    const [state, formAction, isPending] = useActionState<ActionState<UserResponse>, FormData>(
        updateProfileUserAction,
        null
    );

    useEffect(() => {
        if (state?.ok && state.message) {
            toast.success(state.message);
        } else if (state?.error) {
            toast.error(state.error);
        }
    }, [state]);

    const currentUser = state?.data ?? initialUser;
    const currentAddress = currentUser.direccion ?? {};

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <H3>Datos Personales</H3>
                <P className="mt-1">
                    Información principal utilizada para tu cuenta y comprobantes de pago.
                </P>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputV3
                    id="nombre"
                    name="nombre"
                    type="text"
                    label="Nombres"
                    required
                    defaultValue={currentUser.nombre}
                    error={state?.errors?.nombre?.[0]}
                    disabled={isPending}
                />

                <InputV3
                    id="apellidos"
                    name="apellidos"
                    type="text"
                    label="Apellidos"
                    defaultValue={currentUser.apellidos ?? ""}
                    error={state?.errors?.apellidos?.[0]}
                    disabled={isPending}
                />

                <InputV3
                    id="email"
                    name="email"
                    type="email"
                    label="Correo Electrónico (No editable)"
                    disabled
                    defaultValue={currentUser.email}
                />

                <InputV3
                    id="telefono"
                    name="telefono"
                    type="tel"
                    label="Teléfono / Celular"
                    defaultValue={currentUser.telefono ?? ""}
                    error={state?.errors?.telefono?.[0]}
                    disabled={isPending}
                />

                <div className="relative flex w-full flex-col">
                    <div className="relative w-full">
                        <select
                            id="tipoDocumento"
                            name="tipoDocumento"
                            defaultValue={currentUser.tipoDocumento ?? "DNI"}
                            disabled={isPending}
                            data-slot="input"
                            className={cn(
                                "peer h-12 w-full min-w-0 rounded-radius-md border border-border-primary bg-surface-primary px-3.5 pt-4.5 pb-1.5 text-sm font-normal text-text-primary transition-all duration-fast outline-none",
                                "hover:border-border-strong focus-visible:border-brand-accent focus-visible:ring-1 focus-visible:ring-brand-accent",
                                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-border-secondary disabled:bg-surface-secondary disabled:text-text-disabled"
                            )}
                        >
                            <option value="DNI">DNI</option>
                            <option value="RUC">RUC</option>
                            <option value="CE">Carnet de Extranjería (CE)</option>
                        </select>

                        <label
                            htmlFor="tipoDocumento"
                            className="pointer-events-none absolute left-3.5 top-1.5 select-none text-[11px] font-normal tracking-normal text-text-tertiary transition-all duration-fast"
                        >
                            Tipo de Documento
                        </label>
                    </div>
                    {state?.errors?.tipoDocumento?.[0] && (
                        <span className="mt-1.5 text-xs font-normal text-status-error">
                            {state.errors.tipoDocumento[0]}
                        </span>
                    )}
                </div>

                <InputV3
                    id="numeroDocumento"
                    name="numeroDocumento"
                    type="text"
                    label="Número de Documento"
                    defaultValue={currentUser.numeroDocumento ?? ""}
                    error={state?.errors?.numeroDocumento?.[0]}
                    disabled={isPending}
                />
            </div>

            <Hr className="my-6" />

            <div>
                <H3>Dirección de Envío Principal</H3>
                <P className="mt-1">
                    Ubicación predeterminada para el cálculo de despacho y entrega de tus pedidos.
                </P>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <InputV3
                    id="departamento"
                    name="departamento"
                    type="text"
                    label="Departamento"
                    defaultValue={currentAddress.departamento ?? ""}
                    error={state?.errors?.["direccion.departamento"]?.[0]}
                    disabled={isPending}
                />

                <InputV3
                    id="provincia"
                    name="provincia"
                    type="text"
                    label="Provincia"
                    defaultValue={currentAddress.provincia ?? ""}
                    error={state?.errors?.["direccion.provincia"]?.[0]}
                    disabled={isPending}
                />

                <InputV3
                    id="distrito"
                    name="distrito"
                    type="text"
                    label="Distrito"
                    defaultValue={currentAddress.distrito ?? ""}
                    error={state?.errors?.["direccion.distrito"]?.[0]}
                    disabled={isPending}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <InputV3
                        id="direccion"
                        name="direccion"
                        type="text"
                        label="Avenida / Calle / Jirón"
                        defaultValue={currentAddress.direccion ?? ""}
                        error={state?.errors?.["direccion.direccion"]?.[0]}
                        disabled={isPending}
                    />
                </div>

                <InputV3
                    id="numero"
                    name="numero"
                    type="text"
                    label="Número / Mz. y Lote"
                    defaultValue={currentAddress.numero ?? ""}
                    error={state?.errors?.["direccion.numero"]?.[0]}
                    disabled={isPending}
                />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputV3
                    id="pisoDpto"
                    name="pisoDpto"
                    type="text"
                    label="Dpto / Interior / Piso (Opcional)"
                    defaultValue={currentAddress.pisoDpto ?? ""}
                    error={state?.errors?.["direccion.pisoDpto"]?.[0]}
                    disabled={isPending}
                />

                <InputV3
                    id="referencia"
                    name="referencia"
                    type="text"
                    label="Referencia de llegada"
                    defaultValue={currentAddress.referencia ?? ""}
                    error={state?.errors?.["direccion.referencia"]?.[0]}
                    disabled={isPending}
                />
            </div>

            <div className="flex justify-end pt-4">
                <ButtonV3
                    type="submit"
                    variant="default"
                    size="default"
                    disabled={isPending}
                >
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                </ButtonV3>
            </div>
        </form>
    );
}