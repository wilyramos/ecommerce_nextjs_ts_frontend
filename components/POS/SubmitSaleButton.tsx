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

    console.log("DNIIII", dni)

    console.log("cart", cart)

    const router = useRouter()

    const sale: CreateSaleInput = {
        items: cart.map(item => ({
            product: item._id,
            quantity: item.cantidad,
            price: item.precio
        })),
        totalPrice: total,
        totalDiscountAmount: 0,
        source: "POS",
        status: "COMPLETADA",
        paymentMethod: "EFECTIVO",
        paymentStatus: "PAGADO",
        customer: dni || undefined,
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
            clearCart();

        }
    }, [state, router, clearCart]);

    return (
        <form
            action={dispatch}
        >
            <input
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
                value="Confirmar Venta"
            />
        </form>
    )
}