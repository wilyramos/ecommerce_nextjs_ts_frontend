"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { UpdateStatusProduct } from "@/actions/product/edit-status-product";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { toast } from "sonner";

export default function EditStatusProductButton({ productId, isActive }: { productId: string, isActive: boolean }) {


    const router = useRouter();
    const toggleStatusWithId = UpdateStatusProduct.bind(null, productId);
    const [state, dispatch] = useActionState(toggleStatusWithId, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors.length > 0) {
            state.errors.forEach(error => {
                toast.error(error);
            });
        }
        if (state.success) {
            toast.success(state.success);
            router.refresh();
        }
    }, [state, router]);

    return (
        <form action={dispatch}>
            <button
                type="submit"
                className={`flex items-center gap-2 px-4 py-1 text-sm font-medium rounded-lg border transition-colors duration-200 cursor-pointer ${isActive
                        ? "text-yellow-600 border-yellow-300 hover:bg-yellow-100 hover:text-yellow-700"
                        : "text-green-600 border-green-300 hover:bg-green-100 hover:text-green-700"
                    }`}
            >
                {isActive ? (
                    <>
                        <FiToggleLeft className="w-4 h-4" />
                        Desactivar
                    </>
                ) : (
                    <>
                        <FiToggleRight className="w-4 h-4" />
                        Activar
                    </>
                )}
            </button>
        </form>
    );
}