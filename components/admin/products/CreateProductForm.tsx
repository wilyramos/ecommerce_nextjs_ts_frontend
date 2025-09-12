"use client"

import { useActionState, useEffect } from 'react'
import ProductForm from './ProductForm'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/actions/product/add-product-action'
import { toast } from 'sonner'
import type { CategoryListResponse } from '@/src/schemas'

export default function CreateProductForm({ categorias }: { categorias: CategoryListResponse }) {

    const router = useRouter();

    const [state, dispatch] = useActionState(createProduct, {
        errors: [],
        success: ""
    });

    useEffect(() => {

        if (state.success) {
            toast.success(state.success)
            router.push("/admin/products")
        }
        if (state.errors) {
            state.errors.forEach((error) => {
                toast.error(error)
            })
        }

    }, [state, router])

    // Ordenar categorias
    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );


    return (
        <form
            className="flex flex-col gap-2 w-full max-w-4xl mx-auto mt-8"
            noValidate
            action={dispatch}
        >
            <ProductForm
                categorias={categoriasOrdenadas} />
            <input
                type='submit'
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800 cursor-pointer inline-block'
                value={"Crear producto"}
            />

        </form>
    )
}