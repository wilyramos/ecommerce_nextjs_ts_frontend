"use client"

import { DeleteProduct } from "@/actions/product/delete-product-action"
import { use, useActionState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"



export default function DeleteProductForm({productId}: {productId: string}) {

    const router = useRouter();

    const deleteProductWithId = DeleteProduct.bind(null, productId);
    const [state, dispatch] = useActionState(deleteProductWithId, {
        errors: [],
        success: ""
    });

    console.log(state);

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error)
            })
        }
        if (state.success) {
            toast.success(state.success)
            router.push("/admin/products")
        }

    }, [state])

    return (

        <form
            action={dispatch}
        >
            <input
                type="submit"
                className="text-red-600 hover:text-red-800 cursor-pointer"
                value="Eliminar"
            />
        </form>
    )
}

