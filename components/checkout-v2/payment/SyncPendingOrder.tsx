// File: frontend/components/checkout-v2/payment/SyncPendingOrder.tsx
"use client";

import { useEffect } from "react";
import { useCheckoutStoreV2 } from "@/src/store/checkoutStoreV2";
import type { OrderResponse } from "@/src/schemas/order.schema";

interface Props {
    order: OrderResponse;
}

export default function SyncPendingOrder({ order }: Props) {
    const { setPendingOrder, setAppliedDiscount } = useCheckoutStoreV2();

    useEffect(() => {
        setPendingOrder({
            _id: order._id,
            orderNumber: order.orderNumber,
            subtotal: order.subtotal,
            shippingCost: order.shippingCost,
            totalPrice: order.totalPrice,
            currency: order.currency,
            status: order.status,
        });

        if (order.discountCode && order.discountAmount) {
            setAppliedDiscount({
                code: order.discountCode,
                discountAmount: order.discountAmount,
            });
        }
    }, [order, setPendingOrder, setAppliedDiscount]);

    return null;
}