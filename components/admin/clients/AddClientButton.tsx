"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/actions/user/create-user-action";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
    SheetClose,
    SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export default function AddClientButton() {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(createUserAction, {
        errors: [],
        success: null,
    });

    useEffect(() => {
        
        if (state.success) {
            toast.success(state.success.message);
            // Close the sheet and redirect
            router.refresh();
            // router.push("/admin/clients");
        }
    }, [state, router]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition">
                    + Nuevo cliente
                </button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Nuevo Cliente</SheetTitle>
                    <SheetDescription>
                        Completa los datos del nuevo cliente.
                    </SheetDescription>
                </SheetHeader>

                <form action={dispatch} className="mt-6 space-y-4">
                    {[
                        { id: "nombre", label: "Nombre", type: "text" },
                        { id: "apellidos", label: "Apellidos", type: "text" },
                        { id: "email", label: "Email", type: "email" },
                        { id: "telefono", label: "Teléfono", type: "tel" },
                    ].map(({ id, label, type }) => (
                        <div key={id} className="space-y-1">
                            <label htmlFor={id} className="text-sm text-gray-700">{label}</label>
                            <input
                                id={id}
                                name={id}
                                type={type}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    ))}

                    <div className="space-y-1">
                        <label htmlFor="tipoDocumento" className="text-sm text-gray-700">Tipo de documento</label>
                        <select
                            id="tipoDocumento"
                            name="tipoDocumento"
                            defaultValue="DNI"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="">Selecciona</option>
                            <option value="DNI">DNI</option>
                            <option value="RUC">RUC</option>
                            <option value="CE">Carné de extranjería</option>
                            <option value="PAS">Pasaporte</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="numeroDocumento" className="text-sm text-gray-700">N° de documento</label>
                        <input
                            type="text"
                            id="numeroDocumento"
                            name="numeroDocumento"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {isPending ? "Agregando..." : "Agregar cliente"}
                    </button>

                    {state.errors?.length > 0 && (
                        <div className="text-sm text-red-600 space-y-1">
                            {state.errors.map((e: string, i: number) => (
                                <p key={i}>{e}</p>
                            ))}
                        </div>
                    )}
                </form>

                <SheetFooter className="mt-6">
                    <SheetClose asChild>
                        <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition">
                            Cerrar
                        </button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
