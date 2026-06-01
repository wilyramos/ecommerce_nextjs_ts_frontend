// File: frontend/components/checkout-v2/summary/OrderSummaryItem.tsx

import Image from 'next/image'
import type { CartItem } from '@/src/schemas'

type Props = {
    item: CartItem
}

export default function OrderSummaryItem({ item }: Props) {
    const imagen = item.imagenes?.[0]

    return (
        <li className="flex gap-3 py-3">
            {/* Imagen */}
            <div className="relative w-14 h-14 rounded-[var(--radius-sm)] border border-border bg-muted shrink-0 overflow-hidden">
                {imagen ? (
                    <Image
                        src={imagen}
                        alt={item.nombre}
                        fill
                        sizes="56px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted-neutral" />
                )}
                {/* Badge cantidad */}
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center">
                    {item.cantidad}
                </span>
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                    {item.nombre}
                </p>
                {item.variant?.nombre && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variant.nombre}
                    </p>
                )}
            </div>

            {/* Precio */}
            <div className="flex items-center shrink-0">
                <span className="text-sm font-semibold text-foreground">
                    S/ {(item.precio * item.cantidad).toFixed(2)}
                </span>
            </div>
        </li>
    )
}