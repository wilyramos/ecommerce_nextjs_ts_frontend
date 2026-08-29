// File: frontend/components/home/product/ProductCardHome.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductResponse } from "@/src/schemas";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { H4, Small } from "@/components/ui/TypographyStore";

export default function ProductCardHome({ product }: { product: ProductResponse }) {
    const img1 = product.imagenes?.[0];
    const img2 = product.imagenes?.[1] || img1;

    const price = Number(product.precio) || 0;
    const compare = Number(product.precioComparativo) || 0;
    const discount = compare > price;

    const discountedPercentage = discount
        ? Math.round(((compare - price) / compare) * 100)
        : 0;

    return (
        <Link
            href={`/productos/${product.slug}`}
            className="group relative flex flex-col w-full bg-background overflow-hidden border border-border/30"
        >
            {/* --- CONTENEDOR CUADRADO EXACTO (ASPECT SQUARE) --- */}
            <div className="relative w-full aspect-square bg-[#fdfdfd] overflow-hidden flex items-center justify-center">
                {/* Badge de Descuento Minimalista */}
                {discount && (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span className="px-2 py-1 bg-neutral-900 text-white text-[10px] font-bold tracking-widest uppercase rounded-[2px] shadow-sm">
                            -{discountedPercentage}%
                        </span>
                    </div>
                )}

                {img1 ? (
                    <div className="relative w-full h-full p-4 md:p-6 transition-transform duration-700 ease-out group-hover:scale-105">
                        <Image
                            src={img1}
                            alt={product.nombre || "Producto"}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className={`object-contain mix-blend-multiply transition-opacity duration-500 ${
                                img2 !== img1 ? "opacity-100 group-hover:opacity-0" : ""
                            }`}
                            quality={85}
                            unoptimized
                        />

                        {img2 !== img1 && (
                            <Image
                                src={img2 || img1}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="absolute inset-0 object-contain p-4 md:p-6 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                quality={85}
                                unoptimized
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground/40 bg-neutral-50">
                        <MdOutlineImageNotSupported size={28} />
                    </div>
                )}

                {/* Overlay sutil de luminosidad */}
                <div className="absolute inset-0 bg-neutral-900/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* --- BLOQUE DE INFORMACIÓN --- */}
            <div className="flex flex-col flex-1 p-3.5 bg-background border-t border-border/20">
                {/* Nombre con componente tipográfico H4 normalizado */}
                <H4 className="normal-case tracking-normal text-foreground/90 line-clamp-2 min-h-[2.5rem] font-normal">
                    {product.nombre}
                </H4>

                {/* Precios Limpios alineados horizontalmente al fondo */}
                <div className="flex items-center gap-2 mt-auto pt-3">
                    <span className="text-sm font-semibold tracking-wide text-foreground">
                        S/{" "}
                        {price.toLocaleString("es-PE", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>

                    {discount && (
                        <Small className="line-through text-muted-foreground/70 tracking-wide font-light">
                            S/{" "}
                            {compare.toLocaleString("es-PE", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </Small>
                    )}
                </div>
            </div>
        </Link>
    );
}