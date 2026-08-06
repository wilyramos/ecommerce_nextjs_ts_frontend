// File: frontend/components/home/product/ProductAutomaticPromotionBanner.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { type DiscountResponse } from "@/src/schemas/discount.schema";

interface Props {
    discounts: (DiscountResponse & {
        giftProductsDetails?: Array<{
            _id: string;
            nombre: string;
            slug: string;
            imagenes?: string[];
            precio?: number;
        }>;
    })[];
}

export default function ProductAutomaticPromotionBanner({ discounts }: Props) {
    if (!discounts || discounts.length === 0) return null;

    return (
        <div className="space-y-2.5 my-3 select-none">
            {discounts.map((disc) => {
                const isBxgy = disc.type === "BUY_X_GET_Y";
                const isPercentage = disc.type === "PERCENTAGE";
                const isFixedAmount = disc.type === "FIXED_AMOUNT";
                const isFreeShipping = disc.type === "FREE_SHIPPING";

                const bxgy = disc.bxgyConfig;
                const giftProducts = disc.giftProductsDetails ?? [];

                return (
                    <div
                        key={disc._id}
                        className="p-3 border border-border bg-card rounded-md space-y-2.5"
                    >
                        {/* Cabecera de la promoción */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="text-xs font-bold text-foreground tracking-tight">
                                {disc.title}
                            </span>

                            <span className="text-[10px] font-bold uppercase tracking-wider text-action-cta bg-action-cta/10 px-2 py-0.5 rounded-sm border border-action-cta/20">
                                Promoción
                            </span>
                        </div>

                        {/* Detalle dinámico y claro de la oferta según su tipo */}
                        <div className="space-y-2 text-xs text-muted-foreground">
                            {isBxgy && bxgy ? (
                                <p className="leading-relaxed">
                                    Lleva <span className="font-bold text-foreground">{bxgy.buyQuantity} unidad(es)</span> y obtén{" "}
                                    <span className="font-bold text-foreground">
                                        {bxgy.getQuantity} {bxgy.getDiscountType === "FREE" ? "GRATIS" : `con ${bxgy.getDiscountValue}% de descuento`}
                                    </span>.
                                </p>
                            ) : isPercentage ? (
                                <p className="leading-relaxed">
                                    Obtén un <span className="font-bold text-foreground">{disc.value}% de descuento</span> aplicado automáticamente.
                                </p>
                            ) : isFixedAmount ? (
                                <p className="leading-relaxed">
                                    Descuento directo de <span className="font-bold text-foreground">S/ {disc.value.toFixed(2)}</span> aplicado en esta compra.
                                </p>
                            ) : isFreeShipping ? (
                                <p className="leading-relaxed">
                                    Esta compra cuenta con <span className="font-bold text-foreground">Envío Gratis</span>.
                                </p>
                            ) : (
                                disc.description && (
                                    <p className="leading-relaxed">{disc.description}</p>
                                )
                            )}

                            {/* Listado de Productos de Regalo / Beneficio Y para BXGY */}
                            {isBxgy && giftProducts.length > 0 && (
                                <div className="pt-2 space-y-2 border-t border-border">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                                        Producto de regalo incluido:
                                    </span>

                                    <div className="flex flex-col gap-2">
                                        {giftProducts.map((gift) => {
                                            const giftImage = gift.imagenes?.[0] || "/logoapp.svg";

                                            return (
                                                <Link
                                                    key={gift._id}
                                                    href={`/productos/${gift.slug}`}
                                                    prefetch={false}
                                                    className="flex items-center justify-between gap-3 p-2 rounded border border-border bg-background hover:border-foreground/40 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div className="relative w-9 h-9 rounded-sm shrink-0 overflow-hidden border border-border bg-background-secondary">
                                                            <Image
                                                                src={giftImage}
                                                                alt={gift.nombre}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        </div>
                                                        <span className="text-xs font-semibold text-foreground group-hover:text-action-cta transition-colors line-clamp-1">
                                                            {gift.nombre}
                                                        </span>
                                                    </div>

                                                    <span className="text-xs font-bold text-action-cta shrink-0 flex items-center gap-0.5">
                                                        Ver detalle
                                                        <span className="text-sm font-normal">→</span>
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}