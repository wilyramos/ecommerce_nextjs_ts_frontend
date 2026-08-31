// File: frontend/components/admin/categories-v3/EditCategoryClient.tsx
"use client";

import { useEffect, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateCategoryAction, type ActionState } from "@/actions/category-v3.actions";
import type { CategoryResponse, CategoryTreeItem } from "@/src/schemas/category-v3.schema";
import BaseCategoryForm from "./BaseCategoryForm";

interface EditCategoryClientProps {
    initialData: CategoryResponse;
    tree: CategoryTreeItem[];
}

type ActionFunction = (prevState: ActionState<null>, formData: FormData) => Promise<ActionState<null>>;

export default function EditCategoryClient({ initialData, tree }: EditCategoryClientProps) {
    const router = useRouter();
    const [isPendingClient, startTransition] = useTransition();

    // Bind del ID a la Server Action
    const updateActionWithId = updateCategoryAction.bind(null, initialData._id) as ActionFunction;

    const [state, formAction, isPendingServer] = useActionState<ActionState<null>, FormData>(
        updateActionWithId,
        null
    );

    const isPending = isPendingClient || isPendingServer;

    useEffect(() => {
        if (!state) return;
        if (state.ok) {
            toast.success(state.message || "Categoría actualizada exitosamente");
            router.push("/admin/category-v3");
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
        <BaseCategoryForm
            initialData={initialData}
            tree={tree}
            isEditing={true}
            actionState={state}
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admin/category-v3")}
        />
    );
}