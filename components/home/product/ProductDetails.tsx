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
import { ChevronRight, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import ProductComplementary from './ProductComplementary';
import { GoLinkExternal } from "react-icons/go";
import { H1, Small, Muted } from '@/components/ui/Typography';

type Props = {
    producto: ProductWithCategoryResponse;
};

const MAX_VISIBLE_OPTIONS = 10;

export default function ProductDetails({ producto }: Props) {
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
        const cleaned = Array.from(new Set(images.filter(img => img && img.trim() !== "")));
        return cleaned.length > 0 ? cleaned : ["/logoapp.svg"];
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
        <article className="flex flex-col lg:grid lg:grid-cols-12 gap-2 md:gap-6 lg:gap-10 mx-auto text-foreground items-start w-full min-w-0 bg-background p-4 md:p-6 lg:p-8">

            {/* ── 1. CARRUSEL DE IMÁGENES (Móvil: orden 1 | Desktop: Columna izquierda arriba) ── */}
            <div className="order-1 lg:order-none lg:col-span-7 w-full min-w-0 overflow-hidden">
                <ImagenesProductoCarousel images={variantImages} />
            </div>

            {/* ── 2. PANEL DE CONVERSIÓN Y COMPRA (Móvil: orden 2 | Desktop: Columna derecha completa) ── */}
            <section className="order-2 lg:order-none lg:col-span-5 w-full min-w-0 lg:sticky lg:top-24 space-y-4 lg:pb-6">
                <header className="py-1 space-y-2">
                    {/* Breadcrumbs y SKU */}
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1 flex-wrap">
                            {producto.brand && (
                                <Link
                                    href={`/catalogo/${producto.brand.slug}`}
                                    prefetch={false}
                                    className="text-[10px] font-semibold text-muted-foreground hover:text-action-cta transition-colors uppercase tracking-wider focus-visible:outline-none"
                                >
                                    {producto.brand.nombre}
                                </Link>
                            )}
                            {producto.brand && producto.line && (
                                <span className="text-[10px] text-border">/</span>
                            )}
                            {producto.line && typeof producto.line === 'object' && (
                                <Link
                                    href={`/catalogo/${producto.line.slug}`}
                                    prefetch={false}
                                    className="text-[10px] font-semibold text-muted-foreground hover:text-action-cta transition-colors uppercase tracking-wider focus-visible:outline-none"
                                >
                                    {producto.line.nombre}
                                </Link>
                            )}
                        </div>

                        {(selectedVariant?.sku || producto.sku) && (
                            <Small className="normal-case tracking-normal">
                                SKU: {selectedVariant?.sku || producto.sku}
                            </Small>
                        )}
                    </div>

                    {/* Nombre del Producto */}
                    <H1 className="select-text tracking-tight font-semibold">
                        {producto.nombre}
                    </H1>

                    {/* Precios */}
                    <div className="flex items-baseline gap-2.5 flex-wrap pt-1">
                        <div className="flex items-baseline gap-0.5 text-foreground select-all">
                            <span className="text-xs font-medium">S/</span>
                            <span className="text-2xl md:text-3xl font-bold tracking-tight">
                                {precio.toFixed(2)}
                            </span>
                        </div>

                        {hasDiscount && (
                            <div className="flex items-center gap-2">
                                <span className="text-xl text-muted-foreground line-through font-normal">
                                    S/ {precioComparativo!.toFixed(2)}
                                </span>
                                <span className="px-1.5 py-0 bg-destructive/10 text-destructive text-lg uppercase tracking-wider ">
                                    {Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)}% OFF
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Indicador de Stock */}
                    {stock === 0 && (
                        <div className="pt-1">
                            <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-foreground bg-foreground/10 border border-foreground/20 px-2 py-0.5 ">
                                Sin stock
                            </span>
                        </div>
                    )}
                </header>

                {/* Atributos Destacados */}
                {featuredAttributes.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 py-1">
                        {featuredAttributes.map((attr) => {
                            const valueLower = attr.value.toLowerCase().trim();
                            const isCheckAttribute = ["si", "sí", "true", "aplica", "incluido", "yes"].includes(valueLower);

                            return (
                                <div
                                    key={attr.key}
                                    className="flex flex-col items-center text-center gap-1.5 p-2 min-w-0"
                                >
                                    {attr.icon && (
                                        <Image
                                            src={attr.icon}
                                            alt={attr.key}
                                            width={32}
                                            height={32}
                                            className="object-contain w-10 h-10 shrink-0"
                                            unoptimized
                                            quality={50}
                                        />
                                    )}
                                    <div className="flex flex-col min-w-0 leading-tight">
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                            {attr.key}
                                        </span>
                                        {!isCheckAttribute && (
                                            <span className="text-sm font-semibold text-foreground uppercase">
                                                {attr.value}
                                            </span>
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
                            <span className="text-xs font-semibold text-muted-foreground">Color:</span>
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
                                <legend className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                    {key}:
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
                                                        "relative flex items-center gap-2 p-1.5 border w-full transition-all cursor-pointer outline-none text-xs font-semibold focus-visible:ring-2 focus-visible:ring-ring",
                                                        selected
                                                            ? "border-foreground bg-background ring-1 ring-foreground"
                                                            : "border-border bg-card hover:border-muted-foreground/60",
                                                        outOfStock && "opacity-40 cursor-not-allowed bg-muted/20"
                                                    )}
                                                >
                                                    <div className="relative w-6 h-6 overflow-hidden rounded-full border border-border shrink-0 flex items-center justify-center bg-card">
                                                        {variantForValue?.imagenes?.[0] ? (
                                                            <Image
                                                                src={variantForValue.imagenes[0]}
                                                                alt={val}
                                                                fill
                                                                className="object-cover"
                                                                unoptimized
                                                            />
                                                        ) : (
                                                            <ColorCircle color={val} size={20} />
                                                        )}
                                                    </div>
                                                    <span className={cn("text-[10px] truncate capitalize font-semibold", selected ? "text-foreground" : "text-muted-foreground", outOfStock && "line-through")}>
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
                                        <SelectTrigger className="w-full border-border bg-card text-foreground focus:ring-ring font-semibold text-xs h-9 ">
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
                                                            "cursor-pointer font-semibold text-xs",
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
                                                        "h-8 px-3.5 relative overflow-hidden transition-all border text-xs font-semibold cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                        selected
                                                            ? "border-foreground bg-background ring-1 ring-foreground text-foreground"
                                                            : "border-border bg-card text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground",
                                                        outOfStock && "opacity-40 text-muted-foreground/60 border-border cursor-not-allowed"
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
                <div className="border-y border-border/40 divide-y divide-border/30 my-2">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CreditCard className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-xs font-medium">Pagos seguros:</span>
                        </div>
                        <PaymentMethods />
                    </div>

                    <div className="flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-medium">Garantía oficial:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-bold text-foreground">12 meses</span>
                            <a
                                href="/politicas-de-cambios-y-devoluciones"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Ver políticas de garantía"
                                className="text-muted-foreground hover:text-action-cta transition-colors p-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <GoLinkExternal className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Truck className="w-3.5 h-3.5 shrink-0" />
                            <span className="font-medium">Envío:</span>
                        </div>
                        <div className="text-right">
                            {isFreeShipping && (
                                <span className="font-bold text-action-cta uppercase mr-1">
                                    Gratis
                                </span>
                            )}
                            <Muted className="inline font-medium text-foreground">
                                ({getDeliveryRange(producto.diasEnvio || 1)})
                            </Muted>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2 text-xs">
                        <a
                            href={`https://wa.me/51925054636?text=Consulta%20${encodeURIComponent(producto.nombre)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-action-cta transition-colors w-full justify-between"
                        >
                            <span className="flex items-center gap-2 font-medium">
                                <GoLinkExternal className="w-3.5 h-3.5" />
                                ¿Dudas sobre el producto?
                            </span>
                            <span className="flex items-center text-foreground font-semibold">
                                Asesoría WhatsApp
                                <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                        </a>
                    </div>
                </div>

                <ProductComplementary complementarios={producto.complementarios} />
            </section>

            {/* ── 3. DETALLES Y ESPECIFICACIONES (Móvil: orden 3, debajo de todo | Desktop: Columna izquierda debajo de imágenes) ── */}
            <div className="order-3 lg:order-none lg:col-span-7 w-full border-t border-border/60 pt-4 mt-4 lg:mt-0">
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