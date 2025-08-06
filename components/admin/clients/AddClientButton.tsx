"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserAction } from "@/actions/user/create-user-action";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
    SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { LuUserRoundPlus } from "react-icons/lu";


export default function AddClientButton() {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(createUserAction, {
        errors: [],
        success: null,
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.success.message);
            router.refresh();
        }
    }, [state, router]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button className="rounded-2xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition flex text-center items-center cursor-pointer">
                    <LuUserRoundPlus className="mr-2" />
                    <p className="hidden md:block">Agregar Cliente</p>
                </button>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Nuevo Cliente</SheetTitle>
                </SheetHeader>

                <form action={dispatch} className="mt-6 space-y-4 text-sm">
                    {/* Tipo de documento */}
                    <div className="flex items-center gap-4">
                        <label htmlFor="tipoDocumento" className="w-40 text-gray-700 font-medium">
                            Tipo de documento
                        </label>
                        <select
                            id="tipoDocumento"
                            name="tipoDocumento"
                            defaultValue="DNI"
                            className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 bg-gray-200"
                        >
                            <option value="">Selecciona</option>
                            <option value="DNI">DNI</option>
                            <option value="RUC">RUC</option>
                            <option value="CE">Carné de extranjería</option>
                            <option value="PAS">Pasaporte</option>
                        </select>
                    </div>

                    {/* N° de documento */}
                    <div className="flex items-center gap-4">
                        <label htmlFor="numeroDocumento" className="w-40 text-gray-700 font-medium">
                            N° de documento
                        </label>
                        <input
                            type="text"
                            id="numeroDocumento"
                            name="numeroDocumento"
                            className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 bg-gray-200"
                        />
                    </div>

                    {/* Campos generales */}
                    {[
                        { id: "nombre", label: "Nombre", type: "text" },
                        { id: "email", label: "Email", type: "email" },
                        { id: "telefono", label: "Teléfono", type: "tel" },
                    ].map(({ id, label, type }) => (
                        <div key={id} className="flex items-center gap-4">
                            <label htmlFor={id} className="w-24 text-gray-700 font-bold">
                                {label}
                            </label>
                            <input
                                id={id}
                                name={id}
                                type={type}
                                className="flex-1 rounded-2xl border border-gray-300 px-3 py-2 bg-gray-200"
                            />
                        </div>
                    ))}

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-2xl bg-blue-600 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isPending ? "Agregando..." : "Agregar cliente"}
                    </button>

                    {/* Errores */}
                    {state.errors?.length > 0 && (
                        <div className="text-sm text-red-600 space-y-1">
                            {state.errors.map((e: string, i: number) => (
                                <ErrorMessage key={i}>{e}</ErrorMessage>
                            ))}
                        </div>
                    )}
                </form>
            </SheetContent>
        </Sheet>
    );
}
