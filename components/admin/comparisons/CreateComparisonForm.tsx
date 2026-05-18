"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createComparisonAction } from "@/actions/comparison-action";
import ComparisonForm from "./ComparisonForm";
import { Button } from "@/components/ui/button";

export default function CreateComparisonForm() {
    const router = useRouter();

    const [state, dispatch, isPending] = useActionState(createComparisonAction, {
        success: false,
        message: ""
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Comparativa guardada");
            router.push("/admin/comparisons");
        }
        if (!state.success && state.message && !state.errors) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="space-y-6" noValidate>
            <ComparisonForm
                fields={state.success ? undefined : state.fields}
                fieldErrors={state.errors}
                generalError={!state.success && state.message ? state.message : undefined}
            />
            <div className="flex justify-end py-4 bg-[var(--color-bg-secondary)] border-t sticky bottom-0 z-10 px-6 rounded-b-xl">
                <Button type="submit" disabled={isPending} className="px-8 font-semibold">
                    {isPending ? "Guardando..." : "Crear Comparativa"}
                </Button>
            </div>
        </form>
    );
}