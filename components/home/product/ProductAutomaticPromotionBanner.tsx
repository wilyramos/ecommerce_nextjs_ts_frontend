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
    <div className="my-3 space-y-2.5 select-none">
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
            className="space-y-2.5 rounded-radius-md border border-border-primary/80 bg-surface-secondary/40 p-3 transition-colors duration-fast hover:border-border-strong"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-radius-sm bg-brand-accent text-text-inverse">
                  {isFreeShipping ? (
                    <Truck className="size-3" strokeWidth={2.5} />
                  ) : (
                    <Tag className="size-3" strokeWidth={2.5} />
                  )}
                </span>
                <span className="truncate text-xs font-semibold tracking-tight text-text-primary">
                  {disc.title}
                </span>
              </div>

              <span className="shrink-0 rounded-radius-sm bg-brand-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-accent">
                Oferta
              </span>
            </div>

            <div className="text-[11px] font-normal leading-relaxed text-text-secondary">
              {isBxgy && bxgy ? (
                <p>
                  Compra <strong className="font-semibold text-text-primary">{bxgy.buyQuantity}</strong> y lleva{" "}
                  <strong className="font-semibold text-text-primary">
                    {bxgy.getQuantity} {bxgy.getDiscountType === "FREE" ? "GRATIS" : `con ${bxgy.getDiscountValue}% OFF`}
                  </strong>
                </p>
              ) : isPercentage ? (
                <p>
                  <strong className="font-semibold text-text-primary">{disc.value}% de descuento</strong> automático aplicado en el checkout.
                </p>
              ) : isFixedAmount ? (
                <p>
                  Ahorra <strong className="font-semibold text-text-primary">S/ {disc.value.toFixed(2)}</strong> directamente en tu orden.
                </p>
              ) : isFreeShipping ? (
                <p>
                  Incluye <strong className="font-semibold text-text-primary">Envío Gratuito</strong> a nivel nacional.
                </p>
              ) : (
                disc.description && <p>{disc.description}</p>
              )}
            </div>

            {isBxgy && bonusProducts.length > 0 && (
              <div className="space-y-1.5 border-t border-border-primary/60 pt-2.5">
                <div className="grid grid-cols-1 gap-1.5">
                  {bonusProducts.map((product) => {
                    const productImage = product.imagenes?.[0] || "/logoapp.svg";
                    const originalPrice = product.precio ?? 0;
                    const productSlug = product.slug ?? product._id;

                    return (
                      <Link
                        key={product._id}
                        href={`/productos/${productSlug}`}
                        prefetch={false}
                        className="group flex items-center justify-between gap-2 rounded-radius-sm border border-transparent bg-surface-primary p-1.5 transition-all duration-fast hover:border-border-primary/80"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="relative size-8 shrink-0 overflow-hidden rounded-radius-sm border border-border-primary/50 bg-surface-secondary/50 p-0.5">
                            <Image
                              src={productImage}
                              alt={product.nombre}
                              fill
                              sizes="32px"
                              className="object-contain p-0.5"
                              unoptimized
                            />
                          </div>

                          <div className="flex min-w-0 flex-col">
                            <span className="line-clamp-1 text-[11px] font-medium text-text-primary transition-colors duration-fast group-hover:text-brand-accent">
                              {product.nombre}
                            </span>

                            <div className="mt-0.5 flex items-center gap-1.5">
                              {originalPrice > 0 && (
                                <span className="text-[9px] text-text-tertiary line-through">
                                  S/ {originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="rounded-[3px] bg-brand-accent/10 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand-accent">
                                {bxgy?.getDiscountType === "FREE"
                                  ? "GRATIS"
                                  : bxgy?.getDiscountType === "PERCENTAGE"
                                  ? `-${bxgy.getDiscountValue}%`
                                  : `-S/ ${bxgy?.getDiscountValue.toFixed(2)}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        <ArrowRight className="size-3 shrink-0 text-text-tertiary transition-colors duration-fast group-hover:text-brand-accent" />
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