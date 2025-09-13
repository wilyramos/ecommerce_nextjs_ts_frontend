"use client"


import type { ProductWithCategoryResponse } from "@/src/schemas";
import { useActionState, useEffect } from "react"
import ProductForm from "./ProductForm";
import { EditProduct } from "@/actions/product/edit-product-action";
import type { CategoryListResponse } from '@/src/schemas'
import { toast } from "react-toastify";



export default function EditProductForm({ product, categorias }: { product: ProductWithCategoryResponse, categorias: CategoryListResponse }) {

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

    // CreateProductForm.tsx
    const categoriasOrdenadas = [...categorias].sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })
    );


    return (
        <>
            <form
                className="flex flex-col gap-2 w-full max-w-3xl mx-auto mt-8 bg-white rounuded"
                noValidate
                action={dispatch}
            >
                <ProductForm
                    key={product.updatedAt} // Ensure the form re-renders when the product is updated
                    product={product}
                    categorias={categoriasOrdenadas}
                />
                <input
                    type="submit"
                    value="Actualizar Producto"
                    className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer inline-block' 
                />

            </form>
        </>
    )
}
