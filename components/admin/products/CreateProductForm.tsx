"use client"


import { useActionState, useEffect } from 'react'
import ProductForm from './ProductForm'
import { useRouter } from 'next/navigation'
import { createProduct } from '@/actions/product/add-product-action'
import { getCategories } from '@/src/services/categorys'
import { toast } from 'react-toastify'
import type { CategoriasList } from '@/src/schemas'

export default function CreateProductForm({ categorias }: { categorias: CategoriasList }) {


    // console.log(categorias)

    const router = useRouter()
    const [ state, dispatch ] = useActionState( createProduct, {
        errors: [],
        success: ""
    })

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

    }, [state])

    return (
        <form 
            className="flex flex-col gap-4 w-full max-w-xl mx-auto mt-10"
            noValidate
            action={dispatch}
        >
            <ProductForm 
            // product={undefined}
            categorias={categorias} />
            <input
                type='submit'
                className='bg-gray-800 text-white text-sm font-bold px-4 py-1 rounded-xl hover:bg-gray-950 cursor-pointer transition-all duration-200 ease-in-out'
                value={"Crear producto"}
            />

        </form>
    )
}
