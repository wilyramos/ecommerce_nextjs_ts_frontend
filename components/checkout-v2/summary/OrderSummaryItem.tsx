//File: frontend/components/checkout-v2/summary/OrderSummaryItem.tsx

'use client'

import Image from 'next/image'
import type { CartItem } from '@/src/schemas'
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2'
import { MdOutlineImageNotSupported } from 'react-icons/md'
import { P } from '@/components/ui/TypographyV3'

interface Props {
    item: CartItem
}

export default function OrderSummaryItem({ item }: Props) {
    const { appliedDiscount } = useCheckoutStoreV2()

    const unitPrice = item.variant?.precio ?? item.precio ?? 0
    const grossSubtotal = unitPrice * item.cantidad
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0]

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
        ? Object.values(item.variant.atributos).join(' / ')
        : null

    return (
        <li className="flex items-center gap-3 py-3 text-xs">
            {/* Contenedor Imagen con Badge en la Esquina Superior Derecha */}
            <div className="relative w-14 h-14 bg-surface-primary border border-border-primary rounded-radius-md shrink-0 flex items-center justify-center overflow-visible">
                <div className="relative w-full h-full rounded-radius-md overflow-hidden bg-surface-secondary">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={item.nombre}
                            fill
                            className="object-contain p-1"
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-disabled">
                            <MdOutlineImageNotSupported size={18} />
                        </div>
                    )}
                </div>

                {/* Badge de cantidad */}
                <span className="absolute -top-2 -right-2 bg-text-secondary text-text-inverse text-[10px] font-medium w-4 h-4 rounded-radius-full flex items-center justify-center rounded-full border border-border-primary">
                    {item.cantidad}
                </span>
            </div>

            {/* Detalle Producto */}
            <div className="flex-1 min-w-0 leading-tight space-y-0.5">
                <P className="font-medium text-text-primary truncate">{item.nombre}</P>
                {atributos && (
                    <P className="text-[11px] text-text-secondary truncate">{atributos}</P>
                )}
                {isFree && (
                    <span className="inline-block text-[10px] font-medium text-text-primary bg-surface-secondary px-1.5 py-0.5 rounded-radius-sm">
                        Regalo
                    </span>
                )}
            </div>

            {/* Precios */}
            <div className="text-right shrink-0">
                {hasDiscount && (
                    <span className="block text-[10px] text-text-tertiary line-through">
                        S/ {grossSubtotal.toFixed(2)}
                    </span>
                )}
                {isFree ? (
                    <span className="text-xs font-semibold text-text-primary">
                        GRATIS
                    </span>
                ) : (
                    <span className="text-xs font-medium text-text-primary">
                        S/ {netSubtotal.toFixed(2)}
                    </span>
                )}
            </div>
        </li>
    )
}