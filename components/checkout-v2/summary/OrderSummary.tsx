// File: frontend/components/checkout-v2/summary/OrderSummary.tsx

'use client'

import { usePathname } from 'next/navigation'
import { useCartStore } from '@/src/store/cartStore'
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import OrderSummaryItem from './OrderSummaryItem'
import CouponInput from './CouponInput'
import AutomaticDiscountEvaluator from './AutomaticDiscountEvaluator'
import type { OrderResponse } from '@/src/schemas/order.schema'
import { BiSolidCoupon } from 'react-icons/bi'

interface Props {
    order?: Pick<OrderResponse, 'orderNumber' | 'subtotal' | 'shippingCost' | 'discountCode' | 'discountAmount' | 'totalPrice'>
    isReadOnly?: boolean
}

export default function OrderSummary({ order, isReadOnly = false }: Props) {
    const pathname = usePathname()
    const { cart, total } = useCartStore()
    const { appliedDiscount, pendingOrder } = useCheckoutStoreV2()

    const isPaymentRoute = pathname.includes('/payment') || pathname.includes('/pago')
    const isLocked = isPaymentRoute || isReadOnly || Boolean(order)

    // ── CASO A: MODO SOLO LECTURA (Paso 2: /checkout/payment) ──
    if (isLocked) {
        const activeOrder = order || pendingOrder

        const subtotal = activeOrder?.subtotal ?? total
        const rawDiscountCode = activeOrder && 'discountCode' in activeOrder ? activeOrder.discountCode : appliedDiscount?.code
        const discountCode = rawDiscountCode?.replace(/^AUTO-/, '')
        const discountAmount = activeOrder && 'discountAmount' in activeOrder ? (activeOrder.discountAmount ?? 0) : (appliedDiscount?.discountAmount ?? 0)

        const shippingCost = activeOrder?.shippingCost ?? (total < 49 ? 10 : 0)
        const isFreeShipping = shippingCost === 0

        const totalPrice = activeOrder?.totalPrice ?? Math.max(0, subtotal + shippingCost - discountAmount)

        return (
            <div className="text-foreground select-none">
                <div className="flex items-center justify-between mb-5 border-b border-border/60 pb-3">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Resumen del pedido
                    </h2>

                </div>

                <ul className="space-y-3 mb-6">
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
                        <span className="font-semibold text-foreground">S/ {subtotal.toFixed(2)}</span>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex justify-between text-xs text-foreground font-medium">
                            <span className="flex items-center gap-1">
                                <BiSolidCoupon className="w-3.5 h-3.5 text-foreground shrink-0" />
                                <span>Descuento ({discountCode})</span>
                            </span>
                            <span className="font-bold">-S/ {discountAmount.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Envío</span>
                        {!isFreeShipping ? (
                            <span className="font-semibold text-foreground">S/ {shippingCost.toFixed(2)}</span>
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground bg-background-secondary border border-border px-2 py-0.5">
                                {discountCode ? "Gratis (Promoción)" : "Gratis"}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-baseline pt-3 border-t border-border">
                        <span className="text-sm font-bold uppercase tracking-wider text-foreground">Total</span>
                        <div className="text-right">
                            <span className="text-xl font-black text-foreground">
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

    const isFreeShippingByCoupon = appliedDiscount?.isFreeShipping ?? false
    const shippingCost = isFreeShippingByCoupon ? 0 : (total < 49 ? 10 : 0)

    const discountAmount = appliedDiscount?.discountAmount ?? 0
    const discountDisplayName = appliedDiscount?.code.startsWith("AUTO-")
        ? appliedDiscount.code.replace("AUTO-", "")
        : appliedDiscount?.code

    const totalFinal = Math.max(0, total + shippingCost - discountAmount)

    if (cart.length === 0) return null

    return (
        <div className="text-foreground select-none">
            {/* Evaluación en tiempo real para promociones automáticas */}
            <AutomaticDiscountEvaluator />

            <div className="flex items-center justify-between mb-5 border-b border-border/60 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Resumen del pedido
                </h2>
                <span className="text-[11px] font-medium text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </span>
            </div>

            <ul className="space-y-3 mb-6">
                {cart.map(item => (
                    <OrderSummaryItem
                        key={`${item._id}-${item.variant?._id ?? 'base'}`}
                        item={item}
                    />
                ))}
            </ul>

            <div className="border-t border-border" />

            {/* Input para Cupones Manuales */}
            <div className="py-4 border-b border-border">
                <CouponInput />
            </div>

            <div className="pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">S/ {total.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-foreground font-medium">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                            <BiSolidCoupon className="w-3.5 h-3.5 text-foreground shrink-0" />
                            <span className="truncate">Descuento ({discountDisplayName})</span>
                        </span>
                        <span className="shrink-0 font-bold">-S/ {discountAmount.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Envío</span>
                    {shippingCost > 0 ? (
                        <span className="font-semibold text-foreground">S/ {shippingCost.toFixed(2)}</span>
                    ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground bg-background-secondary border border-border px-2 py-0.5">
                            {isFreeShippingByCoupon ? "Gratis (Promoción)" : "Gratis"}
                        </span>
                    )}
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-border">
                    <span className="text-sm font-bold uppercase tracking-wider text-foreground">Total</span>
                    <div className="text-right">
                        <span className="text-xl font-black text-foreground">
                            S/ {totalFinal.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}