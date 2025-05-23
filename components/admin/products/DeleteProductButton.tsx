"use client";

import { DeleteProduct } from "@/actions/product/delete-product-action";
import { useActionState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FiTrash } from "react-icons/fi"; 

export default function DeleteProductForm({ productId }: { productId: string }) {
    const router = useRouter();

    const deleteProductWithId = DeleteProduct.bind(null, productId);
    const [state, dispatch] = useActionState(deleteProductWithId, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success) {
            toast.success(state.success);
            router.push("/admin/products");
        }
    }, [state, router]);

    

    return (
        <form action={dispatch}>
            <button
                type="submit"
                className="flex items-center gap-2 px-4 py-1 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors duration-200 cursor-pointer"
            >
                <FiTrash className="w-4 h-4" />
                Eliminar
            </button>
        </form>
    );
}
