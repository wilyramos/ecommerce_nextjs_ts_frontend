// File: frontend/components/cart/ItemCarrito.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";
import { MdOutlineImageNotSupported } from "react-icons/md";

interface ItemCarritoProps {
    item: CartItem;
    discountAmount?: number;
}

export default function ItemCarrito({ item, discountAmount = 0 }: ItemCarritoProps) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const productId = item._id;
    const variantId = item.variant?._id;
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
    const price = item.variant?.precio ?? item.precio ?? 0;
    const grossSubtotal = price * item.cantidad;
    const stockMax = item.variant?.stock ?? item.stock ?? 0;

    const netSubtotal = Math.max(0, grossSubtotal - discountAmount);
    const isFree = grossSubtotal > 0 && netSubtotal === 0;
    const hasDiscount = discountAmount > 0;

    const atributos = item.variant?.atributos
        ? Object.values(item.variant.atributos).join(" · ")
        : null;

    return (
        <div className="flex flex-col py-3 gap-2 border-b border-border/60 last:border-b-0 select-none">
            {/* Header del ítem */}
            <div className="flex items-center justify-between gap-2">
                <Link
                    href={`/productos/${item.slug}`}
                    className="text-xs font-semibold leading-tight text-foreground hover:underline truncate"
                >
                    {item.nombre}
                </Link>

                {isFree && (
                    <span className="text-[9px] font-bold uppercase tracking-widest bg-foreground text-background px-2 py-0.5 border border-foreground shrink-0">
                        Regalo
                    </span>
                )}
            </div>

            <div className="flex gap-3 items-center">
                {/* Imagen */}
                <Link
                    href={`/productos/${item.slug}`}
                    className="relative w-14 h-14 flex-shrink-0 border border-border bg-background-secondary block overflow-hidden rounded-none"
                >
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={item.variant?.nombre ?? item.nombre}
                            fill
                            className="object-cover"
                            quality={60}
                            unoptimized
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            <MdOutlineImageNotSupported size={16} />
                        </div>
                    )}
                </Link>

                {/* Info y Controles */}
                <div className="flex flex-col flex-1 min-w-0 gap-1.5">
                    {atributos && (
                        <p className="text-[11px] text-muted-foreground truncate">
                            {atributos}
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-1">
                        {/* Control de Cantidad (Estilo Fino B&N) */}
                        <div className="flex items-center border border-border">
                            <button
                                onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
                                disabled={item.cantidad <= 1}
                                className="w-6 h-6 flex items-center justify-center bg-background text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background-secondary transition-colors"
                            >
                                <Minus size={9} strokeWidth={2.5} />
                            </button>
                            <span className="text-xs font-semibold text-foreground tabular-nums min-w-[20px] text-center">
                                {item.cantidad}
                            </span>
                            <button
                                onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
                                disabled={item.cantidad >= stockMax}
                                className="w-6 h-6 flex items-center justify-center bg-background text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:bg-background-secondary transition-colors"
                            >
                                <Plus size={9} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Precios (Tachado en Gris + Gratis/Neto Monocromático) */}
                        <div className="flex items-center gap-2">
                            {hasDiscount && (
                                <span className="text-[11px] text-muted-foreground line-through decoration-muted-foreground/50">
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

                            <button
                                onClick={() => removeFromCart(productId, variantId)}
                                aria-label={`Eliminar ${item.nombre}`}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors ml-1"
                            >
                                <Trash2 size={13} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}