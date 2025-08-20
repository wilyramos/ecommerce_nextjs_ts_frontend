import { useCartStore } from "@/src/store/cartStore"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from 'react'
import { toast } from "sonner"
import { submitSaleAction } from "@/actions/pos/submit-sale-action"
import type { CreateSaleInput } from "@/src/schemas"


export default function SubmitSaleButton() {
    const clearCart = useCartStore((s) => s.clearCart)
    const cart = useCartStore((s) => s.cart)
    const total = useCartStore((s) => s.total)
    const dni = useCartStore((s) => s.dni)
    const clearDni = useCartStore((s) => s.clearDni)

    const router = useRouter()

    const sale: CreateSaleInput = {
        items: cart.map(item => ({
            product: item._id,
            quantity: item.cantidad,
            price: item.precio
        })),
        totalPrice: total,
        totalDiscountAmount: 0,
        status: "COMPLETED",
        paymentMethod: "CASH",
        paymentStatus: "approved",
        customerDNI: dni || undefined,
        source: "POS",
    };


    const submitSaleWithData = submitSaleAction.bind(null, sale);
    const [state, dispatch] = useActionState(submitSaleWithData, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => {
                // console.log("error", error)
                toast.error(error);
            })
        }
        if (state.success) {
            // console.log(state.success)
            toast.success(state.success);
            clearDni();
            clearCart();
        }
    }, [state, router, clearCart, clearDni]);

    return (
        <form
            action={dispatch}
        >
            <input
                type="submit"
                className="w-full bg-rose-600 text-white font-semibold py-2  hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer px-4 rounded-full"
                value="Guardar Venta"
            />
        </form>
    )
}