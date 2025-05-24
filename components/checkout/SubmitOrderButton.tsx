
import { useCartStore } from "@/src/store/cartStore"
import { useActionState, useEffect } from 'react'
import { submitOrderAction } from "@/actions/checkout/submit-order-action"
import { toast } from "sonner"
import { useShippingStore } from "@/src/store/shippingStore"
import { useRouter } from "next/navigation"



export default function SubmitOrderButton() {


    const clearCart = useCartStore((s) => s.clearCart)
    const cart = useCartStore((s) => s.cart)
    const shippingData = useShippingStore((s) => s.data)
    const total = useCartStore((s) => s.total)

    const router = useRouter()

    const order = {
        items: cart.map(item => ({
            productId: item._id,
            quantity: item.cantidad,
            price: item.precio
        })),
        totalPrice: total,
        status: "PENDIENTE",
        paymentMethod: "TARJETA", // o lo que seleccione el usuario
        paymentStatus: "PENDIENTE",
        shippingAddress: {
            direccion: shippingData?.direccion,
            ciudad: shippingData?.ciudad,
            telefono: shippingData?.telefono
        }
    };

    console.log(order)


    const submitOrderWithData = submitOrderAction.bind(null, order);
    const [state, dispatch] = useActionState(submitOrderWithData, {
        errors: [],
        success: ""
    })

    useEffect(() => {
        console.log(state)
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
            router.push("/checkout/success");
        }
    }, [state, router, clearCart]);


    return (
        <form
            action={dispatch}

        >
            <input
                type='submit'
                className="mt-5 2-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
                value="Confirmar Compra"
            >

            </input>
        </form>
    )
}