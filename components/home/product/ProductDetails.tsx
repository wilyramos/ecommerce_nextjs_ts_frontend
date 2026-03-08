"use client";

import { useState, useEffect, useMemo } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import ProductExpandableSections from './ProductExpandableSections ';
import { cn, getDeliveryRange } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import PaymentMethods from '../PaymentMethods';
import ColorCircle from '@/components/ui/ColorCircle';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, MapPin, MessageCircle } from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

type Props = {
    producto: ProductWithCategoryResponse;
};

const MAX_VISIBLE_OPTIONS = 10;

export default function ProductDetails({ producto }: Props) {
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<TApiVariant | null>(null);
    const searchParams = useSearchParams();

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
        window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
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

    const discountList = ['¡Oferta!', '¡Descuento!', '¡Ahorra ahora!', '¡Promoción!', '¡Precio especial!'];
    const [discountIndex, setDiscountIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setDiscountIndex((prev) => (prev + 1) % discountList.length);
                setVisible(true);
            }, 300);
        }, 2000);
        return () => clearInterval(interval);
    }, [discountList.length]);

    return (
        <>
            <article className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-6 mx-auto">
                <div className='md:col-span-3'>
                    <ImagenesProductoCarousel images={variantImages} />
                </div>

                <section className='md:col-span-3'>
                    <div className="space-y-0 bg-[var(--store-surface)] p-4">
                        <header className="pt-1 border-b border-[var(--store-border)] pb-4 space-y-1">
                            <div className="flex items-start justify-between w-full">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    {producto.brand && (
                                        <Link href={`/catalogo/${producto.brand.slug}`} className="text-xs font-semibold text-[var(--store-text-muted)] uppercase hover:text-[var(--store-text)] transition-colors">
                                            {producto.brand.nombre}
                                        </Link>
                                    )}
                                    {producto.brand && producto.line && <span className="text-xs text-[var(--store-text-muted)]">/</span>}
                                    {producto.line && (
                                        <Link href={`/catalogo/${producto.line.slug}`} className="text-xs font-semibold text-[var(--store-text-muted)] uppercase hover:text-[var(--store-text)] transition-colors">
                                            {producto.line.nombre}
                                        </Link>
                                    )}
                                </div>
                                <div className="text-[8px] md:text-[12px] text-[var(--store-text-muted)] uppercase flex flex-row items-end leading-tight gap-1 text-right">
                                    {(selectedVariant?.sku || producto.sku) && <span>SKU: {selectedVariant?.sku || producto.sku}</span>}
                                    {(selectedVariant?.sku || producto.sku) && (selectedVariant?.barcode || producto.barcode) && <span>|</span>}
                                    {selectedVariant?.barcode || producto.barcode}
                                </div>
                            </div>

                            <h1 className="text-[clamp(1.25rem,3vw,2.25rem)] font-semibold text-[var(--store-text)] tracking-tight leading-[1.1] break-words">
                                {producto.nombre}
                            </h1>

                            {!producto.variants?.length && colorAtributo && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-medium text-[var(--store-text-muted)]">Color</span>
                                    <div className="flex items-center gap-1.5">
                                        {(Array.isArray(colorAtributo) ? colorAtributo : [colorAtributo]).map((c) => (
                                            <ColorCircle key={c} color={c} size={20} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center items-start gap-2 sm:gap-4 w-full">
                                <div className="flex items-baseline gap-2">
                                    <div className="flex items-baseline text-[var(--store-text)]">
                                        <span className="text-sm font-medium mr-0.5">S/</span>
                                        <span className="text-2xl md:text-3xl font-semibold tracking-tight">{precio.toFixed(2)}</span>
                                    </div>
                                    {hasDiscount && (
                                        <span className="text-xs md:text-sm text-[var(--store-text-muted)] line-through">
                                            S/ {precioComparativo.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {hasDiscount && (
                                    <div className="flex items-center gap-2 select-none">
                                        <span className="bg-[var(--store-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                                            -{Math.round(((precioComparativo - precio) / precioComparativo) * 100)}%
                                        </span>

                                        <div className="relative inline-grid h-4 items-center">
                                            <span className="invisible pointer-events-none text-[10px] sm:text-xs font-medium uppercase tracking-wide px-1 row-start-1 col-start-1">
                                                {discountList.reduce((a, b) => a.length > b.length ? a : b)}
                                            </span>

                                            <span
                                                key={discountIndex}
                                                className={cn(
                                                    "absolute left-0 text-[10px] sm:text-xs font-medium text-[var(--store-primary)] uppercase tracking-wide transition-all duration-300 row-start-1 col-start-1 whitespace-nowrap",
                                                    visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
                                                )}
                                            >
                                                {discountList[discountIndex]}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Manejo de estado Agotado General o Poco Stock */}
                            {stock <= 0 ? (
                                <div className="inline-flex items-center px-3 py-1.5 bg-red-50  rounded text-red-600 text-xs font-bold mt-2 uppercase tracking-wider w-fit">
                                    Agotado
                                </div>
                            ) : stock <= 5 ? (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded text-yellow-800 text-xs font-medium mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                    Solo quedan {stock} unidades. ¡Pídelo pronto!
                                </div>
                            ) : null}
                        </header>

                        {Object.entries(allAttributes).map(([key]) => {
                            const availableValues = getAvailableValues(key);
                            const isColor = key.toLowerCase() === "color";
                            const useDropdown = !isColor && availableValues.length > MAX_VISIBLE_OPTIONS;

                            return (
                                <fieldset key={key} className="space-y-2 mt-4">
                                    <legend className="text-sm font-bold text-[var(--store-text-muted)] uppercase tracking-wider mb-3">{key}:</legend>

                                    {isColor ? (
                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {availableValues.map((val) => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;
                                                const variantForValue = producto.variants?.find(v => v.atributos[key] === val);

                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        className={cn(
                                                            "relative group flex flex-col items-center justify-between gap-2 p-1 rounded border w-full transition-all duration-200",
                                                            selected ? "border-[var(--store-primary)] border-2" : "border-[var(--store-border)] bg-white/50",
                                                            outOfStock && "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200"
                                                        )}
                                                    >
                                                        <div className={cn("relative w-10 h-10 overflow-hidden rounded-full border border-black/5 flex-shrink-0", outOfStock && "grayscale")}>
                                                            {variantForValue?.imagenes?.[0] ? (
                                                                <Image src={variantForValue.imagenes[0]} alt={val} fill className="object-cover" quality={30} unoptimized />
                                                            ) : (
                                                                <ColorCircle color={val} size={40} />
                                                            )}
                                                            
                                                            {outOfStock && (
                                                                <span className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                                    <div className="w-[120%] border-t-[3px] border-red-500/80 -rotate-45" />
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className={cn("text-xs text-center truncate w-full", selected ? "font-bold" : "font-medium", outOfStock && "line-through text-gray-400")}>
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
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={`Selecciona una opción`} />
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
                                                                "cursor-pointer",
                                                                outOfStock && "opacity-50 cursor-not-allowed focus:bg-transparent"
                                                            )}
                                                        >
                                                            <div className="flex items-center justify-between w-full gap-4">
                                                                <span className={cn(outOfStock && "line-through text-muted-foreground")}>{val}</span>
                                                                
                                                                {outOfStock && (
                                                                    <span className="text-[10px] uppercase tracking-wider text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">
                                                                        Agotado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex flex-wrap gap-2.5">
                                            {availableValues.map((val) => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;
                                                return (
                                                    <Button
                                                        key={val}
                                                        variant={selected ? "default" : "outline"}
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        className={cn(
                                                            "h-10 px-4 rounded relative overflow-hidden transition-all",
                                                            selected && "bg-[var(--store-primary)] shadow-md scale-[1.02]",
                                                            outOfStock && "opacity-50 text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <span className={cn(outOfStock && "line-through")}>{val}</span>
                                                        
                                                        {outOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                                <div className="w-[110%] border-t-[1.5px] border-gray-400/60 -rotate-[15deg]" />
                                                            </span>
                                                        )}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </fieldset>
                            );
                        })}

                        <section className="flex justify-between items-center gap-4 mt-8">
                            <div className="hidden md:flex flex-1">
                                <AddProductToCart 
                                    product={producto} 
                                    variant={selectedVariant ?? undefined} 
                                    // Considera pasar una prop disabled a este componente si no lo maneja internamente
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

                    <div className="mt-8 bg-[var(--store-surface)] divide-y divide-[var(--store-border)]">
                        <div className="p-5 space-y-4">
                            <h3 className="text-sm font-semibold text-[var(--store-text)]">Opciones de Envío:</h3>
                            <div className="text-sm text-[var(--store-text-muted)] space-y-2">
                                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Cañete: <span className="text-[var(--store-primary)] font-medium">Gratis y Contraentrega</span></p>
                                <p>Resto del Perú: Envíos mediante <span className="bg-red-600 text-white px-1 italic font-medium">SHALOM</span></p>
                            </div>
                            <div className="flex gap-2 bg-[var(--store-bg)] rounded p-3">
                                <CalendarDays className="w-4 h-4 mt-0.5" />
                                <div className="text-xs">
                                    <span className="font-semibold block">Estimación de entrega</span>
                                    {producto.diasEnvio ? getDeliveryRange(producto.diasEnvio) : "1–3 días hábiles"}
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-sm font-semibold mb-3">Medios de pago:</h3>
                            <PaymentMethods />
                        </div>
                        <div className="p-4 flex justify-center">
                            <a href={`https://wa.me/51925054636?text=Consulta%20${encodeURIComponent(producto.nombre)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-[#25D366] transition-colors">
                                <MessageCircle className="w-4 h-4" /> ¿Tienes dudas? <span className="underline underline-offset-4">WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </section>
            </article>

            <ProductExpandableSections producto={producto} />

            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--store-surface)] p-4 border-t border-[var(--store-border)] shadow-md z-50">
                <AddProductToCart 
                    product={producto} 
                    variant={allAttributesSelected ? selectedVariant ?? undefined : undefined} 
                />
            </div>
        </>
    );
}