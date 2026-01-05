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
            ? selectedVariant.imagenes
            : [
                ...(producto.imagenes ?? []),
                ...(
                    producto.variants?.flatMap(v => v.imagenes ?? []) ?? []
                )
            ].filter((img, idx, arr) => arr.indexOf(img) === idx);


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
            <article className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-6 max-w-7xl mx-auto py-2">
                {/* Imágenes */}
                <div className='md:col-span-3'>
                    <ImagenesProductoCarousel images={variantImages} />
                </div>

                {/* Detalles */}
                <section className='md:col-span-3'>
                    <div className="space-y-0 bg-white p-4">
                        <header className="pt-1 border-b pb-4 space-y-1">
                            {/* SKU y código */}
                            <div className="flex items-start justify-between w-full">
                                {producto.brand && (
                                    <Link
                                        href={`/productos?brand=${producto.brand.slug}`}
                                        className="text-xs font-semibold text-zinc-400 uppercase hover:text-gray-400"
                                    >
                                        {producto.brand.nombre}
                                    </Link>
                                )}

                                {(selectedVariant || producto.sku || producto.barcode) && (
                                    <div className="text-[8px] md:text-[12px] text-gray-400 uppercase flex flex-row items-end leading-tight gap-1">
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
                                <h1 className="text-md md:text-lg leading-snug text-gray-800 font-semibold">
                                    {producto.nombre}
                                </h1>
                            </div>

                            {/* Mostrar color solo si NO hay variantes */}
                            {!producto.variants?.length && colorAtributo && (
                                <div className="flex items-center gap-3">
                                    {/* Etiqueta sutil estilo metadata */}
                                    <span className="text-xs font-medium text-gray-500">
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
                                    <div className="flex items-baseline text-gray-900">
                                        <span className="text-sm font-medium mr-0.5">S/</span>
                                        <span className="text-2xl font-semibold tracking-tight">{precio.toFixed(2)}</span>
                                    </div>

                                    {hasDiscount && (
                                        <span className="text-xs md:text-sm text-gray-400 line-through decoration-gray-400">
                                            S/ {precioComparativo.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Discount Info: New line on mobile, Same line on desktop */}
                                {hasDiscount && (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                            -{Math.round(((precioComparativo - precio) / precioComparativo) * 100)}%
                                        </span>

                                        <span
                                            className={`text-xs font-medium text-blue-900 uppercase tracking-wide
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
                                        className={`text-xs font-medium px-2.5 py-1 flex items-center gap-1.5 w-fit transition-colors
                                        ${stock === 0
                                                ? "bg-gray-50 text-gray-400 border-gray-100"
                                                : "bg-yellow-300 text-gray-900 border-yellow-600"
                                            }`}
                                    >

                                        {stock === 0 ? "Agotado" : `¡Solo quedan ${stock}!`}
                                    </span>

                                    {stock > 0 && (
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">
                                            ¡Pídelo antes que se acabe!
                                        </span>
                                    )}
                                </div>
                            )}

                        </header>

                        {Object.entries(allAttributes).length > 0 && (
                            <p className="text-xs mb-3 text-gray-600 mt-4">
                                Seleccionar opciones:
                            </p>
                        )}

                        {Object.entries(allAttributes).map(([key]) => {
                            const availableValues = getAvailableValues(key);

                            return (
                                <fieldset key={key} className="mb-2 p-1">
                                    <legend className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-2">{key}:</legend>

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
                                                        className={`relative w-20 h-24 rounded border transition-colors
flex flex-col items-center justify-center p-1
${selected ? 'border-gray-800 ring-1 ring-gray-800' : 'border-gray-300 hover:border-gray-500'}
${outOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
`}

                                                    >
                                                        {/* Color (como Amazon: pequeño, arriba) */}
                                                        <div className="flex items-center justify-center">
                                                            <ColorCircle color={val} />
                                                        </div>

                                                        {/* Imagen (zona principal, centrada y consistente) */}
                                                        <div className="my-2 flex items-center justify-center bg-gray-100 ">
                                                            {variantForValue?.imagenes?.[0] && (
                                                                <div className="flex items-center justify-center bg-gray-100">
                                                                    <Image
                                                                        src={variantForValue.imagenes[0]}
                                                                        alt={`Variante ${val}`}
                                                                        width={36}
                                                                        height={36}
                                                                        className="object-cover h-7 w-7"
                                                                        quality={2}
                                                                    />
                                                                </div>
                                                            )}

                                                        </div>

                                                        {/* Nombre / etiqueta */}
                                                        <div className="flex w-full items-center justify-center px-1">
                                                            <span
                                                                className={`text-[11px] text-center truncate leading-tight
        ${selected ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}
                                                            >
                                                                {val}
                                                            </span>
                                                        </div>

                                                        {/* Precio (opcional, muy sutil como Amazon) */}
                                                        <div className="h-4 flex items-center justify-center">
                                                            {variantForValue?.precio && (
                                                                <span className="text-[9px] font-semibold text-gray-700">
                                                                    S/ {variantForValue.precio.toFixed(0)}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {outOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                                <div className="w-[80%] border-t-2 border-gray-500 border-dashed -rotate-45" />
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
                                                        className={`relative ${outOfStock ? "opacity-40 cursor-not-allowed font-bold uppercase rounded-none" : "cursor-pointer rounded-none font-medium"}`}
                                                    >
                                                        {val}
                                                        {outOfStock && (
                                                            <span
                                                                className="absolute top-1/2 left-1/2 w-[80%] border-t-2 border-gray-500 border-dashed"
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
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Seleccionar ${key}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableValues.map(val => {
                                                    const outOfStock = isOptionOutOfStock(key, val);
                                                    return (
                                                        <SelectItem
                                                            key={val}
                                                            value={val}
                                                            disabled={outOfStock}
                                                            className={`${outOfStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}`}
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

                        {/* Asi haya variante seleccionada o no, separar el espacio */}
                        {/* Separador invisible SOLO si existen variantes */}
                        {(producto.variants?.length ?? 0) > 0 && (
                            <div className="mt-1">
                                {/* Línea reservada: nunca empuja el contenido inferior */}
                                <p className="mt-1 h-2 text-xs font-medium text-gray-600 leading-4">
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
                    <div className="space-y-2 mt-2 text-gray-700 text-sm">
                        {/* Envío */}
                        <div className="bg-white py-2 md:px-4 flex items-start gap-4 px-4">
                            <div className="flex flex-wrap gap-x-2 flex-col">
                                <div className=" bg-white rounded-full  text-slate-700 flex flex-col">
                                    <p>
                                        Envíos <span className="font-semibold">gratuitos y contraentrega</span> en todo Cañete
                                    </p>
                                    <p>
                                        Envíos al resto del Perú mediante{" "}
                                        <span className="font-semibold italic bg-red-600 text-white px-1">SHALOM</span>
                                    </p>
                                </div>


                                <p className="border-l-2 border-blue-900 py-2 px-1 text-gray-600 bg-zinc-50  mt-1">
                                    {producto.diasEnvio
                                        ? `Recíbelo entre: ${getDeliveryRange(producto.diasEnvio)}`
                                        : "Recíbelo en 1–3 días hábiles"}
                                </p>
                            </div>
                        </div>

                        {/* Compra segura */}
                        <div className="bg-white md:px-4 flex items-center gap-4 px-4 py-2">
                            <div className="flex flex-col lg:flex-row lg:items-center md:justify-between w-full gap-2">
                                <p className="text-gray-600 whitespace-nowrap">Aceptamos los siguientes medios de pago:</p>
                                <div className="flex items-center flex-wrap gap-1 ">
                                    <PaymentMethods />
                                </div>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="bg-white px-4 py-2 text-center">
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

            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 border-t shadow-md z-50">
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