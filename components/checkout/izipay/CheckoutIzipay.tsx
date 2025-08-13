"use client";

import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStore } from "@/src/store/checkoutStore";
// import { useCulqi } from "@/hooks/useCulqi";
import ScriptIzipay from "./ScriptIzipay";

export default function CheckoutIzipay() {
    const { cart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();
    
    if (!cart?.length) {
        return <p className="text-gray-400 text-sm text-center mt-6">Tu carrito está vacío.</p>;
    }

    if (!shipping || !profile) {
        return <p className="text-gray-400 text-sm text-center mt-6">Completa tu información de envío y perfil antes de continuar.</p>;
    }

    return (
        <div className="flex flex-col items-center gap-6 mt-8 w-full">
            <h3 className="text-sm text-gray-500">Elige tu método de pago con izipay</h3>
            <div>
                <ScriptIzipay />
            </div>
        </div>
    );
}
