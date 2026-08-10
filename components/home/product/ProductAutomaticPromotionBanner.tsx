// File: frontend/components/home/product/ProductAutomaticPromotionBanner.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { Tag, Truck, ArrowRight } from "lucide-react";
import { type DiscountResponse } from "@/src/schemas/discount.schema";

interface Props {
    discounts: DiscountResponse[];
}

export default function ProductAutomaticPromotionBanner({ discounts }: Props) {
    if (!discounts || discounts.length === 0) return null;

    return (
        <div className="space-y-2 my-2 select-none">
            {discounts.map((disc) => {
                const isBxgy = disc.type === "BUY_X_GET_Y";
                const isPercentage = disc.type === "PERCENTAGE";
                const isFixedAmount = disc.type === "FIXED_AMOUNT";
                const isFreeShipping = disc.type === "FREE_SHIPPING";

                const bxgy = disc.bxgyConfig;
                const bonusProducts = disc.giftProductsDetails ?? [];

                return (
                    <div
                        key={disc._id}
                        className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-2.5 space-y-2 transition-colors hover:border-[var(--border-hover)]"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[var(--action-cta)] text-[var(--action-cta-foreground)]">
                                    {isFreeShipping ? (
                                        <Truck className="h-2.5 w-2.5" />
                                    ) : (
                                        <Tag className="h-2.5 w-2.5" />
                                    )}
                                </span>
                                <span className="text-xs font-semibold text-[var(--foreground)] truncate tracking-tight">
                                    {disc.title}
                                </span>
                            </div>

                            <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-[var(--action-cta)] bg-[var(--action-cta)]/10 px-1.5 py-0.5 rounded">
                                Oferta
                            </span>
                        </div>

                        <div className="text-[11px] text-[var(--muted-foreground)] font-normal leading-normal">
                            {isBxgy && bxgy ? (
                                <p>
                                    Compra <strong className="text-[var(--foreground)] font-semibold">{bxgy.buyQuantity}</strong> y lleva{" "}
                                    <strong className="text-[var(--foreground)] font-semibold">
                                        {bxgy.getQuantity} {bxgy.getDiscountType === "FREE" ? "GRATIS" : `con ${bxgy.getDiscountValue}% OFF`}
                                    </strong>
                                </p>
                            ) : isPercentage ? (
                                <p>
                                    <strong className="text-[var(--foreground)] font-semibold">{disc.value}% de descuento</strong> automático aplicado en el checkout.
                                </p>
                            ) : isFixedAmount ? (
                                <p>
                                    Ahorra <strong className="text-[var(--foreground)] font-semibold">S/ {disc.value.toFixed(2)}</strong> directamente en tu orden.
                                </p>
                            ) : isFreeShipping ? (
                                <p>
                                    Incluye <strong className="text-[var(--foreground)] font-semibold">Envío Gratuito</strong> a nivel nacional.
                                </p>
                            ) : (
                                disc.description && <p>{disc.description}</p>
                            )}
                        </div>

                        {isBxgy && bonusProducts.length > 0 && (
                            <div className="space-y-1.5 pt-1.5 border-t border-[var(--border)]">
                                <div className="grid grid-cols-1 gap-1">
                                    {bonusProducts.map((product) => {
                                        const productImage = product.imagenes?.[0] || "/logoapp.svg";
                                        const originalPrice = product.precio ?? 0;
                                        const productSlug = product.slug ?? product._id;

                                        return (
                                            <Link
                                                key={product._id}
                                                href={`/productos/${productSlug}`}
                                                prefetch={false}
                                                className="group flex items-center justify-between gap-2 p-1.5 rounded-[var(--radius-sm)] bg-[var(--background-secondary)] border border-transparent hover:border-[var(--border)] transition-all"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--card)] border border-[var(--border)]">
                                                        <Image
                                                            src={productImage}
                                                            alt={product.nombre}
                                                            fill
                                                            sizes="28px"
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-[11px] font-medium text-[var(--foreground)] group-hover:text-[var(--action-cta)] transition-colors line-clamp-1">
                                                            {product.nombre}
                                                        </span>

                                                        <div className="flex items-center gap-1.5 mt-0.5">
                                                            {originalPrice > 0 && (
                                                                <span className="text-[9px] text-[var(--muted-foreground)] line-through">
                                                                    S/ {originalPrice.toFixed(2)}
                                                                </span>
                                                            )}
                                                            <span className="text-[9px] font-bold tracking-wide uppercase text-[var(--action-cta)] bg-[var(--action-cta)]/10 px-1 py-0.5 rounded">
                                                                {bxgy?.getDiscountType === "FREE"
                                                                    ? "GRATIS"
                                                                    : bxgy?.getDiscountType === "PERCENTAGE"
                                                                    ? `-${bxgy.getDiscountValue}%`
                                                                    : `-S/ ${bxgy?.getDiscountValue.toFixed(2)}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <ArrowRight className="h-3 w-3 text-[var(--muted-foreground)] group-hover:text-[var(--action-cta)] shrink-0 transition-colors" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}