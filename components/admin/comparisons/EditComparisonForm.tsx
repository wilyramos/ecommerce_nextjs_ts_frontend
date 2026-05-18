"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateComparisonAction } from "@/actions/comparison-action";
import { Comparison } from "@/src/schemas/comparison.schema";
import ComparisonForm from "./ComparisonForm";
import { Button } from "@/components/ui/button";

interface EditComparisonFormProps {
    comparison: Comparison;
}

export default function EditComparisonForm({ comparison }: EditComparisonFormProps) {
    const router = useRouter();

    // Se vinculan los parámetros fijos identificadores de la entidad (id, slug) vía .bind()
    const boundUpdateAction = updateComparisonAction.bind(null, comparison._id, comparison.slug);

    const [state, dispatch, isPending] = useActionState(boundUpdateAction, {
        success: false,
        message: ""
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Cambios aplicados correctamente");
            router.push("/admin/comparisons");
        }
        if (!state.success && state.message && !state.errors) {
            toast.error(state.message);
        }
    }, [state, router]);

    return (
        <form action={dispatch} className="space-y-6" noValidate>
            <ComparisonForm
                initialData={comparison}
                fields={state.success ? undefined : state.fields}
                fieldErrors={state.errors}
                generalError={!state.success && state.message ? state.message : undefined}
            />
            <div className="flex justify-end py-4 bg-[var(--color-bg-secondary)] border-t sticky bottom-0 z-10 px-6 rounded-b-xl">
                <Button type="submit" disabled={isPending} className="px-8 font-semibold">
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                </Button>
            </div>
        </form>
    );
}