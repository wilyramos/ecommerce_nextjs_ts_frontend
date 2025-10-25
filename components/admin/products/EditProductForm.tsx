"use client"

import type { ProductWithCategoryResponse } from "@/src/schemas";
import { useActionState, useEffect } from "react";
import ProductForm from "./ProductForm";
import { EditProduct } from "@/actions/product/edit-product-action";
import type { CategoryListResponse } from '@/src/schemas';
import { toast } from "sonner";
import type { TBrand } from "@/src/schemas/brands";


export default function EditProductForm({ product, categorias, brands }: { product: ProductWithCategoryResponse, categorias: CategoryListResponse, brands: TBrand[] }) {

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
                    key={product._id} // Ensure the form re-renders when the product is updated
                    product={product}
                    categorias={categoriasOrdenadas}
                    brands={brands}
                />
                <input
                    type="submit"
                    value="Actualizar Producto"
                    className='bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 cursor-pointer inline-block' 
                />

            </form>
        </>
    )
}
