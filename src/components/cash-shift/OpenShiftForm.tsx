// File: frontend/src/components/cash-shift/OpenShiftForm.tsx
"use client";

import { useActionState } from "react";
import { openCashAction } from "@/actions/cash-actions";
import { DollarSign, Loader2 } from "lucide-react";

export function OpenShiftForm({ userId }: { userId: string }) {
    const [state, formAction, pending] = useActionState(
        openCashAction,
        {
            success: false,
            message: "",
        }
    );

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl border shadow-sm text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
                Apertura de Caja
            </h1>

            <p className="text-gray-500 mt-2 mb-6 text-sm">
                Inicia un nuevo turno ingresando el efectivo disponible en caja.
            </p>

            <form action={formAction} className="space-y-4">
                <input
                    type="hidden"
                    name="userId"
                    value={userId}
                />

                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
                        S/
                    </span>

                    <input
                        name="initialBalance"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        className="w-full pl-12 pr-4 py-4 text-3xl font-bold border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                </div>

                {state.message && (
                    <p
                        className={`text-sm font-medium ${state.success
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {state.message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {pending && (
                        <Loader2
                            className="animate-spin"
                            size={20}
                        />
                    )}

                    {pending
                        ? "Abriendo..."
                        : "Abrir Turno de Caja"}
                </button>
            </form>
        </div>
    );
}