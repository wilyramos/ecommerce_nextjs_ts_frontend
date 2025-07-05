"use client"

import { useActionState, useEffect } from 'react'
import ProductForm from './ProductForm'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/actions/product/add-product-action'
import { toast } from 'react-toastify'
import type { CategoriasList } from '@/src/schemas'

export default function CreateProductForm({ categorias }: {categorias : CategoriasList}){

    const router = useRouter();
    
    const [ state, dispatch ] = useActionState(createProduct, {
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

    return (
        <form
            className="flex flex-col gap-2 w-full max-w-2xl mx-auto mt-8"
            noValidate
            action={dispatch}
        >
            <ProductForm
                // product={undefined}
                categorias={categorias} />
            <input
                type='submit'
                className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-all duration-200 ease-in-out cursor-pointer inline-block'
                value={"Crear producto"}
            />

        </form>
    )
}