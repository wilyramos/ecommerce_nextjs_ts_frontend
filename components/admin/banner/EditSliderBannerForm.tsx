// File: frontend/src/components/admin/banner/EditSliderBannerForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { updateSliderBannerAction, type ActionState } from "@/actions/slider-actions";
import SliderForm from "./SliderForm";
import type { SliderBanner } from "@/src/schemas/slider.schema";

interface Props {
    id: string;
    initialData: SliderBanner;
}

function buildAction(id: string) {
    return (prev: ActionState<SliderBanner>, formData: FormData) =>
        updateSliderBannerAction(id, prev, formData);
}

const INITIAL_STATE: ActionState<SliderBanner> = {
    success: false,
    message: "",
};

export default function EditSliderBannerForm({ id, initialData }: Props) {
    const router = useRouter();
    const isFirstRender = useRef(true);
    const action = buildAction(id);

    const [state, dispatch, isPending] = useActionState(action, INITIAL_STATE);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (state.success) {
            toast.success(state.message ?? "Banner actualizado correctamente.");
            // router.push("/admin/slider");
            return;
        }

        if (state.message) toast.error(state.message);

        if (!state.success && state.errors?.length) {
            state.errors.forEach((err) => {
                if (err !== state.message) toast.error(err);
            });
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="flex flex-col gap-4 w-full" noValidate>
            <SliderForm
                initialData={initialData}
                fields={state.success ? undefined : state.fields}
                fieldErrors={state.success ? undefined : state.fieldErrors}
            />

            <div className="flex items-center justify-between px-6 py-4 bg-white border-t sticky bottom-0 z-10">
                <Link
                    href={`/admin/slider/${id}/preview`}
                    className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
                >
                    Ver preview →
                </Link>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/slider"
                        className="px-5 py-2.5 text-sm text-zinc-600 border border-zinc-200 rounded-md hover:bg-zinc-50 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-8 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-md hover:bg-zinc-700 disabled:bg-zinc-300 transition-colors"
                    >
                        {isPending ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </div>
        </form>
    );
}