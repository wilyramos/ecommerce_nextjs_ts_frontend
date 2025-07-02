"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStore } from "@/src/store/shippingStore";
import { createMPPreference } from "@/actions/checkout/create-mp-preference";

export default function AutoCheckoutIniciator() {
    const { cart } = useCartStore();
    const { shipping } = useCheckoutStore();
    const [hasInitiated, setHasInitiated] = useState(false);

    useEffect(() => {
        const startCheckout = async () => {
            try {
                const orderData = {
                    items: cart.map((item) => ({
                        product: item._id,
                        title: item.nombre,
                        price: item.precio,
                        quantity: item.cantidad,
                    })),
                    shipping, // puedes incluir más datos aquí si tu backend lo acepta
                };

                const init_point = await createMPPreference(orderData);

                if (init_point) {
                    window.location.href = init_point;
                } else {
                    console.error("No se pudo obtener el init_point");
                }
            } catch (error) {
                console.error("Error al iniciar el checkout:", error);
            }
        };

        if (!hasInitiated && cart.length > 0 && shipping) {
            setHasInitiated(true);
            startCheckout();
        }
    }, [cart, shipping, hasInitiated]);

    return (
        <div className="text-center text-sm text-gray-500">
            Iniciando el checkout...
        </div>
    );
}
