'use client';

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

type Props = {
    producto: ProductWithCategoryResponse;
};

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
        return Array.from(values).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    };

    // Lógica de imágenes ajustada
    const variantImages = useMemo(() => {
        // 1. Si hay variante seleccionada y tiene imágenes, mostrar SOLO esas
        if (selectedVariant?.imagenes && selectedVariant.imagenes.length > 0) {
            return selectedVariant.imagenes.filter(Boolean);
        }

        // 2. Si no hay variante o no tiene imágenes, mostrar mezcla de generales + todas las variantes
        const generalImages = producto.imagenes ?? [];
        const allVariantsImages = producto.variants?.flatMap(v => v.imagenes ?? []) ?? [];
        
        const combined = [...generalImages, ...allVariantsImages]
            .filter(Boolean)
            .filter((img, idx, arr) => arr.indexOf(img) === idx); // Eliminar duplicados

        return combined.length > 0 ? combined : ["/placeholder-product.png"]; // Fallback a imagen por defecto
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
            <article className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-6 mx-auto py-2">
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

                            <h1 className="text-2xl md:text-3xl font-semibold text-[var(--store-text)] tracking-tight leading-tight">
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
                                        <span className="bg-[var(--store-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            -{Math.round(((precioComparativo - precio) / precioComparativo) * 100)}%
                                        </span>
                                        <div className="w-28 h-4 relative overflow-hidden">
                                            <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-full text-[10px] sm:text-xs font-medium text-[var(--store-primary)] uppercase tracking-wide transition-all duration-300 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                                                {discountList[discountIndex]}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {stock <= 5 && stock > 0 && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-xs font-medium mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                    Solo quedan {stock} unidades. ¡Pídelo pronto!
                                </div>
                            )}
                        </header>

                        {Object.entries(allAttributes).map(([key]) => {
                            const availableValues = getAvailableValues(key);
                            return (
                                <fieldset key={key} className="space-y-2 mt-4">
                                    <legend className="text-sm font-bold text-[var(--store-text-muted)] uppercase tracking-wider mb-3">{key}:</legend>
                                    
                                    {key.toLowerCase() === "color" ? (
                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {availableValues.map((val) => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;
                                                // Buscar la variante específica para este valor para obtener su imagen
                                                const variantForValue = producto.variants?.find(v => v.atributos[key] === val);

                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        className={cn(
                                                            "relative group flex flex-col items-center justify-between gap-2 p-1 rounded-xl border w-full transition-all duration-200",
                                                            selected ? "border-[var(--store-primary)] border-2" : "border-[var(--store-border)] bg-white/50",
                                                            outOfStock && "opacity-50 grayscale cursor-not-allowed"
                                                        )}
                                                    >
                                                        <div className="relative w-10 h-10 overflow-hidden rounded-full border border-black/5">
                                                            {variantForValue?.imagenes?.[0] ? (
                                                                <Image src={variantForValue.imagenes[0]} alt={val} fill className="object-cover" quality={30} />
                                                            ) : (
                                                                <ColorCircle color={val} size={40} />
                                                            )}
                                                        </div>
                                                        <span className={cn("text-xs text-center truncate w-full", selected ? "font-bold" : "font-medium")}>{val}</span>
                                                        {outOfStock && <span className="absolute inset-0 flex items-center justify-center"><div className="w-[70%] border-t-2 border-muted-foreground/70 -rotate-45" /></span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
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
                                                        className={cn("h-10 px-4 rounded-md", selected && "bg-[var(--store-primary)] shadow-md scale-[1.02]")}
                                                    >
                                                        {val}
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
                                <AddProductToCart product={producto} variant={selectedVariant ?? undefined} />
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
                                <p>Resto del Perú: Envíos mediante <span className="bg-red-600 text-white px-2 font-medium">SHALOM</span></p>
                            </div>
                            <div className="flex gap-2 bg-[var(--store-bg)] rounded-lg p-3">
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
                            <a href={`https://wa.me/51925054636?text=Consulta%20${encodeURIComponent(producto.nombre)}`} target="_blank" className="flex items-center gap-2 text-sm hover:text-[#25D366] transition-colors">
                                <MessageCircle className="w-4 h-4" /> ¿Tienes dudas? <span className="underline underline-offset-4">WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </section>
            </article>

            <ProductExpandableSections producto={producto} />

            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--store-surface)] p-4 border-t border-[var(--store-border)] shadow-md z-50">
                <AddProductToCart product={producto} variant={allAttributesSelected ? selectedVariant ?? undefined : undefined} />
            </div>
        </>
    );
}