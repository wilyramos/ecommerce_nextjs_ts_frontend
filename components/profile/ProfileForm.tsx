"use client"

import type { User } from "@/src/schemas";

import { useActionState, useEffect } from "react";
import { EditUserAction } from "@/actions/user/edit-user-action";
import { toast } from "sonner";

export default function ProfileForm({ user }: { user: User }) {

    const EditUserWithId = EditUserAction.bind(null, );
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
            console.log("Success:", state.success);
            toast.success(state.success);
        }
    }, [state]);

    if (!user) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
                <p className="text-red-500">No se ha encontrado el usuario.</p>
            </div>
        );
    }


    return (
        <div className="bg-white p-8 max-w-3xl mx-auto">

            <form 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                noValidate
                action={dispatch}
            >
                {/* Nombre */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="nombre" className="text-sm text-gray-600 font-old">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={user?.nombre}
                    />
                </div>

                {/* Apellidos */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="apellidos" className="text-sm text-gray-600 font-extrabold">Apellidos</label>
                    <input
                        type="text"
                        id="apellidos"
                        name="apellidos"
                        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={user?.apellidos || ''}
                    />
                </div>

                {/* Tipo de documento */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="tipoDocumento" className="text-sm text-gray-600 font-extrabold">Tipo de documento</label>
                    <select
                        id="tipoDocumento"
                        name="tipoDocumento"
                        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={user?.tipoDocumento || 'DNI'}
                    >
                        <option value="">Seleccionar</option>
                        <option value="DNI">DNI</option>
                        <option value="RUC">RUC</option>
                        <option value="CE">CE</option>
                    </select>
                </div>

                {/* Número de documento */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="numeroDocumento" className="text-sm text-gray-600 font-">Número de documento</label>
                    <input
                        type="text"
                        id="numeroDocumento"
                        name="numeroDocumento"
                        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={user?.numeroDocumento || ''}
                    />
                </div>

                {/* Teléfono */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="telefono" className="text-sm text-gray-600 font-">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={user?.telefono || ''}
                    />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm text-gray-600 font-">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="rounded-lg bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={user?.email}
                    />
                </div>

                {/* Rol (solo lectura) */}
                {/* <div className="flex flex-col gap-1">
                    <label htmlFor="rol" className="text-sm text-gray-600 font-">Rol</label>
                    <input
                        type="text"
                        id="rol"
                        name="rol"
                        readOnly
                        className="rounded-lg border border-gray-100 bg-gray-2000 px-4 py-2 text-gray-500"
                        defaultValue={user?.rol}
                    />
                </div> */}

                {/* Google ID (solo lectura) */}
                
                {/* Botón de guardar */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-800 px-4 py-2 text-white hover:bg-blue-600"
                    >
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
}
