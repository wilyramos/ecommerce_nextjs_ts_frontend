// File: frontend/components/checkout-v2/summary/AutomaticDiscountEvaluator.tsx

"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/src/store/cartStore";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import { evaluateAutomaticDiscountsAction } from "@/actions/discount-actions";

export default function AutomaticDiscountEvaluator() {
    const { cart, total } = useCartStore();
    const { appliedDiscount, setAppliedDiscount } = useCheckoutStoreV2();
    const isManualCoupon = useRef(false);
    const prevCartPayloadRef = useRef<string>("");

    useEffect(() => {
        if (appliedDiscount && !appliedDiscount.code.startsWith("AUTO-")) {
            isManualCoupon.current = true;
        } else if (!appliedDiscount) {
            isManualCoupon.current = false;
        }
    }, [appliedDiscount]);

    useEffect(() => {
        if (isManualCoupon.current || cart.length === 0) return;

        const cartItems = cart.map((item) => ({
            productId: item._id,
            variantId: item.variant?._id,
            quantity: item.cantidad,
            price: item.precio,
        }));

        const currentPayloadKey = JSON.stringify({ total, cartItems });
        if (prevCartPayloadRef.current === currentPayloadKey) {
            return;
        }

        let isMounted = true;

        const timer = setTimeout(async () => {
            const res = await evaluateAutomaticDiscountsAction(total, cartItems);

            if (!isMounted) return;

            prevCartPayloadRef.current = currentPayloadKey;

            if (res?.ok && res.data?.appliedDiscount && res.data.discountAmount > 0) {
                const autoDisc = res.data.appliedDiscount;
                setAppliedDiscount({
                    code: `AUTO-${autoDisc.title}`,
                    discountAmount: res.data.discountAmount,
                    isFreeShipping: autoDisc.type === "FREE_SHIPPING",
                    itemDiscounts: res.data.itemDiscounts,
                });
            } else if (!isManualCoupon.current) {
                setAppliedDiscount(null);
            }
        }, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [cart, total, setAppliedDiscount]);

    return null;
}