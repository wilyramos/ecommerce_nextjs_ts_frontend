// File: frontend/src/modules/page/admin/components/CreatePageForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPageAction } from "@/src/modules/page/page.actions";
import PageForm from "./PageForm";

export default function CreatePageForm() {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(createPageAction, {
        success: false,
        message: null,
        errors: {},
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Página guardada exitosamente");
            router.push("/admin/pages");
        }

        if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="flex flex-col gap-4 w-full mt-8" noValidate>
            <PageForm
                actionState={state}
            />
            
            <div className="flex justify-end py-4 bg-gray-50 border-t sticky bottom-0 z-10">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-all shadow-sm"
                >
                    {isPending ? "Guardando..." : "Crear Página"}
                </button>
            </div>
        </form>
    );
}