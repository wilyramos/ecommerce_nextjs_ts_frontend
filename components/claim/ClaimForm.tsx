// File: app/%28store%29/libro-de-reclamaciones/components/ClaimForm.tsx

"use client";

import { useActionState, useEffect, useRef } from "react";
import { createClaimAction, ActionState } from "@/actions/claim-action";
import { Claim } from "@/src/schemas/claim.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState<Claim> = {
    success: false,
    errors: {},
    message: ""
};

export default function ClaimForm() {
    const [state, formAction, isPending] = useActionState(createClaimAction, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success && state.data) {
            formRef.current?.reset();
        }
    }, [state.success, state.data]);

    return (
        <div className="rounded-[var(--radius-lg)] border border-border bg-card p-6 text-card-foreground">
            {state.message && (
                <div className="mb-6">
                    <ErrorMessage
                        variant={state.success ? "success" : "error"}
                        mode="banner"
                    >
                        <div className="flex flex-col gap-1">
                            <span className="font-bold">{state.message}</span>
                            {state.success && state.data && (
                                <span className="font-mono text-xs font-black select-all opacity-95">
                                    Código de Seguimiento: {state.data.correlativo}
                                </span>
                            )}
                        </div>
                    </ErrorMessage>
                </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-8">
                {/* SECCIÓN 1: DATOS DEL CONSUMIDOR */}
                <fieldset className="space-y-4" disabled={isPending}>
                    <legend className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 w-full mb-2 select-none">
                        1. Identificación del Consumidor Reclamante
                    </legend>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="consumer.tipoDocumento">Tipo de Documento</Label>
                            <Select
                                key={state.payload?.consumer?.tipoDocumento}
                                name="consumer.tipoDocumento"
                                defaultValue={state.payload?.consumer?.tipoDocumento || "DNI"}
                            >
                                <SelectTrigger id="consumer.tipoDocumento">
                                    <SelectValue placeholder="Seleccione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DNI">DNI</SelectItem>
                                    <SelectItem value="CE">Carné Extranjería (CE)</SelectItem>
                                    <SelectItem value="RUC">RUC</SelectItem>
                                </SelectContent>
                            </Select>
                            {state.errors?.["consumer.tipoDocumento"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["consumer.tipoDocumento"][0]}
                                </ErrorMessage>
                            )}
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                            <Label htmlFor="consumer.numeroDocumento">Número de Documento</Label>
                            <Input
                                id="consumer.numeroDocumento"
                                type="text"
                                name="consumer.numeroDocumento"
                                placeholder="Ingrese el número de identidad"
                                defaultValue={state.payload?.consumer?.numeroDocumento || ""}
                            />
                            {state.errors?.["consumer.numeroDocumento"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["consumer.numeroDocumento"][0]}
                                </ErrorMessage>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="consumer.nombres">Nombres Completos / Razón Social</Label>
                        <Input
                            id="consumer.nombres"
                            type="text"
                            name="consumer.nombres"
                            placeholder="Ej: Juan Pérez"
                            defaultValue={state.payload?.consumer?.nombres || ""}
                        />
                        {state.errors?.["consumer.nombres"] && (
                            <ErrorMessage variant="error" mode="inline">
                                {state.errors["consumer.nombres"][0]}
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="consumer.celular">Teléfono / Celular</Label>
                            <Input
                                id="consumer.celular"
                                type="tel"
                                name="consumer.celular"
                                placeholder="Ej: 987654321"
                                defaultValue={state.payload?.consumer?.celular || ""}
                            />
                            {state.errors?.["consumer.celular"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["consumer.celular"][0]}
                                </ErrorMessage>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="consumer.email">E-mail</Label>
                            <Input
                                id="consumer.email"
                                type="email"
                                name="consumer.email"
                                placeholder="usuario@correo.com"
                                defaultValue={state.payload?.consumer?.email || ""}
                            />
                            {state.errors?.["consumer.email"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["consumer.email"][0]}
                                </ErrorMessage>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="consumer.direccion">Dirección Residencial</Label>
                        <Input
                            id="consumer.direccion"
                            type="text"
                            name="consumer.direccion"
                            placeholder="Calle, Avenida, Mz. Lote, Nro, Dpto"
                            defaultValue={state.payload?.consumer?.direccion || ""}
                        />
                        {state.errors?.["consumer.direccion"] && (
                            <ErrorMessage variant="error" mode="inline">
                                {state.errors["consumer.direccion"][0]}
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="consumer.ciudad">Provincia / Ciudad</Label>
                            <Input
                                id="consumer.ciudad"
                                type="text"
                                name="consumer.ciudad"
                                placeholder="Ej: Lima, Chincha"
                                defaultValue={state.payload?.consumer?.ciudad || ""}
                            />
                            {state.errors?.["consumer.ciudad"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["consumer.ciudad"][0]}
                                </ErrorMessage>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="consumer.region">Departamento / Región</Label>
                            <Input
                                id="consumer.region"
                                type="text"
                                name="consumer.region"
                                placeholder="Ej: Lima, Ica"
                                defaultValue={state.payload?.consumer?.region || ""}
                            />
                            {state.errors?.["consumer.region"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["consumer.region"][0]}
                                </ErrorMessage>
                            )}
                        </div>
                    </div>
                </fieldset>

                {/* SECCIÓN 2: DETALLE DEL RECLAMO */}
                <fieldset className="space-y-4" disabled={isPending}>
                    <legend className="text-sm font-bold uppercase tracking-wider text-foreground border-b border-border pb-2 w-full mb-2 select-none">
                        2. Detalle de la Reclamación
                    </legend>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label>Tipo de Incidencia</Label>
                            <div className="mt-2 flex items-center space-x-6 h-10">
                                <label className="inline-flex items-center text-xs font-bold text-foreground cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="detail.tipoReclamo"
                                        value="Reclamo"
                                        defaultChecked={!state.payload?.detail?.tipoReclamo || state.payload?.detail?.tipoReclamo === "Reclamo"}
                                        className="h-4 w-4 text-primary border-border focus:ring-ring accent-foreground"
                                    />
                                    <span className="ml-2">Reclamo (Falla del producto)</span>
                                </label>
                                <label className="inline-flex items-center text-xs font-bold text-foreground cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="detail.tipoReclamo"
                                        value="Queja"
                                        defaultChecked={state.payload?.detail?.tipoReclamo === "Queja"}
                                        className="h-4 w-4 text-primary border-border focus:ring-ring accent-foreground"
                                    />
                                    <span className="ml-2">Queja (Malestar comercial)</span>
                                </label>
                            </div>
                            {state.errors?.["detail.tipoReclamo"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["detail.tipoReclamo"][0]}
                                </ErrorMessage>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="detail.fechaIncidencia">Fecha de Incidencia</Label>
                            <Input
                                id="detail.fechaIncidencia"
                                type="date"
                                name="detail.fechaIncidencia"
                                max={new Date().toISOString().split("T")[0]}
                                defaultValue={state.payload?.detail?.fechaIncidencia || ""}
                            />
                            {state.errors?.["detail.fechaIncidencia"] && (
                                <ErrorMessage variant="error" mode="inline">
                                    {state.errors["detail.fechaIncidencia"][0]}
                                </ErrorMessage>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="detail.detalle">Detalle Completo de lo Sucedido</Label>
                        <Textarea
                            id="detail.detalle"
                            name="detail.detalle"
                            rows={4}
                            placeholder="Describa detalladamente los hechos suscitados de forma clara..."
                            className="resize-none"
                            defaultValue={state.payload?.detail?.detalle || ""}
                        />
                        {state.errors?.["detail.detalle"] && (
                            <ErrorMessage variant="error" mode="inline">
                                {state.errors["detail.detalle"][0]}
                            </ErrorMessage>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="detail.pedido">Pedido / Petición Concreta</Label>
                        <Textarea
                            id="detail.pedido"
                            name="detail.pedido"
                            rows={3}
                            placeholder="Indique de forma directa su pretensión o solicitud formal..."
                            className="resize-none"
                            defaultValue={state.payload?.detail?.pedido || ""}
                        />
                        {state.errors?.["detail.pedido"] && (
                            <ErrorMessage variant="error" mode="inline">
                                {state.errors["detail.pedido"][0]}
                            </ErrorMessage>
                        )}
                    </div>
                </fieldset>

                <div className="pt-2 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-8 h-11 rounded-[var(--radius-sm)]"
                    >
                        {isPending ? "Registrando Reclamación..." : "Enviar Reclamación Oficial"}
                    </Button>
                </div>
            </form>
        </div>
    );
}