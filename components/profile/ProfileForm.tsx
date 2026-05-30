// File: frontend/components/store/ProfileForm.tsx

"use client";

import type { User } from "@/src/schemas";
import { useActionState, useEffect } from "react";
import { EditUserAction } from "@/actions/user/edit-user-action";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { H2 } from "../ui/Typography";

export default function ProfileForm({ user }: { user: User }) {
    const EditUserWithId = EditUserAction.bind(null);
    const [state, dispatch] = useActionState(EditUserWithId, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success) {
            toast.success(state.success);
        }
    }, [state]);

    if (!user) {
        return (
            <div className="bg-card p-8 border border-border rounded-[var(--radius-lg)] max-w-3xl mx-auto text-card-foreground">
                <H2 className="text-destructive select-none">No se ha encontrado el usuario.</H2>
            </div>
        );
    }

    return (
        <div className="bg-card p-8 border border-border rounded-[var(--radius-lg)] max-w-3xl mx-auto text-card-foreground">
            <form 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                noValidate
                action={dispatch}
            >
                {/* Nombre */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                        type="text"
                        id="nombre"
                        name="nombre"
                        defaultValue={user?.nombre}
                    />
                </div>

                {/* Apellidos */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="apellidos">Apellidos</Label>
                    <Input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        defaultValue={user?.apellidos || ""}
                    />
                </div>

                {/* Tipo de documento */}
                <div className="flex flex-col gap-1.5 w-full">
                    <Label htmlFor="tipoDocumento">Tipo de documento</Label>
                    <Select name="tipoDocumento" defaultValue={user?.tipoDocumento || "DNI"}>
                        <SelectTrigger id="tipoDocumento" className="w-full">
                            <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DNI">DNI</SelectItem>
                            <SelectItem value="RUC">RUC</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Número de documento */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="numeroDocumento">Número de documento</Label>
                    <Input
                        type="text"
                        id="numeroDocumento"
                        name="numeroDocumento"
                        defaultValue={user?.numeroDocumento || ""}
                    />
                </div>

                {/* Teléfono */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <Input
                        type="text"
                        id="telefono"
                        name="telefono"
                        defaultValue={user?.telefono || ""}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={user?.email}
                    />
                </div>

                {/* Botón de Guardar */}
                <div className="md:col-span-2 flex justify-end pt-2">
                    <Button 
                        type="submit"
                        className="bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-6"
                    >
                        Guardar cambios
                    </Button>
                </div>
            </form>
        </div>
    );
}