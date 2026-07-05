"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
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

type Props = {
    producto: ProductWithCategoryResponse;
};

const MAX_VISIBLE_OPTIONS = 10;

export default function ProductDetails({ producto }: Props) {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<TApiVariant | null>(null);
    const searchParams = useSearchParams();
    
    // Referencia para evitar re-sincronizaciones infinitas de la URL en el render inicial
    const isFirstRender = useRef(true);

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

    const showPaymentNotice = producto.categoria ?? false;

    // Sincronización de los parámetros de la URL hacia el estado
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
        
        // Ejecución controlada del reemplazo de estado en el historial
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

    const isOptionOutOfStock = (attrKey: string, attrValue: string) => {
        const variant = producto.variants?.find(v =>
            v.atributos[attrKey] === attrValue &&
            Object.entries(selectedAttributes).every(([key, value]) => key === attrKey || v.atributos[key] === value)
        );
        return variant?.stock === 0;
    };

    const colorAtributo = !producto.variants?.length && (producto.atributos?.color || producto.atributos?.Color || producto.atributos?.COLOR || null);
    const isFreeShipping = precio >= 49;

    return (
        <>
            <article className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mx-auto text-foreground bg-background px-2 ">
                <div className='md:col-span-7'>
                    <ImagenesProductoCarousel images={variantImages} />
                </div>

                <section className='md:col-span-5 md:px-0 space-y-2 pb-1'>
                    <div className="space-y-4">
                        <header className="py-1 space-y-1">

                            {/* Breadcrumb marca / línea + SKU */}
                            <div className="flex items-center justify-between w-full ">
                                <div className="flex items-center gap-1 flex-wrap">
                                    {producto.brand && (
                                        <Link
                                            href={`/catalogo/${producto.brand.slug}`}
                                            prefetch={false}
                                            className="text-[10px] font-semibold text-muted-foreground hover:text-action-cta transition-colors uppercase tracking-wider focus-visible:outline-hidden"
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
                                            className="text-[10px] font-semibold text-muted-foreground hover:text-action-cta transition-colors uppercase tracking-wider focus-visible:outline-hidden"
                                        >
                                            {producto.line.nombre}
                                        </Link>
                                    )}
                                </div>

                                {(selectedVariant?.sku || producto.sku) && (
                                    <span className="text-[10px] text-muted-foreground">
                                        {selectedVariant?.sku || producto.sku}
                                    </span>
                                )}
                            </div>

                            {/* Nombre */}
                            <h1 className="text-xl font-semibold text-foreground sm:text-2xl scroll-m-auto">
                                {producto.nombre}
                            </h1>

                            {/* Color sin variantes */}
                            {!producto.variants?.length && colorAtributo && (
                                <div className="flex items-center gap-2 ">
                                    <span className="text-xs font-semibold text-muted-foreground">Color:</span>
                                    <div className="flex items-center gap-1.5">
                                        {(Array.isArray(colorAtributo) ? colorAtributo : [colorAtributo]).map((c) => (
                                            <ColorCircle key={c} color={c} size={18} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Precios */}
                            <div className="flex items-baseline gap-3 flex-wrap pt-1">
                                <div className="flex items-baseline gap-0.5 text-foreground select-all">
                                    <span className="text-sm">S/</span>
                                    <span className="text-2xl md:text-3xl font-normal ">
                                        {precio.toFixed(2)}
                                    </span>
                                </div>

                                {hasDiscount && (
                                    <div className="flex items-center gap-2 ">
                                        <span className=" text-muted-foreground line-through">
                                            S/ {precioComparativo!.toFixed(2)}
                                        </span>
                                        <span className="  px-2 py-0.5 bg-destructive/10 text-destructive">
                                            −{Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stock agotado */}
                            {stock === 0 && (
                                <div className="pt-1 ">
                                    <span className="inline-flex items-center text-xs uppercase tracking-wider text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-1 ">
                                        Sin stock
                                    </span>
                                </div>
                            )}

                        </header>

                        {/* Atributos y Variantes */}
                        {Object.entries(allAttributes).map(([key]) => {
                            const availableValues = getAvailableValues(key);
                            const isColor = key.toLowerCase() === "color";
                            const useDropdown = !isColor && availableValues.length > MAX_VISIBLE_OPTIONS;

                            return (
                                <fieldset key={key} className="space-y-1.5">
                                    <legend className="text-xs font-semibold uppercase text-muted-foreground tracking-wider ">
                                        {key}:
                                    </legend>

                                    {isColor ? (
                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
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
                                                            "relative group flex flex-col items-center justify-between gap-2 p-2  border w-full transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                                            selected
                                                                ? "border-foreground bg-background shadow-xs ring-1 ring-foreground"
                                                                : "border-border bg-background-secondary/40 hover:bg-background-secondary hover:border-muted-foreground/60",
                                                            outOfStock && "opacity-40 cursor-not-allowed bg-muted-neutral/40"
                                                        )}
                                                    >
                                                        <div className={cn("relative w-9 h-9 overflow-hidden rounded-full border border-border shrink-0 flex items-center justify-center bg-card", outOfStock && "grayscale")}>
                                                            {variantForValue?.imagenes?.[0] ? (
                                                                <Image
                                                                    src={variantForValue.imagenes[0]}
                                                                    alt={val}
                                                                    fill
                                                                    className="fill object-fill"
                                                                    quality={10}
                                                                    unoptimized
                                                                />
                                                            ) : (
                                                                <ColorCircle color={val} size={36} />
                                                            )}

                                                            {outOfStock && (
                                                                <span className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                                    <div className="w-[120%] border-t-2 border-destructive/70 -rotate-45" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className={cn("text-[11px] text-center truncate capitalize w-full tracking-tight ", selected ? "font-semibold text-foreground" : "font-semibold text-muted-foreground", outOfStock && "line-through")}>
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
                                            <SelectTrigger className="w-full border-border bg-card text-foreground focus:ring-ring font-semibold text-xs">
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
                                                            "h-9 px-4 relative overflow-hidden transition-all border text-xs font-semibold  cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring ",
                                                            selected
                                                                ? "border-foreground bg-background ring-1 ring-foreground text-foreground"
                                                                : "border-border bg-card text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground",
                                                            outOfStock && "opacity-40 text-muted-foreground/60 bg-background-secondary border-border cursor-not-allowed"
                                                        )}
                                                    >
                                                        <span className={cn(outOfStock && "line-through")}>{val}</span>

                                                        {outOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                                <div className="w-[110%] border-t-[1.5px] border-muted-foreground/40 -rotate-[15deg]" />
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </fieldset>
                            );
                        })}

                        {/* Botones de Acción Módulos */}
                        <section className="flex justify-between items-center gap-4 pt-4 ">
                            <div className="hidden md:flex flex-1">
                                <AddProductToCart
                                    product={producto}
                                    variant={selectedVariant ?? undefined}
                                Dino-prefetch
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
                    </div>

                    {showPaymentNotice && precio > 150 && (
                        <div className="pt-2">
                            <PaymentNotice price={precio} installments={6} />
                        </div>
                    )}

                    {/* Fichas de Logística de Tienda */}
                    <div className="divide-y divide-border/40 ">

                        {/* Medios de pago */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <CreditCard className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-semibold">Medios de pago:</span>
                            </div>
                            <div>
                                <PaymentMethods />
                            </div>
                        </div>

                        {/* Garantía */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <ShieldCheck className="w-4 h-4 shrink-0 text-foreground" />
                                <span className="text-xs font-semibold">Garantía de fábrica:</span>
                            </div>
                            <div className="text-right text-xs">
                                <span className="inline-flex items-center font-bold text-foreground bg-muted-neutral/30 px-2 py-0.5  border border-border/60">
                                    12 meses de garantía
                                </span>
                            </div>
                        </div>

                        {/* Envío */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <Truck className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Envío:
                                </span>
                            </div>
                            <div className="text-right text-xs">
                                <span className={cn(
                                    "font-bold block text-sm",
                                    isFreeShipping ? "text-action-cta" : "text-foreground"
                                )}>
                                    {isFreeShipping ? "Gratis" : ""}
                                </span>
                                <span className="text-muted-foreground font-medium text-xs block mt-0.5">
                                    Entrega: {getDeliveryRange(producto.diasEnvio || 1)}
                                </span>
                            </div>
                        </div>

                        {/* Consulta por WhatsApp */}
                        <a
                            href={`https://wa.me/51925054636?text=Consulta%20${encodeURIComponent(producto.nombre)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between py-3 hover:bg-background-secondary  px-1 -mx-1 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <div className="flex items-center gap-2.5 text-muted-foreground">
                                <GoLinkExternal className="w-3.5 h-3.5 text-muted-foreground inline-block mr-1" />
                                <span className="text-xs font-semibold">¿Deseas asesoría?</span>
                            </div>
                            <span className="text-xs font-semibold text-success flex items-center gap-1">
                                WhatsApp
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                        </a>

                        {/* Enlace institucional corregido */}
                        <div className="flex items-center justify-start gap-2.5">
                            <Link 
                                href="/politicas-de-cambios-y-devoluciones" 
                                prefetch={false}
                                className="flex items-center gap-2.5 text-muted-foreground text-xs font-semibold hover:text-action-cta transition-colors underline-offset-2 hover:underline py-3"
                            >
                                Ver políticas de cambios y devoluciones
                            </Link>
                        </div>

                        <div className="flex flex-row justify-between md:gap-x-4 gap-y-2 py-3 text-[10px] md:text-xs text-muted-foreground uppercase ">
                        </div>

                    </div>

                    <ProductComplementary complementarios={producto.complementarios} />

                </section>
            </article>

            <ProductExpandableSections producto={producto} />

            <div className="md:hidden fixed bottom-0 left-0 w-full bg-card p-4  shadow-lg z-50  pb-safe">
                <AddProductToCart
                    product={producto}
                    variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
                />
            </div>
        </>
    );
}