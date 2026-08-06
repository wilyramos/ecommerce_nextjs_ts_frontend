// File: frontend/components/checkout-v2/summary/AutomaticDiscountEvaluator.tsx

"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { evaluateAutomaticDiscountsAction, validateCouponAction } from "@/actions/discount-actions";

export default function AutomaticDiscountEvaluator() {
    const { cart, total } = useCartStore();
    const setAppliedDiscount = useCheckoutStoreV2((state) => state.setAppliedDiscount);
    
    const prevPayloadRef = useRef<string>("");

    useEffect(() => {
        // Leer el descuento actual directamente del store para no forzar re-renders del efecto
        const currentDiscount = useCheckoutStoreV2.getState().appliedDiscount;
        const isManual = currentDiscount && !currentDiscount.code.startsWith("AUTO-");
        const manualCode = isManual ? currentDiscount.code : null;

        // Limpiar descuentos si el carrito está vacío
        if (cart.length === 0) {
            if (currentDiscount) setAppliedDiscount(null);
            prevPayloadRef.current = "";
            return;
        }

        const cartItems = cart.map((item) => ({
            productId: item._id,
            variantId: item.variant?._id,
            quantity: item.cantidad,
            price: item.precio,
        }));

        // Firma única del estado del carrito + el código manual si existe
        const currentPayloadKey = JSON.stringify({ total, cartItems, manualCode });
        
        if (prevPayloadRef.current === currentPayloadKey) {
            return; // Evita llamadas redundantes si la estructura del carrito no ha cambiado
        }

        let isMounted = true;

        const timer = setTimeout(async () => {
            if (!isMounted) return;
            prevPayloadRef.current = currentPayloadKey;

            // ── Flujo 1: Si hay un cupón manual, validamos si sigue siendo elegible con el nuevo carrito
            if (isManual && manualCode) {
                const res = await validateCouponAction(manualCode, total, cartItems);
                if (!isMounted) return;

                if (res?.ok && res.data) {
                    setAppliedDiscount({
                        code: res.data.code || manualCode,
                        discountAmount: res.data.discountAmount,
                        isFreeShipping: res.data.isFreeShipping,
                    });
                } else {
                    // Si el cupón manual ya no cumple requisitos, lo removemos y buscamos ofertas automáticas de fallback
                    setAppliedDiscount(null);
                    const autoRes = await evaluateAutomaticDiscountsAction(total, cartItems);
                    
                    if (isMounted && autoRes?.ok && autoRes.data?.appliedDiscount && autoRes.data.discountAmount > 0) {
                        const autoDisc = autoRes.data.appliedDiscount;
                        setAppliedDiscount({
                            code: `AUTO-${autoDisc.title}`,
                            discountAmount: autoRes.data.discountAmount,
                            isFreeShipping: autoDisc.type === "FREE_SHIPPING",
                            itemDiscounts: autoRes.data.itemDiscounts,
                        });
                    }
                }
            } 
            // ── Flujo 2: Búsqueda tradicional de promociones automáticas
            else {
                const res = await evaluateAutomaticDiscountsAction(total, cartItems);
                if (!isMounted) return;

                if (res?.ok && res.data?.appliedDiscount && res.data.discountAmount > 0) {
                    const autoDisc = res.data.appliedDiscount;
                    setAppliedDiscount({
                        code: `AUTO-${autoDisc.title}`,
                        discountAmount: res.data.discountAmount,
                        isFreeShipping: autoDisc.type === "FREE_SHIPPING",
                        itemDiscounts: res.data.itemDiscounts,
                    });
                } else if (currentDiscount) {
                    setAppliedDiscount(null);
                }
            }
        }, 400);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [cart, total, setAppliedDiscount]);

    return null;
}