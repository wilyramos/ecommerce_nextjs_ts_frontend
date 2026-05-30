// File: frontend/src/components/admin/banner/EditSliderBannerForm.tsx
"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { updateSliderBannerAction, type ActionState } from "@/actions/slider-actions";
import SliderForm from "./SliderForm";
import type { SliderBanner } from "@/src/schemas/slider.schema";
import { Button } from "@/components/ui/button";

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

            <div className="flex items-center justify-between px-6 py-4 bg-card border-t border-border sticky bottom-0 z-10 rounded-b-[var(--radius-lg)] text-card-foreground">
                <Link
                    href={`/admin/slider/${id}/preview`}
                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-ring rounded-[var(--radius-sm)] px-2 py-1"
                >
                    Ver preview →
                </Link>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                    >
                        <Link href="/admin/slider">
                            Cancelar
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-action-cta hover:bg-action-cta-hover text-action-cta-foreground font-bold px-8"
                    >
                        {isPending ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </div>
        </form>
    );
}