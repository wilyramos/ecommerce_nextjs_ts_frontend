// File: frontend/components/ui/home/ProductResultSearch.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import type { TProductListSchema } from "@/src/schemas";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { H4, Small } from "@/components/ui/TypographyV3";

interface Props {
  item: TProductListSchema;
}

export default function ProductResultSearch({ item }: Props) {
  const precio = item.precio ?? 0;
  const imagen = item.imagenes?.[0];
  const tieneDescuento = (item.precioComparativo ?? 0) > precio;
  const marcaNombre =
    typeof item.brand === "object" && item.brand ? item.brand.nombre : "";

  return (
    <Link
      href={`/productos/${item.slug}`}
      className="group relative flex flex-col rounded-radius-lg border border-transparent p-2.5 transition-colors duration-fast hover:border-border-primary hover:bg-surface-secondary/70"
    >
      {/* Contenedor de Imagen con fondo de contraste suave Apple */}
      <div className="relative mb-2.5 aspect-square w-full overflow-hidden rounded-radius-md border border-border-primary/50 bg-surface-secondary">
        {imagen ? (
          <Image
            src={imagen}
            alt={item.nombre}
            unoptimized
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-contain p-2.5 transition-transform duration-normal group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-tertiary">
            <MdOutlineImageNotSupported size={22} />
          </div>
        )}

        {/* Badge de Oferta: Titanio / Contraste sobrio */}
        {tieneDescuento && (
          <div className="absolute left-1.5 top-1.5">
            <span className="inline-block rounded-radius-sm bg-surface-inverse px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-text-inverse">
              Oferta
            </span>
          </div>
        )}
      </div>

      {/* Información del Producto */}
      <div className="flex flex-1 flex-col gap-1">
        {marcaNombre && (
          <Small className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-text-tertiary">
            {marcaNombre}
          </Small>
        )}

        <H4 className="min-h-[2.5em] line-clamp-2 text-xs font-normal normal-case tracking-normal text-text-primary group-hover:text-brand-accent">
          {item.nombre}
        </H4>

        <div className="mt-auto flex items-baseline gap-1.5 pt-1">
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            S/ {precio.toFixed(2)}
          </span>

          {tieneDescuento && (
            <span className="text-[11px] font-normal text-text-tertiary line-through">
              S/ {item.precioComparativo?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}