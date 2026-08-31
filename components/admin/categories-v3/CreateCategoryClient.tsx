// File: frontend/components/admin/categories-v3/CreateCategoryClient.tsx
"use client";

import { useEffect, useTransition, useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createCategoryAction, type ActionState } from "@/actions/category-v3.actions";
import type { CategoryTreeItem } from "@/src/schemas/category-v3.schema";
import BaseCategoryForm from "./BaseCategoryForm";

interface CreateCategoryClientProps {
    tree: CategoryTreeItem[];
}

export default function CreateCategoryClient({ tree }: CreateCategoryClientProps) {
    const router = useRouter();
    const [isPendingClient, startTransition] = useTransition();

    const [state, formAction, isPendingServer] = useActionState<ActionState<null>, FormData>(
        createCategoryAction,
        null
    );

    const isPending = isPendingClient || isPendingServer;

    useEffect(() => {
        if (!state) return;
        if (state.ok) {
            toast.success(state.message || "Categoría creada con éxito");
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
            tree={tree}
            isEditing={false}
            actionState={state}
            isPending={isPending}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admin/category-v3")}
        />
    );
}