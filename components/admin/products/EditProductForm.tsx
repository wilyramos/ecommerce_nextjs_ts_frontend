"use client"


import type { Product } from "@/src/schemas";
import { useActionState, useEffect } from "react"
import ProductForm from "./ProductForm";
import { EditProduct } from "@/actions/product/edit-product-action";
import type { CategoriasList } from '@/src/schemas'
import { toast } from "react-toastify";



export default function EditProductForm({ product, categorias }: { product: Product, categorias: CategoriasList }) {

    const editProductWithId = EditProduct.bind(null, product._id);
    const [state, dispatch] = useActionState(editProductWithId, {
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
        <>
            <form
                className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-10"
                noValidate
                action={dispatch}
            >
                <ProductForm
                    product={product}
                    categorias={categorias}
                />
                <input
                    type="submit"
                    value="Actualizar Producto"
                    className="bg-blue-500 text-white font-bold py-3 rounded-full w-full hover:bg-blue-600 transition duration-200 ease-in-out cursor-pointer mt-4"
                />

            </form>
        </>
    )
}
