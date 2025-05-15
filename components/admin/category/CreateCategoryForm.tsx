"use client"

import { useRouter } from "next/navigation"
import CategoryForm from "./CategoryForm"
import { createCategoryAction } from "@/actions/category/create-category-action"
import { useActionState, useEffect } from "react"
import { toast } from 'react-toastify'





export default function CreateCategoryForm({ }) {

    const router = useRouter()
    const [state, dispatch] = useActionState(createCategoryAction, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => {
                // console.log("error", error)
                toast.error(error)
            })
        }
        if (state.success) {
            toast.success(state.success)
            router.push('/admin/products/category')
        }
    }, [state, router])



    return (

        <form
            className="mt-10 space-y-2"
            noValidate
            action={dispatch}
        >
            <CategoryForm />

            <input
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                value="Crear Categoria"

            />

        </form>
    )
}