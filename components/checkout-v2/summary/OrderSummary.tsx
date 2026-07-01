'use client'

import { useCartStore } from '@/src/store/cartStore'
import OrderSummaryItem from './OrderSummaryItem'

export default function OrderSummary() {
    const { cart, total } = useCartStore()

    const totalItems = cart.reduce((acc, i) => acc + i.cantidad, 0)
    
    // Cálculo dinámico del envío: menor a 49 soles cuesta 10 soles, de lo contrario es gratis
    const shippingCost = total < 49 ? 10 : 0
    const totalFinal = total + shippingCost

    if (cart.length === 0) return null

    return (
        <div className="text-foreground">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
                    Resumen del pedido
                </h2>
                <span className="text-[11px] text-muted-foreground">
                    {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
                </span>
            </div>

            {/* Items */}
            <ul className="space-y-4 mb-6">
                {cart.map(item => (
                    <OrderSummaryItem
                        key={`${item._id}-${item.variant?._id ?? 'base'}`}
                        item={item}
                    />
                ))}
            </ul>

            {/* Separador */}
            <div className="border-t border-border" />

            {/* Cupón */}
            <div className="py-4 border-b border-border">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Código de descuento"
                        disabled
                        className="flex-1 h-9 px-3 text-xs bg-background border border-border rounded-[var(--radius-sm)] text-foreground placeholder:text-muted-foreground/50 disabled:opacity-40 disabled:cursor-not-allowed outline-none focus:ring-1 focus:ring-ring"
                    />
                    <button
                        disabled
                        className="h-9 px-4 text-xs font-semibold border border-border rounded-[var(--radius-sm)] text-muted-foreground disabled:opacity-40 disabled:cursor-not-allowed bg-background"
                    >
                        Aplicar
                    </button>
                </div>
            </div>

            {/* Totales */}
            <div className="pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>S/ {total.toFixed(2)}</span>
                </div>
                
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