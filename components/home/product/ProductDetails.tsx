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
import { H1, P, Small, Muted, Price, BadgeText } from '@/components/ui/TypographyStore';
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
                    icon: finalIcon
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
        <article className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 lg:gap-10 mx-auto text-foreground items-start w-full min-w-0 bg-background">
            {/* ── 1. CARRUSEL DE IMÁGENES ── */}
            <div className="order-1 lg:order-none lg:col-span-7 w-full min-w-0 overflow-hidden">
                <ImagenesProductoCarousel images={variantImages} />
            </div>

            {/* ── 2. PANEL DE CONVERSIÓN Y COMPRA ── */}
            <section className="order-2 lg:order-none lg:col-span-5 w-full min-w-0 lg:sticky lg:top-24 space-y-4 p-2 md:p-4 lg:p-6">
                <header className="py-1 space-y-2">
                    {/* Breadcrumbs y SKU */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 flex-wrap">
                            {producto.brand && (
                                <Link
                                    href={`/catalogo/${producto.brand.slug}`}
                                    prefetch={false}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Small className="uppercase tracking-wider font-medium">{producto.brand.nombre}</Small>
                                </Link>
                            )}
                            {producto.brand && producto.line && (
                                <Small className="text-border">/</Small>
                            )}
                            {producto.line && typeof producto.line === 'object' && (
                                <Link
                                    href={`/catalogo/${producto.line.slug}`}
                                    prefetch={false}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Small className="uppercase tracking-wider font-medium">{producto.line.nombre}</Small>
                                </Link>
                            )}
                        </div>

                        {(selectedVariant?.sku || producto.sku) && (
                            <Small>
                                SKU: {selectedVariant?.sku || producto.sku}
                            </Small>
                        )}
                    </div>

                    {/* Nombre del Producto */}
                    <H1 className="text-xl sm:text-2xl font-medium text-muted-foreground capitalize">
                        {producto.nombre}
                    </H1>

                    {/* Precios */}
                    <div className="flex items-baseline gap-2.5 flex-wrap pt-1">
                        <Price className="text-xl font-semibold">
                            S/ {precio.toFixed(2)}
                        </Price>

                        {hasDiscount && (
                            <div className="flex items-center gap-2">
                                <Price className="text-sm text-muted-foreground line-through font-normal">
                                    S/ {precioComparativo!.toFixed(2)}
                                </Price>
                                <BadgeText className="bg-muted px-1.5 py-0.5 text-foreground">
                                    {Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)}% OFF
                                </BadgeText>
                            </div>
                        )}
                    </div>

                    {/* Indicador de Stock */}
                    {stock === 0 && (
                        <div className="pt-1">
                            <BadgeText className="bg-muted/40 border border-border px-2 py-0.5 text-foreground">
                                Sin stock
                            </BadgeText>
                        </div>
                    )}
                </header>

                <ProductAutomaticPromotionBanner discounts={automaticDiscounts} />

                {/* Atributos Destacados */}
                {featuredAttributes.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-1">
                        {featuredAttributes.map((attr) => {
                            const valueLower = attr.value.toLowerCase().trim();
                            const isCheckAttribute = ["si", "sí", "true", "aplica", "incluido", "yes"].includes(valueLower);

                            return (
                                <div
                                    key={attr.key}
                                    className="flex flex-col items-center text-center gap-1 p-2 border border-border bg-muted/10 min-w-0"
                                >
                                    {attr.icon && (
                                        <Image
                                            src={attr.icon}
                                            alt={attr.key}
                                            width={28}
                                            height={28}
                                            className="object-contain w-7 h-7 shrink-0"
                                            unoptimized
                                            quality={50}
                                        />
                                    )}
                                    <div className="flex flex-col min-w-0">
                                        <Small className="uppercase tracking-wider">{attr.key}</Small>
                                        {!isCheckAttribute && (
                                            <P className="text-xs font-medium text-foreground uppercase truncate">
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
                <div className="space-y-3">
                    {!producto.variants?.length && colorAtributo && (
                        <div className="flex items-center gap-2">
                            <Small className="font-medium text-muted-foreground">Color:</Small>
                            <div className="flex items-center gap-1.5">
                                {(Array.isArray(colorAtributo) ? colorAtributo : [colorAtributo]).map((c) => (
                                    <ColorCircle key={c} color={c} size={16} />
                                ))}
                            </div>
                        </div>
                    )}

                    {Object.entries(allAttributes).map(([key]) => {
                        const availableValues = getAvailableValues(key);
                        const isColor = key.toLowerCase() === "color";
                        const useDropdown = !isColor && availableValues.length > MAX_VISIBLE_OPTIONS;

                        return (
                            <fieldset key={key} className="space-y-1.5">
                                <legend>
                                    <Small className="uppercase tracking-wider font-medium text-muted-foreground">{key}:</Small>
                                </legend>

                                {isColor ? (
                                    <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2">
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
                                                        "relative flex items-center gap-2 p-1.5 border w-full transition-all cursor-pointer outline-none text-xs font-medium",
                                                        selected
                                                            ? "border-foreground bg-foreground text-background"
                                                            : "border-border bg-background hover:border-muted-foreground",
                                                        outOfStock && "opacity-40 cursor-not-allowed bg-muted/20"
                                                    )}
                                                >
                                                    <div className="relative w-5 h-5 overflow-hidden border border-border shrink-0 flex items-center justify-center bg-card">
                                                        {variantForValue?.imagenes?.[0] ? (
                                                            <Image
                                                                src={variantForValue.imagenes[0]}
                                                                alt={val}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <ColorCircle color={val} size={16} />
                                                        )}
                                                    </div>
                                                    <span className={cn("text-xs truncate capitalize", selected ? "text-background" : "text-foreground", outOfStock && "line-through")}>
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
                                        <SelectTrigger className="w-full border-border bg-background text-foreground text-xs h-9">
                                            <SelectValue placeholder={`Seleccionar ${key}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableValues.map((val) => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                return (
                                                    <SelectItem
                                                        key={val}
                                                        value={val}
                                                        disabled={outOfStock}
                                                        className={cn(
                                                            "cursor-pointer text-xs",
                                                            outOfStock && "opacity-40 cursor-not-allowed line-through"
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
                                                        "h-8 px-3 transition-all border text-xs font-medium cursor-pointer outline-none",
                                                        selected
                                                            ? "border-foreground bg-foreground text-background"
                                                            : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground",
                                                        outOfStock && "opacity-40 border-border cursor-not-allowed"
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
                <section className="flex justify-between items-center gap-3 pt-2">
                    <div className="hidden md:flex flex-1">
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
                </section>

                {showPaymentNotice && precio > 150 && (
                    <PaymentNotice price={precio} installments={6} />
                )}

                {/* Bloque Logístico Consolidado */}
                <div className="">
                    <div className="flex items-center justify-between py-2.5">
                        <Small className="font-medium">Métodos de pago:</Small>
                        <PaymentMethods />
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                        <Small className="font-medium">Garantía oficial:</Small>
                        <div className="flex items-center gap-1.5">
                            <Small className="font-semibold text-foreground">12 meses</Small>
                            <a
                                href="/politicas-de-cambios-y-devoluciones"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Ver políticas de garantía"
                                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                            >
                                <GoLinkExternal className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                        <Small className="font-medium">Envío:</Small>
                        <div className="text-right">
                            {isFreeShipping && (
                                <BadgeText className="text-foreground font-semibold mr-1">
                                    Gratis
                                </BadgeText>
                            )}
                            <Muted className="inline text-xs text-foreground">
                                ({getDeliveryRange(producto.diasEnvio || 1)})
                            </Muted>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2.5">
                        <a
                            href={`https://wa.me/51925054636?text=Consulta%20${encodeURIComponent(producto.nombre)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between w-full text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Small className="font-medium">¿Dudas?</Small>
                            <span className="flex items-center text-xs font-medium text-foreground gap-1">
                                Consultar por WhatsApp
                                <GoLinkExternal className="w-3 h-3" />
                            </span>
                        </a>
                    </div>
                </div>

                <ProductComplementary complementarios={producto.complementarios} />
            </section>

            {/* ── 3. DETALLES Y ESPECIFICACIONES ── */}
            <div className="order-3 lg:order-none lg:col-span-7 w-full border-t border-border pt-4 mt-4 lg:mt-0">
                <ProductExpandableSections producto={producto} />
            </div>

            {/* Barra fija inferior para dispositivos móviles */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-card p-3 border-t border-border shadow-lg z-50 pb-safe">
                <AddProductToCart
                    product={producto}
                    variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
                />
            </div>
        </article>
    );
}