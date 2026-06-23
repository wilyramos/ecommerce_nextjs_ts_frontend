// File: frontend/src/modules/page/admin/components/EditPageForm.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePageAction } from "@/src/modules/page/page.actions";
import PageForm from "./PageForm";

interface EditPageFormProps {
    initialData: {
        id: string;
        title: string;
        slug: string;
        content: string;
        isActive: boolean;
        seo?: {
            metaTitle?: string;
            metaDescription?: string;
        };
    };
}

export default function EditPageForm({ initialData }: EditPageFormProps) {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(updatePageAction, {
        success: false,
        message: null,
        errors: {},
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Cambios guardados con éxito");
            router.push("/admin/pages");
        }

        if (!state.success && state.message) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="flex flex-col gap-4 w-full mt-8" noValidate>
            {/* Campo oculto para mandar el id en la mutación */}
            <input type="hidden" name="id" value={initialData.id} />

            <PageForm
                initialData={initialData}
                actionState={state}
            />
            
            <div className="flex justify-end py-4 bg-gray-50 border-t sticky bottom-0 z-10">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-all shadow-sm"
                >
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}