// File: frontend/src/store/checkoutStoreV2.ts

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
    CustomerProfile,
    ShippingAddress,
    OrderResponse,
} from '@/src/schemas/order.schema'

type PendingOrder = Pick<
    OrderResponse,
    '_id' | 'orderNumber' | 'subtotal' | 'shippingCost' | 'totalPrice' | 'currency' | 'status'
>

export interface AppliedDiscount {
    code: string
    discountAmount: number
}

interface CheckoutStoreV2 {
    customerProfile: CustomerProfile | null
    shippingAddress: ShippingAddress | null
    notes:           string
    pendingOrder:    PendingOrder | null
    appliedDiscount: AppliedDiscount | null

    // ── Setters ───────────────────────────────────────────────────────────────
    setCustomerProfile: (profile: CustomerProfile) => void
    setShippingAddress: (address: ShippingAddress) => void
    setNotes:           (notes: string)            => void
    setPendingOrder:    (order: PendingOrder)       => void
    setAppliedDiscount: (discount: AppliedDiscount | null) => void
    clearDiscount:      () => void

    isStepOneComplete: () => boolean
    resetCheckout:     () => void
}

export const useCheckoutStoreV2 = create<CheckoutStoreV2>()(
    devtools(
        persist(
            (set, get) => ({
                customerProfile: null,
                shippingAddress: null,
                notes:           '',
                pendingOrder:    null,
                appliedDiscount: null,

                setCustomerProfile: (profile) =>
                    set({ customerProfile: profile }, false, 'checkout/setCustomerProfile'),

                setShippingAddress: (address) =>
                    set({ shippingAddress: address }, false, 'checkout/setShippingAddress'),

                setNotes: (notes) =>
                    set({ notes }, false, 'checkout/setNotes'),

                setPendingOrder: (order) =>
                    set({ pendingOrder: order }, false, 'checkout/setPendingOrder'),

                setAppliedDiscount: (discount) =>
                    set({ appliedDiscount: discount }, false, 'checkout/setAppliedDiscount'),

                clearDiscount: () =>
                    set({ appliedDiscount: null }, false, 'checkout/clearDiscount'),

                isStepOneComplete: () => {
                    const { customerProfile, shippingAddress } = get()
                    return customerProfile !== null && shippingAddress !== null
                },

                resetCheckout: () =>
                    set(
                        { customerProfile: null, shippingAddress: null, notes: '', pendingOrder: null, appliedDiscount: null },
                        false,
                        'checkout/reset'
                    ),
            }),
            { name: 'checkout-v2-storage' }
        ),
        { name: 'CheckoutStoreV2' }
    )
)