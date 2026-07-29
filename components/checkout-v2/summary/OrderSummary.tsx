// File: frontend/components/checkout-v2/summary/OrderSummary.tsx
'use client'

import { usePathname } from 'next/navigation'
import { useCartStore } from '@/src/store/cartStore'
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import OrderSummaryItem from './OrderSummaryItem'
import CouponInput from './CouponInput'
import type { OrderResponse } from '@/src/schemas/order.schema'

interface Props {
    order?: Pick<OrderResponse, 'orderNumber' | 'subtotal' | 'shippingCost' | 'discountCode' | 'discountAmount' | 'totalPrice'>
    isReadOnly?: boolean
}

export default function OrderSummary({ order, isReadOnly = false }: Props) {
    const pathname = usePathname()
    const { cart, total } = useCartStore()
    const { appliedDiscount, pendingOrder } = useCheckoutStoreV2()

    // 1. Identificamos estricta y únicamente si estamos en la vista de pago
    const isPaymentRoute = pathname.includes('/payment') || pathname.includes('/pago')

    // 2. Solo se bloquea si estamos en la ruta de pago O si explícitamente se pasa la prop isReadOnly/order
    const isLocked = isPaymentRoute || isReadOnly || Boolean(order)

    // ── CASO A: MODO SOLO LECTURA (Paso 2: /checkout/payment) ──
    if (isLocked) {
        const activeOrder = order || pendingOrder

        const subtotal = activeOrder?.subtotal ?? total
        const shippingCost = activeOrder?.shippingCost ?? (total < 49 ? 10 : 0)
        const discountCode = activeOrder && 'discountCode' in activeOrder ? activeOrder.discountCode : appliedDiscount?.code
        const discountAmount = activeOrder && 'discountAmount' in activeOrder ? (activeOrder.discountAmount ?? 0) : (appliedDiscount?.discountAmount ?? 0)
        const totalPrice = activeOrder?.totalPrice ?? Math.max(0, subtotal + shippingCost - discountAmount)

        return (
            <div className="text-foreground">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                        Resumen del pedido

                    </h2>

                </div>

                <ul className="space-y-4 mb-6 opacity-90">
                    {cart.map(item => (
                        <OrderSummaryItem
                            key={`${item._id}-${item.variant?._id ?? 'base'}`}
                            item={item}
                        />
                    ))}
                </ul>

                <div className="border-t border-border" />

                <div className="pt-4 space-y-2.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Subtotal</span>
                        <span>S/ {subtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex justify-between text-xs text-success font-medium">
                            <span>Descuento ({discountCode})</span>
                            <span>-S/ {discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Envío</span>
                        {shippingCost > 0 ? (
                            <span>S/ {shippingCost.toFixed(2)}</span>
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-action-cta">
                                Gratis
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-baseline pt-3 border-t border-border">
                        <span className="text-sm font-bold text-foreground">Total</span>
                        <div className="text-right">
                            <span className="text-lg font-black text-foreground">
                                S/ {totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── CASO B: MODO EDITABLE (Paso 1: /checkout) ──
    const totalItems = cart.reduce((acc, i) => acc + i.cantidad, 0)
    const shippingCost = total < 49 ? 10 : 0
    const discountAmount = appliedDiscount?.discountAmount ?? 0
    const totalFinal = Math.max(0, total + shippingCost - discountAmount)

    if (cart.length === 0) return null

    return (
        <div className="text-foreground">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                    Resumen del pedido
                </h2>
                <span className="text-[11px] text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </span>
            </div>

            <ul className="space-y-4 mb-6">
                {cart.map(item => (
                    <OrderSummaryItem
                        key={`${item._id}-${item.variant?._id ?? 'base'}`}
                        item={item}
                    />
                ))}
            </ul>

            <div className="border-t border-border" />

            {/* Formulario de Cupón totalmente editable */}
            <div className="py-4 border-b border-border">
                <CouponInput />
            </div>

            <div className="pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>S/ {total.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-success font-medium">
                        <span>Descuento ({appliedDiscount?.code})</span>
                        <span>-S/ {discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Envío</span>
                    {shippingCost > 0 ? (
                        <span>S/ {shippingCost.toFixed(2)}</span>
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-action-cta">
                            Gratis
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-border">
                    <span className="text-sm font-bold text-foreground">Total</span>
                    <div className="text-right">
                        <span className="text-lg font-black text-foreground">
                            S/ {totalFinal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}