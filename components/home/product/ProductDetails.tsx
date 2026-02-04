'use client';

import { useState, useEffect, useMemo } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import ProductExpandableSections from './ProductExpandableSections ';
import { getDeliveryRange } from '@/lib/utils';
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

                            <div>
                                <h1 className="text-md md:text-lg leading-snug text-[var(--store-text)] font-semibold">
                                    {producto.nombre}
                                </h1>
                            </div>

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
                            {stock <= 3 && (
                                <div className="flex items-center gap-2 mt-2">
                                    <span
                                        className={`text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 w-fit transition-colors rounded
                                    ${stock === 0
                                                ? "bg-[var(--store-bg)] text-[var(--store-text-muted)] border border-[var(--store-border)]"
                                                : "bg-yellow-300 text-yellow-900 border border-yellow-400"
                                            }`}
                                    >

                                        {stock === 0 ? "Agotado" : `¡Solo quedan ${stock}!`}
                                    </span>

                                    {stock > 0 && (
                                        <span className="text-[10px] font-bold text-[var(--store-text-muted)] uppercase tracking-wide">
                                            ¡Pídelo antes que se acabe!
                                        </span>
                                    )}
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
                                <fieldset key={key} className="mb-2 p-1">
                                    <legend className="text-sm font-bold text-[var(--store-text-muted)] uppercase tracking-wide mb-2">{key}:</legend>

                                    {key.toLowerCase() === "color" ? (
                                        <div className="flex flex-wrap items-center gap-3">
                                            {availableValues.map(val => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;

                                                const variantForValue = producto.variants?.find(
                                                    v =>
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
                                                        className={`relative w-20 h-24 rounded border transition-all
flex flex-col items-center justify-center p-1
${selected
                                                                ? 'border-[var(--store-primary)] ring-1 ring-[var(--store-primary)]'
                                                                : 'border-[var(--store-border)] hover:border-[var(--store-text-muted)]'
                                                            }
${outOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
`}

                                                    >
                                                        {/* Color */}
                                                        <div className="flex items-center justify-center">
                                                            <ColorCircle color={val} />
                                                        </div>

                                                        {/* Imagen: Fondo gris muy claro para contrastar con el blanco del componente */}
                                                        <div className="my-2 flex items-center justify-center bg-[var(--store-bg)] rounded-sm">
                                                            {variantForValue?.imagenes?.[0] && (
                                                                <div className="flex items-center justify-center bg-[var(--store-bg)]">
                                                                    <Image
                                                                        src={variantForValue.imagenes[0]}
                                                                        alt={`Variante ${val}`}
                                                                        width={36}
                                                                        height={36}
                                                                        className="object-cover h-7 w-7 mix-blend-multiply"
                                                                        quality={2}
                                                                    />
                                                                </div>
                                                            )}

                                                        </div>

                                                        {/* Nombre / etiqueta */}
                                                        <div className="flex w-full items-center justify-center px-1">
                                                            <span
                                                                className={`text-[11px] text-center truncate leading-tight
        ${selected ? 'font-semibold text-[var(--store-text)]' : 'font-medium text-[var(--store-text-muted)]'}`}
                                                            >
                                                                {val}
                                                            </span>
                                                        </div>

                                                        {/* Precio */}
                                                        <div className="h-4 flex items-center justify-center">
                                                            {variantForValue?.precio && (
                                                                <span className="text-[9px] font-semibold text-[var(--store-text-muted)]">
                                                                    S/ {variantForValue.precio.toFixed(0)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {outOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                <div className="w-[80%] border-t-2 border-[var(--store-text-muted)] border-dashed -rotate-45" />
                                                            </span>
                                                        )}
                                                    </button>


                                                );
                                            })}
                                        </div>
                                    ) : availableValues.length <= 6 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {availableValues.map(val => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;
                                                return (
                                                    <Button
                                                        key={val}
                                                        variant={selected ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        /* Ajuste de estilos para el botón seleccionado y por defecto:
                                                           - Si está seleccionado: usa el estilo default (que debería mapear a primary en shadcn o lo forzamos aqui)
                                                           - Si no: usa el borde sutil
                                                        */
                                                        className={`relative rounded-none font-medium
                                                            ${selected
                                                                ? 'bg-[var(--store-primary)] text-[var(--store-primary-text)] hover:bg-[var(--store-primary-hover)]'
                                                                : 'border-[var(--store-border)] text-[var(--store-text)] hover:bg-[var(--store-bg)]'
                                                            }
                                                            ${outOfStock ? "opacity-40 cursor-not-allowed font-bold uppercase" : "cursor-pointer"}
                                                        `}
                                                    >
                                                        {val}
                                                        {outOfStock && (
                                                            <span
                                                                className="absolute top-1/2 left-1/2 w-[80%] border-t-2 border-[var(--store-text-muted)] border-dashed"
                                                                style={{ transform: 'translate(-50%, -50%) rotate(-45deg)' }}
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
                                            <SelectTrigger className="border-[var(--store-border)] text-[var(--store-text)]">
                                                <SelectValue placeholder={`Seleccionar ${key}`} />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[var(--store-surface)] border-[var(--store-border)]">
                                                {availableValues.map(val => {
                                                    const outOfStock = isOptionOutOfStock(key, val);
                                                    return (
                                                        <SelectItem
                                                            key={val}
                                                            value={val}
                                                            disabled={outOfStock}
                                                            className={`${outOfStock ? "opacity-40 cursor-not-allowed line-through text-[var(--store-text-muted)]" : "cursor-pointer text-[var(--store-text)]"}`}
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

                    {/* Información adicional */}
                    <div className="space-y-2 mt-2 text-[var(--store-text)] text-sm">
                        {/* Envío */}
                        <div className="bg-[var(--store-surface)] py-2 md:px-4 flex items-start gap-4 px-4">
                            <div className="flex flex-wrap gap-x-2 flex-col">
                                {/* Nota: Ajuste a variables. El fondo gris claro --store-bg destaca sobre el blanco --store-surface */}
                                <div className="text-[var(--store-text-muted)] flex flex-col px-3 py-2">
                                    <p>
                                        Envíos <span className="font-semibold text-[var(--store-text)]">gratuitos y contraentrega</span> en todo Cañete
                                    </p>
                                    <p>
                                        Envíos al resto del Perú mediante{" "}
                                        {/* SHALOM rojo se mantiene como marca */}
                                        <span className="font-semibold italic bg-[#D62828] text-white px-1">SHALOM</span>
                                    </p>
                                </div>


                                <p className="border-l-2 border-[var(--store-primary)] py-2 px-1 text-[var(--store-text-muted)] bg-[var(--store-bg)] mt-1">
                                    {producto.diasEnvio
                                        ? `Recíbelo entre: ${getDeliveryRange(producto.diasEnvio)}`
                                        : "Recíbelo en 1–3 días hábiles"}
                                </p>
                            </div>
                        </div>

                        {/* Compra segura */}
                        <div className="bg-[var(--store-surface)] md:px-4 flex items-center gap-4 px-4 py-2">
                            <div className="flex flex-col lg:flex-row lg:items-center md:justify-between w-full gap-2">
                                <p className="text-[var(--store-text-muted)] whitespace-nowrap">Aceptamos los siguientes medios de pago:</p>
                                <div className="flex items-center flex-wrap gap-1 ">
                                    <PaymentMethods />
                                </div>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="bg-[var(--store-surface)] px-4 py-2 text-center">
                            <p>
                                ¿Tienes dudas?{" "}
                                <a
                                    href={`https://wa.me/51925054636?text=Hola%2C%20quería%20consultar%20sobre%20${encodeURIComponent(producto.nombre)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 font-medium underline"
                                >
                                    Contáctanos por WhatsApp
                                </a>.
                            </p>
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