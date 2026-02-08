'use client';

import { useState, useEffect, useMemo } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import ProductExpandableSections from './ProductExpandableSections ';
import { cn, getDeliveryRange } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
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

    // Recolectar todos los atributos de las variantes
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

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl);
    };

    const getAvailableValues = (attrKey: string): string[] => {
        const values = new Set<string>();
        producto.variants?.forEach(variant => {
            const matchesOtherAttrs = Object.entries(selectedAttributes)
                .every(([key, value]) => key === attrKey || variant.atributos[key] === value);
            if (matchesOtherAttrs) values.add(variant.atributos[attrKey]);
        });

        return Array.from(values).sort((a, b) =>
            a.localeCompare(b, undefined, { sensitivity: "base" })
        );
    };

    const precio = selectedVariant?.precio ?? producto.precio ?? 0;
    const precioComparativo = selectedVariant?.precioComparativo ?? producto.precioComparativo ?? null;
    const stock =
        Object.keys(selectedAttributes).length === 0 || !selectedVariant
            ? producto.stock ?? 0
            : selectedVariant.stock ?? 0;

    const hasDiscount = precioComparativo !== null && precioComparativo > precio;

    const allAttributesSelected = Object.keys(allAttributes).every(key => selectedAttributes[key]);

    const isOptionOutOfStock = (attrKey: string, attrValue: string) => {
        const variant = producto.variants?.find(v =>
            v.atributos[attrKey] === attrValue &&
            Object.entries(selectedAttributes).every(
                ([key, value]) => key === attrKey || v.atributos[key] === value
            )
        );
        return variant?.stock === 0;
    };

    // Color del producto sin variantes
    const colorAtributo =
        !producto.variants?.length &&
        (producto.atributos?.color ||
            producto.atributos?.Color ||
            producto.atributos?.COLOR ||
            null);

    const variantImages =
        selectedVariant?.imagenes && selectedVariant.imagenes.length > 0
            ? selectedVariant.imagenes.filter(img => Boolean(img))
            : [
                ...(producto.imagenes ?? []),
                ...(producto.variants?.flatMap(v => v.imagenes ?? []) ?? [])
            ]
                .filter(img => Boolean(img))
                .filter((img, idx, arr) => arr.indexOf(img) === idx);



    // Palabras dinamicas para mostrar descuento 
    const discountList = [
        '¡Oferta!',
        '¡Descuento!',
        '¡Ahorra ahora!',
        '¡Promoción!',
        '¡Precio especial!'
    ];

    const [discountIndex, setDiscountIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);

            setTimeout(() => {
                setDiscountIndex((prev) => (prev + 1) % discountList.length);
                setVisible(true);
            }, 300); // duración de salida
        }, 2000);

        return () => clearInterval(interval);
    }, [discountList.length]);

    return (
        <>
            <article className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-6 mx-auto py-2">
                {/* Imágenes */}
                <div className='md:col-span-3'>
                    <ImagenesProductoCarousel images={variantImages} />
                </div>

                {/* Detalles */}
                <section className='md:col-span-3'>
                    <div className="space-y-0 bg-[var(--store-surface)] p-4">
                        <header className="pt-1 border-b border-[var(--store-border)] pb-4 space-y-1">
                            {/* SKU y código */}
                            <div className="flex items-start justify-between w-full">
                                {producto.brand && (
                                    <Link
                                        href={`/productos?brand=${producto.brand.slug}`}
                                        className="text-xs font-semibold text-[var(--store-text-muted)] uppercase hover:text-[var(--store-text)] transition-colors"
                                    >
                                        {producto.brand.nombre}
                                    </Link>
                                )}

                                {(selectedVariant || producto.sku || producto.barcode) && (
                                    <div className="text-[8px] md:text-[12px] text-[var(--store-text-muted)] uppercase flex flex-row items-end leading-tight gap-1">
                                        {(selectedVariant?.sku || producto.sku) && (
                                            <span>SKU: {selectedVariant ? selectedVariant.sku : producto.sku} |</span>
                                        )}

                                        {(selectedVariant?.barcode || producto.barcode) && (
                                            <span>{selectedVariant ? selectedVariant.barcode : producto.barcode}</span>
                                        )}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-semibold text-[var(--store-text)] tracking-tight leading-tight">
                                {producto.nombre}
                            </h1>

                            {/* Mostrar color solo si NO hay variantes */}
                            {!producto.variants?.length && colorAtributo && (
                                <div className="flex items-center gap-3">
                                    {/* Etiqueta sutil estilo metadata */}
                                    <span className="text-xs font-medium text-[var(--store-text-muted)]">
                                        Color
                                    </span>

                                    {/* Contenedor de círculos */}
                                    <div className="flex items-center gap-1.5">
                                        {(Array.isArray(colorAtributo) ? colorAtributo : [colorAtributo]).map((c) => (
                                            <ColorCircle
                                                key={c}
                                                color={c}
                                                size={14}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-row items-center gap-1 md:gap-3">
                                {/* Price Block: Always grouped together */}
                                <div className="flex items-baseline gap-2">
                                    <div className="flex items-baseline text-[var(--store-text)]">
                                        <span className="text-sm font-medium mr-0.5">S/</span>
                                        <span className="text-2xl font-semibold tracking-tight">{precio.toFixed(2)}</span>
                                    </div>

                                    {hasDiscount && (
                                        <span className="text-xs md:text-sm text-[var(--store-text-muted)] line-through decoration-[var(--store-text-muted)]">
                                            S/ {precioComparativo.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Discount Info */}
                                {hasDiscount && (
                                    <div className="flex items-center gap-2">
                                        {/* Badge rojo estilo Apple para el % de ahorro */}
                                        <span className="bg-[var(--store-primary)] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            -{Math.round(((precioComparativo - precio) / precioComparativo) * 100)}%
                                        </span>

                                        <span
                                            className={`text-xs font-medium text-[var(--store-primary)] uppercase tracking-wide
                    transition-all duration-300 ease-in-out
                    ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}
                `}
                                        >
                                            {discountList[discountIndex]}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Stock */}
                            {stock <= 5 && stock > 0 && (
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-xs font-medium mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                                    Solo quedan {stock} unidades. ¡Pídelo pronto!
                                </div>
                            )}

                        </header>

                        {Object.entries(allAttributes).length > 0 && (
                            <p className="text-xs mb-3 text-[var(--store-text-muted)] mt-4">
                                Seleccionar opciones:
                            </p>
                        )}

                        {Object.entries(allAttributes).map(([key]) => {
                            const availableValues = getAvailableValues(key);

                            return (
                                <fieldset key={key} className="space-y-2">
                                    <legend className="text-sm font-bold text-[var(--store-text-muted)] uppercase tracking-wider mb-3">
                                        {key}:
                                    </legend>

                                    {key.toLowerCase() === "color" ? (
                                        /* USO DE GRID EN LUGAR DE FLEX PARA MEJOR RESPONSIVIDAD */
                                        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                            {availableValues.map((val) => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;

                                                const variantForValue = producto.variants?.find(
                                                    (v) =>
                                                        v.atributos[key] === val &&
                                                        Object.entries(selectedAttributes).every(
                                                            ([k, v2]) => k === key || v.atributos[k] === v2
                                                        )
                                                );

                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        title={val}
                                                        /* CAMBIOS: w-full, sin min-w fijo, transiciones suaves, ring-offset para que el borde no pegue */
                                                        className={cn(
                                                            "relative group flex flex-col items-center justify-between gap-2 p-1 rounded-xl border w-full transition-all duration-200 ease-in-out",
                                                            selected
                                                                ? "border-[var(--store-primary)]  border-2  "
                                                                : "border-[var(--store-border)] hover:border-[var(--store-text-muted)] hover:shadow-md bg-white/50",
                                                            outOfStock && "opacity-50 grayscale cursor-not-allowed"
                                                        )}
                                                    >
                                                        {/* Color / Imagen - Tamaño ligeramente ajustado */}
                                                        <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden rounded-full border border-black/5 shadow-sm group-hover:scale-105 transition-transform">
                                                            {variantForValue?.imagenes?.[0] ? (
                                                                <Image
                                                                    src={variantForValue.imagenes[0]}
                                                                    alt={val}
                                                                    fill
                                                                    className="object-cover"
                                                                    quality={30} // Subido un poco la calidad para retina
                                                                />
                                                            ) : (
                                                                <ColorCircle color={val} />
                                                            )}
                                                        </div>

                                                        {/* Nombre / etiqueta */}
                                                        <div className="flex w-full items-center justify-center px-1">
                                                            <span
                                                                className={`text-xs text-center truncate leading-tight transition-colors
                                            ${selected
                                                                        ? 'font-bold text-[var(--store-text)]'
                                                                        : 'font-medium text-[var(--store-text-muted)] group-hover:text-[var(--store-text)]'
                                                                    }`}
                                                            >
                                                                {val}
                                                            </span>
                                                        </div>

                                                        {/* Precio */}
                                                        <div className="h-4 flex items-center justify-center">
                                                            {variantForValue?.precio && (
                                                                <span className="text-[10px] font-bold text-[var(--store-text-muted)] bg-[var(--store-surface)] px-2 py-0.5 rounded-full">
                                                                    S/ {variantForValue.precio.toFixed(0)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {outOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                                                <div className="w-[70%] border-t-2 border-[var(--store-text-muted)]/70 border-dashed -rotate-45" />
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : availableValues.length <= 6 ? (
                                        <div className="flex flex-wrap gap-2.5">
                                            {availableValues.map((val) => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;
                                                return (
                                                    <Button
                                                        key={val}
                                                        variant={selected ? "default" : "outline"}
                                                        size="sm" // Puedes cambiar a 'default' si quieres botones más altos en móvil
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        /* CAMBIOS: rounded-md (más moderno), min-w para touch target, transiciones */
                                                        className={`relative h-10 px-4 min-w-[3.5rem] rounded-md font-medium transition-all duration-200
                                    ${selected
                                                                ? "bg-[var(--store-primary)] text-[var(--store-primary-text)] shadow-md transform scale-[1.02]"
                                                                : "border-[var(--store-border)] text-[var(--store-text)] bg-transparent hover:bg-[var(--store-surface)] hover:text-[var(--store-text)] hover:border-[var(--store-text-muted)]"
                                                            }
                                    ${outOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                                `}
                                                    >
                                                        {val}
                                                        {outOfStock && (
                                                            <span
                                                                className="absolute top-1/2 left-1/2 w-[80%] border-t-[1.5px] border-current border-dashed opacity-70"
                                                                style={{ transform: "translate(-50%, -50%) rotate(-15deg)" }}
                                                            />
                                                        )}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <Select
                                            value={selectedAttributes[key] || ""}
                                            onValueChange={(value) => updateSelectedVariant(key, value)}
                                        >
                                            {/* SelectTrigger ancho completo para móvil */}
                                            <SelectTrigger className="w-full h-11 border-[var(--store-border)] text-[var(--store-text)] rounded-md shadow-sm focus:ring-1 focus:ring-[var(--store-primary)]">
                                                <SelectValue placeholder={`Seleccionar ${key}`} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--store-surface)] border-[var(--store-border)] shadow-xl rounded-md">
                                                {availableValues.map((val) => {
                                                    const outOfStock = isOptionOutOfStock(key, val);
                                                    return (
                                                        <SelectItem
                                                            key={val}
                                                            value={val}
                                                            disabled={outOfStock}
                                                            className={`py-2.5 ${outOfStock
                                                                ? "opacity-50 line-through text-[var(--store-text-muted)]"
                                                                : "cursor-pointer text-[var(--store-text)] focus:bg-[var(--store-bg)]"
                                                                }`}
                                                        >
                                                            {val}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </fieldset>
                            );
                        })}

                        {/* Separador invisible SOLO si existen variantes */}
                        {(producto.variants?.length ?? 0) > 0 && (
                            <div className="mt-1">
                                <p className="mt-1 h-2 text-xs font-medium text-[var(--store-text-muted)] leading-4">
                                    {selectedVariant
                                        ? `Variante seleccionada: ${selectedVariant.nombre} - S/ ${selectedVariant.precio ?? producto.precio
                                        }`
                                        : "\u00A0"}
                                </p>
                            </div>
                        )}




                        {/* Acciones */}
                        <section className="flex justify-between items-center gap-4 mt-4 md:pt-4">
                            <div className="hidden md:flex flex-1">
                                <AddProductToCart
                                    product={producto}
                                    variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
                                />
                            </div>
                            <div className="flex-1">
                                <ShopNowButton
                                    disabled={
                                        ((producto.variants?.length ?? 0) > 0 && (!allAttributesSelected || !selectedVariant)) ||
                                        stock <= 0
                                    }
                                    product={producto}
                                    variant={selectedVariant ?? undefined}
                                />
                            </div>
                        </section>
                    </div>

                    {/* Información Adicional - Responsive */}
                    <div className="mt-6 sm:mt-8 bg-[var(--store-surface)] divide-y divide-[var(--store-border)]">

                        {/* 1. Envío */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">


                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1 text-[var(--store-text)]">
                                        Opciones de Envío:
                                    </h3>

                                    <div className="text-sm text-[var(--store-text-muted)] space-y-2">
                                        <p className="flex flex-wrap items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                                            <span>
                                                Cañete:
                                                <span className="ml-1 text-[var(--store-primary)] font-medium">
                                                    Gratis y Contraentrega
                                                </span>
                                            </span>
                                        </p>

                                        <p className="leading-relaxed">
                                            Resto del Perú: Envíos mediante{" "}
                                            <span className="inline-block font-medium text-white bg-red-600 px-2 py-0.5 rounded">
                                                SHALOM
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 bg-[var(--store-bg)] rounded-lg p-3">
                                    <CalendarDays className="w-4 h-4 text-[var(--store-text-muted)] mt-0.5 shrink-0" />
                                    <div className="text-xs text-[var(--store-text)]">
                                        <span className="font-semibold block mb-0.5">
                                            Estimación de entrega
                                        </span>
                                        {producto.diasEnvio
                                            ? getDeliveryRange(producto.diasEnvio)
                                            : "Disponible para envío en 1–3 días hábiles"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Pagos */}
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4">


                            <div className="flex-1">
                                <h3 className="text-sm font-semibold mb-2 text-[var(--store-text)]">
                                    Medios de pago:
                                </h3>

                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <PaymentMethods />
                                </div>
                            </div>
                        </div>

                        {/* 3. WhatsApp */}
                        <div className="p-4 flex justify-center text-center">
                            <a
                                href={`https://wa.me/51925054636?text=Hola%2C%20quería%20consultar%20sobre%20${encodeURIComponent(producto.nombre)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[var(--store-text-muted)] hover:text-[#25D366] transition-colors"
                            >
                                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span>
                                    ¿Tienes dudas?{" "}
                                    <span className="underline decoration-dotted underline-offset-4">
                                        Escríbenos al WhatsApp
                                    </span>
                                </span>
                            </a>
                        </div>
                    </div>


                </section>
            </article>

            <section className="mx-auto">
                <ProductExpandableSections producto={producto} />
            </section>

            {/* Barra fija inferior Mobile: fondo blanco superficie y borde sutil */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--store-surface)] p-4 border-t border-[var(--store-border)] shadow-md z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-center w-full">
                    <AddProductToCart
                        product={producto}
                        variant={allAttributesSelected ? selectedVariant ?? undefined : undefined}
                    />
                </div>
            </div>
        </>
    );
}