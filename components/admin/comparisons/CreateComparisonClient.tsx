// File: frontend/components/admin/comparisons/CreateComparisonClient.tsx
"use client";

import { useEffect, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createComparisonAction, type ActionState } from "@/actions/comparison.actions";
import BaseComparisonForm from "./BaseComparisonForm";

export default function CreateComparisonClient() {
    const router = useRouter();
    const [isPendingClient, startTransition] = useTransition();

    const [state, formAction, isPendingServer] = useActionState<ActionState<null>, FormData>(
        createComparisonAction,
        null
    );

    const isPending = isPendingClient || isPendingServer;

    useEffect(() => {
        if (!state) return;
        if (state.ok) {
            toast.success(state.message || "Comparativa creada exitosamente.");
            router.push("/admin/comparisons");
        } else if (state.error) {
            toast.error(state.error);
        }
    }, [state, router]);

    const handleSubmit = (formData: FormData) => {
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <BaseComparisonForm
            isEditing={false}
            actionState={state}
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admin/comparisons")}
        />
    );
}