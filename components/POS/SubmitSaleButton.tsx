import { useCartStore } from "@/src/store/cartStore"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from 'react'
import { toast } from "sonner"
import { submitSaleAction } from "@/actions/pos/submit-sale-action"
import { custom } from "zod"


export default function SubmitSaleButton() {



    const clearCart = useCartStore((s) => s.clearCart)
    const cart = useCartStore((s) => s.cart)
    const total = useCartStore((s) => s.total)

    const router = useRouter()

    const sale = {
        customer: "null", // Aquí puedes agregar el ID del cliente si es necesario
        employee: "test-employee-id", // Aquí puedes agregar el ID del empleado si es necesario
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
        paymentStatus: "PENDIENTE"

    };


    const submitSaleWithData = submitSaleAction.bind(null, sale);
    const [state, dispatch] = useActionState(submitSaleWithData, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        if (state.errors) {
            state.errors.forEach((error) => {
                console.log("error", error)
                toast.error(error);
            })
        }
        if (state.success) {
            console.log(state.success)
            toast.success(state.success);
            clearCart();
            router.push("/pos/success");
        }
    }, [state, router, clearCart]);

    return (
        <form
            action={dispatch}
        >
            <input
                type="submit"
                className="mt-4 w-full rounded-md bg-primary py-2 text-white hover:bg-primary-dark"
                value="Confirmar Venta"
            />
        </form>
    )
}