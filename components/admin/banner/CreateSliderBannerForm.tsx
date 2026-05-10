// File: frontend/src/components/admin/banner/CreateSliderBannerForm.tsx
"use client";

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createSliderBannerAction } from '@/actions/slider-actions';
import SliderForm from './SliderForm';

export default function CreateSliderBannerForm() {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(createSliderBannerAction, {
        success: false,
        message: ""
    });

   useEffect(() => {
    if (state.success) {
        toast.success(state.message || "Banner guardado");
        router.push("/admin/slider");
    }

    if (!state.success && state.message) {
        // Toast principal
        toast.error(state.message);

        // Mostrar errores específicos en toasts (opcional, puede ser invasivo)
        if (state.errors && state.errors.length > 0) {
            state.errors.forEach((err) => {
                // Evitamos repetir el mensaje genérico
                if (err !== state.message) toast.error(err);
            });
        }
    }
}, [state, router]);

    return (
        <form action={dispatch} className="flex flex-col gap-4 w-full mt-8" noValidate>
            <SliderForm
                fields={state.success ? undefined : state.fields}
                fieldErrors={state.success ? undefined : state.fieldErrors}
            />
            <div className="flex justify-end py-4 bg-gray-50 border-t sticky bottom-0 z-10">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-all shadow-sm"
                >
                    {isPending ? "Guardando..." : "Crear Banner"}
                </button>
            </div>
        </form>
    );
}