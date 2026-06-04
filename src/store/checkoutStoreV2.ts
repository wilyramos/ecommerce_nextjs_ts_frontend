// File: src/store/checkoutStoreV2.ts

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
    CustomerProfile,
    ShippingAddress,
    OrderResponse,
} from '@/src/schemas/order.schema'

// ─── Slice de la orden pendiente ──────────────────────────────────────────────
// Solo los campos necesarios para el paso 2 (pasarela de pago).
// No se persiste el objeto completo para evitar datos obsoletos en localStorage.

type PendingOrder = Pick<
    OrderResponse,
    '_id' | 'orderNumber' | 'subtotal' | 'shippingCost' | 'totalPrice' | 'currency' | 'status'
>

// ─── Estado del store ─────────────────────────────────────────────────────────

interface CheckoutStoreV2 {
    customerProfile: CustomerProfile | null
    shippingAddress: ShippingAddress | null
    notes:           string
    pendingOrder:    PendingOrder | null

    // ── Setters ───────────────────────────────────────────────────────────────
    setCustomerProfile: (profile: CustomerProfile) => void
    setShippingAddress: (address: ShippingAddress) => void
    setNotes:           (notes: string)            => void
    setPendingOrder:    (order: PendingOrder)       => void

    // ── Selectores derivados ──────────────────────────────────────────────────
    /** true cuando el paso 1 está completo y se puede avanzar al paso 2 */
    isStepOneComplete: () => boolean

    // ── Reset ─────────────────────────────────────────────────────────────────
    resetCheckout: () => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCheckoutStoreV2 = create<CheckoutStoreV2>()(
    devtools(
        persist(
            (set, get) => ({
                customerProfile: null,
                shippingAddress: null,
                notes:           '',
                pendingOrder:    null,

                setCustomerProfile: (profile) =>
                    set({ customerProfile: profile }, false, 'checkout/setCustomerProfile'),

                setShippingAddress: (address) =>
                    set({ shippingAddress: address }, false, 'checkout/setShippingAddress'),

                setNotes: (notes) =>
                    set({ notes }, false, 'checkout/setNotes'),

                setPendingOrder: (order) =>
                    set({ pendingOrder: order }, false, 'checkout/setPendingOrder'),

                isStepOneComplete: () => {
                    const { customerProfile, shippingAddress } = get()
                    return customerProfile !== null && shippingAddress !== null
                },

                resetCheckout: () =>
                    set(
                        { customerProfile: null, shippingAddress: null, notes: '', pendingOrder: null },
                        false,
                        'checkout/reset'
                    ),
            }),
            { name: 'checkout-v2-storage' }
        ),
        { name: 'CheckoutStoreV2' }
    )
)