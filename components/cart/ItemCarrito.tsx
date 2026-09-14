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
        <div className="flex flex-col gap-3 border-b border-border-primary/60 py-4 last:border-b-0 select-none">
            {/* Header del ítem */}
            <div className="flex items-center justify-between gap-2">
                <Link
                    href={`/productos/${item.slug}`}
                    className="truncate text-xs font-semibold leading-tight text-text-primary transition-colors duration-fast hover:text-brand-accent hover:underline"
                >
                    {item.nombre}
                </Link>

                {isFree && (
                    <span className="shrink-0 rounded-radius-sm bg-text-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-inverse">
                        Regalo
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Imagen */}
                <Link
                    href={`/productos/${item.slug}`}
                    className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-radius-md border border-border-primary/60 bg-surface-secondary/50 p-1"
                >
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={item.variant?.nombre ?? item.nombre}
                            fill
                            className="object-contain p-1"
                            quality={60}
                            sizes="64px"
                            unoptimized
                        />
                    ) : (
                        <MdOutlineImageNotSupported className="text-text-disabled" size={20} />
                    )}
                </Link>

                {/* Info y Controles */}
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    {atributos && (
                        <p className="truncate text-[10px] font-medium text-text-tertiary">
                            {atributos}
                        </p>
                    )}

                    <div className="mt-1 flex items-center justify-between">
                        {/* Control de Cantidad */}
                        <div className="flex h-7 items-center overflow-hidden rounded-radius-sm border border-border-primary/80 bg-surface-primary shadow-xs">
                            <button
                                type="button"
                                onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
                                disabled={item.cantidad <= 1}
                                className="flex size-7 items-center justify-center text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
                            >
                                <Minus size={10} strokeWidth={2.5} />
                            </button>
                            <span className="flex min-w-[24px] items-center justify-center text-xs font-semibold tabular-nums text-text-primary">
                                {item.cantidad}
                            </span>
                            <button
                                type="button"
                                onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
                                disabled={item.cantidad >= stockMax}
                                className="flex size-7 items-center justify-center text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
                            >
                                <Plus size={10} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Precios y Eliminar */}
                        <div className="flex items-center gap-2.5">
                            {hasDiscount && (
                                <span className="text-[10px] text-text-tertiary line-through decoration-text-tertiary/50">
                                    S/ {grossSubtotal.toFixed(2)}
                                </span>
                            )}

                            {isFree ? (
                                <span className="text-xs font-bold uppercase tracking-wider text-text-primary">
                                    GRATIS
                                </span>
                            ) : (
                                <span className="text-xs font-semibold tracking-tight text-text-primary">
                                    S/ {netSubtotal.toFixed(2)}
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() => removeFromCart(productId, variantId)}
                                aria-label={`Eliminar ${item.nombre}`}
                                className="ml-1 flex size-6 items-center justify-center rounded-radius-sm text-text-tertiary transition-colors duration-fast hover:bg-surface-secondary hover:text-status-error"
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