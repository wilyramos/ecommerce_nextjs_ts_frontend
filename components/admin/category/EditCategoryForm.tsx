"use client"
import type { Category } from "@/src/schemas"
import CategoryForm from "./CategoryForm"
import { EditCategory } from "@/actions/category/edit-category-action"
import { useActionState, useEffect } from "react"
import { toast } from "react-toastify"


export default function EditCategoryForm({ category }: { category: Category }) {

    const editCategoryWithId = EditCategory.bind(null, category._id);
    const [state, dispatch] = useActionState(editCategoryWithId, {
        errors: [],
        success: ""
    })


    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
            })
        }
        if (state.success) {
            toast.success(state.success)
            
        }

    }, [state])


    return (
        <form
            className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-10"
            noValidate
            action={dispatch}
        >
            <CategoryForm
                category={category}
            />

            <input
                type="submit"
                value="Actualizar Categoria"
                className="bg-blue-500 text-white font-bold py-3 rounded-full w-full hover:bg-blue-600 transition duration-200 ease-in-out cursor-pointer mt-4"
            />
        </form>
    )
}
