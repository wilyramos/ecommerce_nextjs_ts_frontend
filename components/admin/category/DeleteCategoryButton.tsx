"use client"

import { FiTrash } from "react-icons/fi";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { DeleteCategoryAction } from "@/actions/category/delete-category-action";


export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {

    const router = useRouter();
    const deleteCategoryWithId = DeleteCategoryAction.bind(null, categoryId);
    const [state, dispatch] = useActionState(deleteCategoryWithId, {
        errors: [],
        success: ""
    });

    console.log(state);

    useEffect(() => {
        console.log(state);
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products/category");
        }
    }, [state, router]);

    
    return (
        <form
            action={dispatch}
        >
            <button
                type="submit"
                className="flex items-center gap-2 px-4 py-1 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 cursor-pointer"
            >
                <FiTrash className="w-4 h-4" />

                Eliminar Categoria
            </button>

        </form>
    )
}
