'use client';

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStore } from "@/src/store/shippingStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { submitOrderAction } from "@/actions/checkout/submit-order-action";
import { createMPPreference } from "@/actions/checkout/create-mp-preference";

export default function SubmitOrderButton({ paymentMethod }: { paymentMethod: string }) {


    const clearCart = useCartStore((s) => s.clearCart);
    const cart = useCartStore((s) => s.cart);
    const shippingData = useCheckoutStore((s) => s.shipping);
    const total = useCartStore((s) => s.total);
    const router = useRouter();

    const order = {
        items: cart.map(item => ({
            product: item._id,
            quantity: item.cantidad,
            price: item.precio
        })),
        totalPrice: total,
        status: "PENDIENTE",
        paymentMethod: paymentMethod.toUpperCase(),
        paymentStatus: "PENDIENTE",
        shippingAddress: {
            direccion: shippingData?.direccion,
            distrito: shippingData?.distrito,
            // telefono: shippingData?.
        }
    };

    const submitOrderWithData = submitOrderAction.bind(null, order);
    const [state, dispatch] = useActionState(submitOrderWithData, {
        errors: [],
        success: ""
    });

    useEffect(() => {
        console.log("Order state:", state);
    }, [state]);

    const handleSubmit = async () => {
        if (paymentMethod === "mercadopago") {
            try {
                const initPoint = await createMPPreference(order);
                window.location.href = initPoint;
            } catch (err) {
                toast.error("Error al redirigir a MercadoPago");
                console.error(err);
            }
        } else {
            // Para otros métodos como efectivo, Yape, etc.
            dispatch();
        }
    };

    return (
        <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
            Pagar y finalizar compra
        </button>
    );
}
