"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { CategoryResponse } from "@/src/schemas/category.schema";
import { editCategoryAction, type ActionStateType } from "@/actions/category/category-action";
import CategoryForm from "./CategoryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
    category: CategoryResponse;
    categories: CategoryResponse[];
};

export default function EditCategoryForm({ category, categories }: Props) {
    const router = useRouter();

    // Satisface la firma exacta de useActionState (state, payload)
    // El ID se inyecta por clausura (closure) de JavaScript de forma transparente
    const [state, dispatch] = useActionState(
        async (prevState: ActionStateType, formData: FormData) => {
            return editCategoryAction(category._id, prevState, formData);
        },
        {
            errors: [],
            success: "",
        }
    );

    useEffect(() => {
        state.errors.forEach((e) => toast.error(e));
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products/category");
        }
    }, [state, router]);

    return (
        <form noValidate action={dispatch} className="max-w-7xl mx-auto">
            <Card>
                <CardContent className="pt-6">
                    <CategoryForm category={category} categories={categories} />
                </CardContent>
                <div className="flex justify-end border-t pt-4 p-6">
                    <Button type="submit">
                        Guardar cambios
                    </Button>
                </div>
            </Card>
        </form>
    );
}