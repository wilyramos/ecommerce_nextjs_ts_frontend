"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStore } from "@/src/store/shippingStore";
import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { submitOrderAction } from "@/actions/checkout/submit-order-action";
import { createMPPreference } from "@/actions/checkout/create-mp-preference";
import type { OrderCreateMPPreferenceInput } from "@/src/schemas";

export default function SubmitOrderButton({ paymentMethod }: { paymentMethod: string }) {
    const { cart, clearCart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();

    // Verificar que los datos necesarios estén completos
    const isOrderValid = () => {
        return (
            cart.length > 0 &&
            shipping?.direccion &&
            shipping?.distrito &&
            profile?.email &&
            profile?.nombre
        );
    };

    const orderData: OrderCreateMPPreferenceInput = {
        items: cart.map(item => ({
            id: item._id,
            title: item.nombre,
            quantity: item.cantidad,
            unit_price: item.precio,
        })),
        shipping: {
            address: {
                street_name: shipping?.direccion || "",
                street_number: shipping?.numero || "",
                floor: shipping?.piso || "",
                apartment: shipping?.referencia || "",
                city: shipping?.distrito || "",
                state: shipping?.provincia || "",
                country: shipping?.departamento || "",
            },
        },
        payer: {
            email: profile?.email || "",
            first_name: profile?.nombre || "",
            last_name: profile?.apellidos || "",
            phone: {
                area_code: "51",
                number: profile?.telefono || "",
            },
        },
    };

    // useActionState para órdenes que no usan pasarela
    const submitOrderWithData = submitOrderAction.bind(null, orderData);
    const [state, dispatch, isPending] = useActionState(submitOrderWithData, {
        errors: [],
        success: "",
    });

    useEffect(() => {
        if (state?.success) {
            toast.success("Pedido realizado con éxito");
            clearCart();
            // router.push("/gracias") si quieres redirigir
        }

        if (state?.errors?.length > 0) {
            toast.error("Hubo un error al procesar el pedido");
            console.error("Errores:", state.errors);
        }
    }, [state, clearCart]);

    const handleSubmit = async () => {
        if (!isOrderValid()) {
            toast.warning("Por favor, completa todos los datos del pedido");
            return;
        }

        if (paymentMethod === "mercadopago") {
            try {
                const initPoint = await createMPPreference(orderData);
                if (initPoint) {
                    window.location.href = initPoint;
                } else {
                    throw new Error("initPoint vacío");
                }
            } catch (err) {
                toast.error("Error al redirigir a MercadoPago");
                console.error(err);
            }
        } else {
            dispatch(); // Orden directa sin pasarela
        }
    };

    return (
        <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-5 w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? "Procesando..." : "Pagar y finalizar compra"}
        </button>
    );
}
