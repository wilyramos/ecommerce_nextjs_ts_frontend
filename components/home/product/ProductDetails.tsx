// File: frontend/components/home/product/ProductDetails.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant, ProductAttributeDetail } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import PaymentNotice from './PaymentNotice';
import ProductExpandableSections from './ProductExpandableSections ';
import { cn, getDeliveryRange } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import PaymentMethods from '../PaymentMethods';
import ColorCircle from '@/components/ui/ColorCircle';
import Link from 'next/link';
import Image from 'next/image';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import ProductComplementary from './ProductComplementary';
import { GoLinkExternal } from "react-icons/go";
import { H1, H4, P, Small } from '@/components/ui/TypographyV3';
import type { DiscountResponse } from '@/src/schemas/discount.schema';
import ProductAutomaticPromotionBanner from './ProductAutomaticPromotionBanner';

type Props = {
  producto: ProductWithCategoryResponse;
  automaticDiscounts?: DiscountResponse[];
};

const MAX_VISIBLE_OPTIONS = 10;

export default function ProductDetails({ producto, automaticDiscounts = [] }: Props) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<TApiVariant | null>(null);
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const categoryAttributesMap = useMemo(() => {
    const map = new Map<string, string>();
    if (producto.categoria && typeof producto.categoria === 'object' && producto.categoria.attributes) {
      (producto.categoria.attributes as Array<{ name: string; icon?: string | null }>).forEach((attr) => {
        if (attr.icon && attr.icon.trim() !== '') {
          map.set(attr.name.toLowerCase().trim(), attr.icon.trim());
        }
      });
    }
    return map;
  }, [producto.categoria]);

  const featuredAttributes = useMemo(() => {
    const rawDetalle = producto.atributosDetalle;
    if (!rawDetalle) return [];

    const entries: [string, ProductAttributeDetail][] = Array.isArray(rawDetalle)
      ? rawDetalle
      : Object.entries(rawDetalle);

    return entries
      .filter(([, detail]) => {
        if (!detail) return false;
        return Boolean(detail.isFeatured) && Boolean(detail.value && String(detail.value).trim() !== '');
      })
      .map(([key, detail]) => {
        const normalizedKey = key.toLowerCase().trim();
        const iconFromCategory = categoryAttributesMap.get(normalizedKey);
        const finalIcon = detail.icon && detail.icon.trim() !== ''
          ? detail.icon
          : (iconFromCategory || null);

        return {
          key,
          value: detail.value,
          icon: finalIcon,
        };
      });
  }, [producto.atributosDetalle, categoryAttributesMap]);

  const allAttributes = useMemo(() => {
    const attrs: Record<string, string[]> = {};
    producto.variants?.forEach(v => {
      Object.entries(v.atributos).forEach(([key, value]) => {
        if (!attrs[key]) attrs[key] = [];
        if (!attrs[key].includes(value)) attrs[key].push(value);
      });
    });
    return attrs;
  }, [producto.variants]);

  const showPaymentNotice = Boolean(producto.categoria);

  useEffect(() => {
    const initialAttrs: Record<string, string> = {};
    Object.keys(allAttributes).forEach(attr => {
      const val = searchParams.get(attr);
      if (val) initialAttrs[attr] = val;
    });

    setSelectedAttributes(initialAttrs);

    const matched = Object.keys(initialAttrs).length > 0
      ? producto.variants?.find(v =>
          Object.keys(initialAttrs).every(k => initialAttrs[k] === v.atributos[k])
        ) ?? null
      : null;

    setSelectedVariant(matched);
    isFirstRender.current = false;
  }, [allAttributes, searchParams, producto.variants]);

  const updateSelectedVariant = (attrKey: string, attrValue: string | null) => {
    const newAttributes = { ...selectedAttributes };
    if (attrValue === null || newAttributes[attrKey] === attrValue) {
      delete newAttributes[attrKey];
    } else {
      newAttributes[attrKey] = attrValue;
    }
    setSelectedAttributes(newAttributes);

    const matchedVariant = producto.variants?.find(v =>
      Object.keys(v.atributos).every(k => newAttributes[k] === v.atributos[k])
    ) ?? null;

    setSelectedVariant(matchedVariant);

    const params = new URLSearchParams();
    Object.entries(newAttributes).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    if (!isFirstRender.current) {
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
    }
  };

  const getAvailableValues = (attrKey: string): string[] => {
    const values = new Set<string>();
    producto.variants?.forEach(variant => {
      const matchesOtherAttrs = Object.entries(selectedAttributes)
        .every(([key, value]) => key === attrKey || variant.atributos[key] === value);
      if (matchesOtherAttrs) values.add(variant.atributos[attrKey]);
    });
    return Array.from(values).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );
  };

  const variantImages = useMemo(() => {
    let images: string[] = [];

    if (selectedVariant?.imagenes && selectedVariant.imagenes.length > 0) {
      images = selectedVariant.imagenes;
    } else {
      const generalImages = producto.imagenes ?? [];
      const allVariantsImages = producto.variants?.flatMap(v => v.imagenes ?? []) ?? [];
      images = [...generalImages, ...allVariantsImages];
    }

    return Array.from(new Set(images.filter(img => img && img.trim() !== "")));
  }, [selectedVariant, producto.imagenes, producto.variants]);

  const precio = selectedVariant?.precio ?? producto.precio ?? 0;
  const precioComparativo = selectedVariant?.precioComparativo ?? producto.precioComparativo ?? null;
  const stock = !selectedVariant ? (producto.stock ?? 0) : (selectedVariant.stock ?? 0);
  const hasDiscount = precioComparativo !== null && precioComparativo > precio;
  const allAttributesSelected = Object.keys(allAttributes).every(key => selectedAttributes[key]);

  const colorAtributo = !producto.variants?.length && (producto.atributos?.color || producto.atributos?.Color || producto.atributos?.COLOR || null);
  const isFreeShipping = precio >= 49;

  const isOptionOutOfStock = (attrKey: string, attrValue: string) => {
    const variant = producto.variants?.find(v =>
      v.atributos[attrKey] === attrValue &&
      Object.entries(selectedAttributes).every(([key, value]) => key === attrKey || v.atributos[key] === value)
    );
    return variant?.stock === 0;
  };

  return (
    <article className="mx-auto flex w-full min-w-0 flex-col items-start gap-8 lg:grid lg:grid-cols-12 lg:gap-12">
      {/* ── 1. CARRUSEL DE IMÁGENES ── */}
      <div className="order-1 w-full min-w-0 overflow-hidden lg:order-none lg:col-span-7">
        <ImagenesProductoCarousel images={variantImages} />
      </div>

      {/* ── 2. PANEL DE CONVERSIÓN Y COMPRA ── */}
      <section className="order-2 w-full min-w-0 space-y-5 lg:sticky lg:top-24 lg:order-none lg:col-span-5">
        <header className="space-y-3">
          {/* Marca / Línea y SKU */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {producto.brand && (
                <Link
                  href={`/catalogo/${producto.brand.slug}`}
                  prefetch={false}
                  className="text-[11px] font-semibold uppercase   text-text-tertiary transition-colors duration-fast hover:text-text-primary"
                >
                  {producto.brand.nombre}
                </Link>
              )}
              {producto.brand && producto.line && (
                <span className="text-[11px] text-border-primary">/</span>
              )}
              {producto.line && typeof producto.line === 'object' && (
                <Link
                  href={`/catalogo/${producto.line.slug}`}
                  prefetch={false}
                  className="text-[11px] font-semibold uppercase   text-text-tertiary transition-colors duration-fast hover:text-text-primary"
                >
                  {producto.line.nombre}
                </Link>
              )}
            </div>

            {(selectedVariant?.sku || producto.sku) && (
              <Small className="text-[10px] uppercase tracking-wider text-text-disabled">
                SKU: {selectedVariant?.sku || producto.sku}
              </Small>
            )}
          </div>

          {/* Nombre del Producto */}
          <H1 className="text-xl font-medium tracking-tight text-text-primary sm:text-2xl lg:text-3xl">
            {producto.nombre}
          </H1>

          {/* Precios */}
          <div className="flex flex-wrap items-baseline gap-2.5 pt-1">
            <span className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              S/ {precio.toFixed(2)}
            </span>

            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-text-tertiary line-through">
                  S/ {precioComparativo!.toFixed(2)}
                </span>
                <span className="rounded-radius-sm bg-status-error px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-text-inverse">
                  {Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)}% OFF
                </span>
              </div>
            )}
          </div>

          {/* Indicador de Stock */}
          {stock === 0 && (
            <div className="pt-1">
              <span className="inline-block rounded-radius-sm border border-border-primary bg-surface-secondary px-2 py-0.5 text-xs font-medium text-text-disabled">
                Agotado
              </span>
            </div>
          )}
        </header>

        <ProductAutomaticPromotionBanner discounts={automaticDiscounts} />

        {/* Atributos Destacados */}
        {featuredAttributes.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-radius-lg border border-border-primary/60 bg-surface-secondary/40 p-4 sm:grid-cols-3">
            {featuredAttributes.map((attr) => {
              const valueLower = String(attr.value).toLowerCase().trim();
              const isCheckAttribute = ["si", "sí", "true", "aplica", "incluido", "yes"].includes(valueLower);

              return (
                <div
                  key={attr.key}
                  // Modificamos a items-start y gap-2.5 para multilínea correcta
                  className="flex min-w-0 items-start gap-2.5"
                >
                  {attr.icon && (
                    <Image
                      src={attr.icon}
                      alt={attr.key}
                      width={40} // Aumentado a 40px
                      height={40} // Aumentado a 40px
                      className="size-10 shrink-0 object-contain pt-0.5" // size-10 con ligero pt para alinear
                      unoptimized
                    />
                  )}
                  <div className="flex min-w-0 flex-col gap-0.5 pt-0.5">
                    {/* Quitamos truncate y agregamos break-words y leading-tight */}
                    <Small className="break-words text-[10px] font-semibold uppercase leading-tight   text-text-tertiary">
                      {attr.key}
                    </Small>
                    {!isCheckAttribute && (
                      <P className="break-words text-xs font-medium leading-tight text-text-primary">
                        {attr.value}
                      </P>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selección de Atributos y Variantes */}
        <div className="space-y-4 pt-1">
          {!producto.variants?.length && colorAtributo && (
            <div className="flex items-center gap-2">
              <Small className="text-xs font-medium text-text-secondary">Color:</Small>
              <div className="flex items-center gap-1.5">
                {(Array.isArray(colorAtributo) ? colorAtributo : [colorAtributo]).map((c) => (
                  <ColorCircle key={c} color={c} size={14} />
                ))}
              </div>
            </div>
          )}

          {Object.entries(allAttributes).map(([key]) => {
            const availableValues = getAvailableValues(key);
            const isColor = key.toLowerCase() === "color";
            const useDropdown = !isColor && availableValues.length > MAX_VISIBLE_OPTIONS;

            return (
              <fieldset key={key} className="space-y-2">
                <legend>
                  <H4 className="text-[11px] font-semibold uppercase   text-text-tertiary">
                    {key}: {selectedAttributes[key] && (
                      <span className="font-normal capitalize text-text-primary">{selectedAttributes[key]}</span>
                    )}
                  </H4>
                </legend>

                {isColor ? (
                  <div className="grid grid-cols-2 gap-2 xs:grid-cols-3 sm:grid-cols-4">
                    {availableValues.map((val) => {
                      const outOfStock = isOptionOutOfStock(key, val);
                      const selected = selectedAttributes[key] === val;
                      const variantForValue = producto.variants?.find(v => v.atributos[key] === val);

                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                          disabled={outOfStock}
                          className={cn(
                            "relative flex w-full items-center gap-2 rounded-radius-md border p-2 text-xs font-medium transition-all duration-fast outline-none",
                            selected
                              ? "border-brand-primary bg-surface-primary text-text-primary shadow-xs ring-1 ring-brand-primary"
                              : "border-border-primary/80 bg-surface-secondary/40 text-text-secondary hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary",
                            outOfStock && "cursor-not-allowed bg-surface-secondary/20 text-text-disabled opacity-40 hover:border-border-primary/80"
                          )}
                        >
                          <div className="relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-radius-full border border-border-primary/60 bg-surface-primary">
                            {variantForValue?.imagenes?.[0] ? (
                              <Image
                                src={variantForValue.imagenes[0]}
                                alt={val}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <ColorCircle color={val} size={14} />
                            )}
                          </div>
                          <span className={cn("truncate capitalize", outOfStock && "line-through")}>
                            {val}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : useDropdown ? (
                  <Select
                    value={selectedAttributes[key] || ""}
                    onValueChange={(val) => updateSelectedVariant(key, val)}
                  >
                    <SelectTrigger className="h-9 w-full rounded-radius-md border-border-primary/80 bg-surface-primary text-xs text-text-primary">
                      <SelectValue placeholder={`Seleccionar ${key}`} />
                    </SelectTrigger>
                    <SelectContent className="border-border-primary bg-surface-primary shadow-lg">
                      {availableValues.map((val) => {
                        const outOfStock = isOptionOutOfStock(key, val);
                        return (
                          <SelectItem
                            key={val}
                            value={val}
                            disabled={outOfStock}
                            className={cn(
                              "cursor-pointer text-xs text-text-secondary focus:bg-surface-secondary focus:text-text-primary",
                              outOfStock && "cursor-not-allowed text-text-disabled line-through opacity-40"
                            )}
                          >
                            {val}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableValues.map((val) => {
                      const outOfStock = isOptionOutOfStock(key, val);
                      const selected = selectedAttributes[key] === val;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                          disabled={outOfStock}
                          className={cn(
                            "h-8.5 rounded-radius-md border px-3 text-xs font-medium transition-all duration-fast outline-none",
                            selected
                              ? "border-brand-primary bg-surface-primary text-text-primary shadow-xs ring-1 ring-brand-primary"
                              : "border-border-primary/80 bg-surface-secondary/40 text-text-secondary hover:border-border-strong hover:bg-surface-secondary hover:text-text-primary",
                            outOfStock && "cursor-not-allowed border-border-primary/40 text-text-disabled opacity-40 hover:border-border-primary/40"
                          )}
                        >
                          <span className={cn(outOfStock && "line-through")}>{val}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            );
          })}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-3 pt-2">
          <div className="hidden flex-1 md:flex">
            <AddProductToCart
              product={producto}
              variant={selectedVariant ?? undefined}
            />
          </div>
          <div className="flex-1">
            <ShopNowButton
              disabled={((producto.variants?.length ?? 0) > 0 && (!allAttributesSelected || !selectedVariant)) || stock <= 0}
              product={producto}
              variant={selectedVariant ?? undefined}
            />
          </div>
        </div>

        {showPaymentNotice && precio > 150 && (
          <PaymentNotice price={precio} installments={6} />
        )}

        {/* Bloque de Información de Confianza */}
        <div className="divide-y divide-border-primary/60 rounded-radius-lg border border-border-primary/80 bg-surface-secondary/30 px-4 text-xs">
          <div className="flex items-center justify-between py-3">
            <span className="font-normal text-text-secondary">Métodos de pago</span>
            <PaymentMethods />
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="font-normal text-text-secondary">Garantía</span>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-text-primary">12 meses oficial</span>
              <a
                href="/politicas-de-cambios-y-devoluciones"
                target="_blank"
                rel="noopener noreferrer"
                title="Ver políticas de garantía"
                className="text-text-tertiary transition-colors duration-fast hover:text-text-primary"
              >
                <GoLinkExternal className="size-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="font-normal text-text-secondary">Envío</span>
            <div className="text-right">
              {isFreeShipping && (
                <span className="mr-1.5 font-semibold text-text-primary">
                  Gratis
                </span>
              )}
              <span className="text-text-tertiary">
                ({getDeliveryRange(producto.diasEnvio || 1)})
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between py-3">
            <a
              href={`https://wa.me/51925054636?text=Consulta%20${encodeURIComponent(producto.nombre)}`}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-between text-text-secondary transition-colors duration-fast hover:text-text-primary"
            >
              <span className="font-normal">¿Dudas sobre el producto?</span>
              <span className="inline-flex items-center gap-1 font-medium text-text-primary">
                WhatsApp
                <GoLinkExternal className="size-3 text-text-tertiary" />
              </span>
            </a>
          </div>
        </div>

        <ProductComplementary complementarios={producto.complementarios} />
      </section>

      {/* ── 3. DETALLES Y ESPECIFICACIONES ── */}
      <div className="order-3 w-full border-t border-border-primary/80 pt-8 lg:order-none lg:col-span-7">
        <ProductExpandableSections producto={producto} />
      </div>

      {/* Barra fija de compra móvil */}
      <div className="fixed inset-x-0 bottom-0 z-sticky border-t border-border-primary/80 bg-surface-primary/95 p-3 backdrop-blur-md pb-safe md:hidden">
        <AddProductToCart
          product={producto}
          variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
        />
      </div>
    </article>
  );
}