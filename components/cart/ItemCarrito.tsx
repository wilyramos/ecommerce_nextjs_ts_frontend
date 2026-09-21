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
    <div className="flex gap-3.5 border-b border-border-primary/50 py-4.5 last:border-b-0 select-none">
      {/* Imagen miniatura */}
      <Link
        href={`/productos/${item.slug}`}
        className="relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-radius-md border border-border-primary/60 bg-surface-secondary/40 p-1.5 transition-opacity duration-fast hover:opacity-90"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={item.variant?.nombre ?? item.nombre}
            fill
            className="object-contain p-1"
            quality={75}
            sizes="72px"
            unoptimized
          />
        ) : (
          <MdOutlineImageNotSupported className="text-text-disabled" size={22} />
        )}
      </Link>

      {/* Contenido descriptivo y controles */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2.5">
        {/* Nombre completo y badge de regalo */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/productos/${item.slug}`}
              className="block text-xs font-semibold leading-snug break-words text-text-primary transition-colors duration-fast hover:text-brand-accent hover:underline"
            >
              {item.nombre}
            </Link>

            {atributos && (
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-text-tertiary">
                {atributos}
              </p>
            )}
          </div>

          {isFree && (
            <span className="shrink-0 rounded-full bg-brand-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-inverse">
              Regalo
            </span>
          )}
        </div>

        {/* Fila inferior: stepper y precio */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
          {/* Selector de cantidad compacto */}
          <div className="flex h-7 items-center overflow-hidden rounded-full border border-border-primary bg-surface-primary shadow-xs">
            <button
              type="button"
              onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
              disabled={item.cantidad <= 1}
              aria-label="Disminuir cantidad"
              className="flex size-7 items-center justify-center text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <Minus size={11} strokeWidth={2.5} />
            </button>
            <span className="flex min-w-[26px] items-center justify-center  text-xs font-semibold tabular-nums text-text-primary">
              {item.cantidad}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
              disabled={item.cantidad >= stockMax}
              aria-label="Aumentar cantidad"
              className="flex size-7 items-center justify-center text-text-secondary transition-colors duration-fast hover:bg-surface-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <Plus size={11} strokeWidth={2.5} />
            </button>
          </div>

          {/* Bloque de precios y botón eliminar */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end leading-none">
              {hasDiscount && (
                <span className=" text-[10px] text-text-tertiary line-through decoration-text-tertiary/50">
                  S/ {grossSubtotal.toFixed(2)}
                </span>
              )}

              {isFree ? (
                <span className="text-xs font-bold uppercase tracking-wider text-status-success">
                  GRATIS
                </span>
              ) : (
                <span className=" text-xs font-bold tabular-nums tracking-tight text-brand-primary">
                  S/ {netSubtotal.toFixed(2)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => removeFromCart(productId, variantId)}
              aria-label={`Eliminar ${item.nombre}`}
              className="flex size-7 items-center justify-center rounded-full text-text-tertiary transition-colors duration-fast hover:bg-status-error/10 hover:text-status-error active:scale-95"
            >
              <Trash2 size={13} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}