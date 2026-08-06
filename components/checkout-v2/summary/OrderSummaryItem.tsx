// File: frontend/components/checkout-v2/summary/OrderSummaryItem.tsx

'use client'

import Image from 'next/image'
import type { CartItem } from '@/src/schemas'
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import { MdOutlineImageNotSupported } from 'react-icons/md'

interface Props {
    item: CartItem
}

export default function OrderSummaryItem({ item }: Props) {
    const { appliedDiscount } = useCheckoutStoreV2()

    const unitPrice = item.variant?.precio ?? item.precio ?? 0
    const grossSubtotal = unitPrice * item.cantidad
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0]

    // Obtener descuento del ítem asignado en la evaluación de promociones
    const itemDiscount = appliedDiscount?.itemDiscounts?.find((d) => {
        if (item.variant?._id) {
            return d.productId === item._id && d.variantId === item.variant._id
        }
        return d.productId === item._id
    })?.discountAmount ?? 0

    const netSubtotal = Math.max(0, grossSubtotal - itemDiscount)
    const isFree = grossSubtotal > 0 && netSubtotal === 0
    const hasDiscount = itemDiscount > 0

    const atributos = item.variant?.atributos
        ? Object.values(item.variant.atributos).join(' · ')
        : null

    return (
        <li className="flex items-center gap-3 text-xs select-none py-1">
            {/* Imagen del Producto con Contador Badge B&N */}
            <div className="relative w-12 h-12 border border-border bg-background-secondary shrink-0 overflow-hidden rounded-none">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={item.nombre}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/60">
                        <MdOutlineImageNotSupported size={18} />
                    </div>
                )}
                <span className="absolute -top-1 -right-1 bg-foreground text-background text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-background">
                    {item.cantidad}
                </span>
            </div>

            {/* Información del Producto */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate text-xs">{item.nombre}</p>
                    {isFree && (
                        <span className="text-[9px] font-bold uppercase tracking-widest bg-foreground text-background px-1.5 py-0.5 border border-foreground shrink-0">
                            Regalo
                        </span>
                    )}
                </div>
                {atributos && (
                    <p className="text-[11px] text-muted-foreground truncate">{atributos}</p>
                )}
            </div>

            {/* Desglose de Precios */}
            <div className="text-right shrink-0 flex flex-col items-end leading-tight">
                {hasDiscount && (
                    <span className="text-[10px] text-muted-foreground line-through decoration-muted-foreground/50">
                        S/ {grossSubtotal.toFixed(2)}
                    </span>
                )}

                {isFree ? (
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                        GRATIS
                    </span>
                ) : (
                    <span className="text-xs font-bold text-foreground">
                        S/ {netSubtotal.toFixed(2)}
                    </span>
                )}
            </div>
        </li>
    )
}