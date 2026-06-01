// File: src/store/checkoutStoreV2.ts

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { CustomerProfile, ShippingAddress } from '@/src/schemas/order.schema';

interface CheckoutStoreV2 {
    customerProfile: CustomerProfile | null;
    shippingAddress: ShippingAddress | null;
    orderId: string | null;
    orderNumber: string | null;

    setCustomerProfile: (profile: CustomerProfile) => void;
    setShippingAddress: (address: ShippingAddress) => void;
    setOrder: (orderId: string, orderNumber: string) => void;
    resetCheckout: () => void;
}

export const useCheckoutStoreV2 = create<CheckoutStoreV2>()(
    devtools(
        persist(
            (set) => ({
                customerProfile: null,
                shippingAddress: null,
                orderId: null,
                orderNumber: null,

                setCustomerProfile: (profile) => set({ customerProfile: profile }),
                setShippingAddress:  (address) => set({ shippingAddress: address }),
                setOrder: (orderId, orderNumber) => set({ orderId, orderNumber }),
                resetCheckout: () => set({
                    customerProfile: null,
                    shippingAddress:  null,
                    orderId:          null,
                    orderNumber:      null,
                }),
            }),
            { name: 'checkout-v2-storage' }
        )
    )
);