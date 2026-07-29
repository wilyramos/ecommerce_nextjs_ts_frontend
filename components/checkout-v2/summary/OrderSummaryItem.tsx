import Image from 'next/image'
import type { CartItem } from '@/src/schemas'

type Props = {
    item: CartItem
}

export default function OrderSummaryItem({ item }: Props) {
    const imagen = item.imagenes?.[0]

    return (
        <li className="flex items-center gap-3 py-2">
            {/* Contenedor Imagen con Badge */}
            <div className="relative w-12 h-12 rounded-[var(--radius-sm)] border border-border bg-background shrink-0 overflow-visible">
                <div className="w-full h-full rounded-[var(--radius-sm)] overflow-hidden relative">
                    {imagen ? (
                        <Image
                            src={imagen}
                            alt={item.nombre}
                            fill
                            sizes="48px"
                            className="object-cover"
                            quality={60}
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-muted-neutral" />
                    )}
                </div>
                {/* Badge de Cantidad */}
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center shadow-sm">
                    {item.cantidad}
                </span>
            </div>

            {/* Información del Producto */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground leading-tight truncate">
                    {item.nombre}
                </p>
                {item.variant?.nombre && (
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {item.variant.nombre}
                    </p>
                )}
            </div>

            {/* Precio */}
            <div className="flex items-center shrink-0">
                <span className="text-xs font-semibold text-foreground">
                    S/ {(item.precio * item.cantidad).toFixed(2)}
                </span>
            </div>
        </li>
    )
}