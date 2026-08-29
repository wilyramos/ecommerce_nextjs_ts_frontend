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
import { H4, P, Small, Price, BadgeText } from '@/components/ui/TypographyStore'

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
            <div className="space-y-4 text-foreground">
                <ul className="divide-y divide-border">
                    {cart.map(item => (
                        <OrderSummaryItem
                            key={`${item._id}-${item.variant?._id ?? 'base'}`}
                            item={item}
                        />
                    ))}
                </ul>

                <div className="pt-4 border-t border-border space-y-2">
                    <div className="flex justify-between items-center">
                        <P className="text-muted-foreground">Subtotal</P>
                        <Price>S/ {subtotal.toFixed(2)}</Price>
                    </div>

                    {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-foreground">
                            <span className="flex items-center gap-1.5 truncate pr-2">
                                <BiSolidCoupon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                                <P className="truncate font-medium">Descuento ({discountCode})</P>
                            </span>
                            <Price className="shrink-0">-S/ {discountAmount.toFixed(2)}</Price>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <P className="text-muted-foreground">Envío</P>
                        {!isFreeShipping ? (
                            <Price>S/ {shippingCost.toFixed(2)}</Price>
                        ) : (
                            <BadgeText className="bg-foreground text-background px-1.5 py-0.5">
                                Gratis
                            </BadgeText>
                        )}
                    </div>

                    <div className="flex justify-between items-baseline pt-4 border-t border-border">
                        <H4 className="text-foreground">Total</H4>
                        <div className="flex items-baseline gap-1">
                            <Small className="text-[10px]">PEN</Small>
                            <Price className="text-lg font-semibold">
                                S/ {totalPrice.toFixed(2)}
                            </Price>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const isFreeShippingByCoupon = appliedDiscount?.isFreeShipping ?? false
    const shippingCost = isFreeShippingByCoupon ? 0 : (total < 49 ? 10 : 0)

    const discountAmount = appliedDiscount?.discountAmount ?? 0
    const discountDisplayName = appliedDiscount?.code.startsWith("AUTO-")
        ? appliedDiscount.code.replace("AUTO-", "")
        : appliedDiscount?.code

    const totalFinal = Math.max(0, total + shippingCost - discountAmount)

    if (cart.length === 0) return null

    return (
        <div className="space-y-4 text-foreground">
            <AutomaticDiscountEvaluator />

            <ul className="divide-y divide-border">
                {cart.map(item => (
                    <OrderSummaryItem
                        key={`${item._id}-${item.variant?._id ?? 'base'}`}
                        item={item}
                    />
                ))}
            </ul>

            <div className="py-2 border-t border-b border-border">
                <CouponInput />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <P className="text-muted-foreground">Subtotal</P>
                    <Price>S/ {total.toFixed(2)}</Price>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-foreground">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                            <BiSolidCoupon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                            <P className="truncate font-medium">Descuento ({discountDisplayName})</P>
                        </span>
                        <Price className="shrink-0">-S/ {discountAmount.toFixed(2)}</Price>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <P className="text-muted-foreground">Envío</P>
                    {shippingCost > 0 ? (
                        <Price>S/ {shippingCost.toFixed(2)}</Price>
                    ) : (
                        <BadgeText className="bg-foreground text-background px-1.5 py-0.5">
                            Gratis
                        </BadgeText>
                    )}
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-border">
                    <H4 className="text-foreground">Total</H4>
                    <Price className="text-lg font-semibold">
                        S/ {totalFinal.toFixed(2)}
                    </Price>
                </div>
            </div>
        </div>
    )
}