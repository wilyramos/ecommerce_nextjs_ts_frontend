// File: frontend/components/admin/comparisons/EditComparisonClient.tsx
"use client";

import { useEffect, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateComparisonAction, type ActionState } from "@/actions/comparison.actions";
import type { CreateComparisonDTO } from "@/src/schemas/comparison.schema";
import type { ProductSearchResult } from "@/src/schemas/product-v3.schema";
import BaseComparisonForm from "./BaseComparisonForm";

interface EditComparisonClientProps {
    initialData: CreateComparisonDTO & { _id: string; productsDetails?: ProductSearchResult[] };
}

type ActionFunction = (prevState: ActionState<null>, formData: FormData) => Promise<ActionState<null>>;

export default function EditComparisonClient({ initialData }: EditComparisonClientProps) {
    const router = useRouter();
    const [isPendingClient, startTransition] = useTransition();

    const updateActionWithId = updateComparisonAction.bind(null, initialData._id) as ActionFunction;

    const [state, formAction, isPendingServer] = useActionState<ActionState<null>, FormData>(
        updateActionWithId,
        null
    );

    const isPending = isPendingClient || isPendingServer;

    useEffect(() => {
        if (!state) return;
        if (state.ok) {
            toast.success(state.message || "Comparativa actualizada exitosamente.");
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
            initialData={initialData}
            isEditing={true}
            actionState={state}
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admin/comparisons")}
        />
    );
}