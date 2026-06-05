// File: components/admin/category/CreateCategoryForm.tsx

"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import type { CategoryResponse } from "@/src/schemas/category.schema";
import { createCategoryAction } from "@/actions/category/category-action";
import CategoryForm from "./CategoryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = { categories: CategoryResponse[] };

export default function CreateCategoryForm({ categories }: Props) {
    const router = useRouter();
    const [state, dispatch] = useActionState(createCategoryAction, {
        errors: [],
        success: "",
    });

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
                    <CategoryForm categories={categories} />
                </CardContent>
                <div className="flex justify-end border-t pt-4">
                    <Button type="submit">
                        Crear categoría
                    </Button>
                </div>
            </Card>
        </form>
    );
}