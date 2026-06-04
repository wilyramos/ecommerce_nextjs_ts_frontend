// File: frontend/components/checkout-v2/summary/OrderSummary.tsx

'use client'

import { useCartStore } from '@/src/store/cartStore'
import OrderSummaryItem from './OrderSummaryItem'

const SHIPPING_COST = 0 // Ajusta con tu lógica de tarifas

export default function OrderSummary() {
    const { cart, total } = useCartStore()

    const totalItems = cart.reduce((acc, i) => acc + i.cantidad, 0)
    const totalFinal = total + SHIPPING_COST

    if (cart.length === 0) return null

    return (
        <div className="bg-card p-5 text-card-foreground">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Resumen del pedido
            </h2>

            {/* Items */}
            <ul className="divide-y divide-border -mx-1 px-1">
                {cart.map(item => (
                    <OrderSummaryItem
                        key={`${item._id}-${item.variant?._id ?? 'base'}`}
                        item={item}
                    />
                ))}
            </ul>


            {/* Totales */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                    <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span>{SHIPPING_COST === 0 ? 'Gratis' : ``}</span>
                </div>
            </div>


            <div className="flex justify-between font-bold text-base text-foreground">
                <span>Total</span>
                <span>S/ {totalFinal.toFixed(2)}</span>
            </div>

        </div>
    )
}