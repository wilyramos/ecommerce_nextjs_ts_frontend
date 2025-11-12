'use client';

import { useState, useEffect, useMemo } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import { Truck, ShieldCheck } from 'lucide-react';
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

        const matched = producto.variants?.find(v =>
            Object.keys(initialAttrs).every(k => initialAttrs[k] === v.atributos[k])
        ) ?? null;

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
        return Array.from(values);
    };

    const precio = selectedVariant?.precio ?? producto.precio ?? 0;
    const precioComparativo = selectedVariant?.precioComparativo ?? producto.precioComparativo ?? null;
    const stock =
        Object.keys(selectedAttributes).length === 0 || !selectedVariant
            ? producto.stock ?? 0
            : selectedVariant.stock ?? 0;

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

    return (
        <>
            <article className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto px-4 py-4">
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel
                        images={
                            selectedVariant?.imagenes && selectedVariant.imagenes.length > 0
                                ? selectedVariant.imagenes
                                : producto.imagenes ?? []
                        }
                    />
                </div>

                {/* Detalles */}
                <div>
                    <div className="space-y-6 bg-white p-4">
                        <header className="space-y-2">
                            <div className="flex justify-between uppercase">
                                {(selectedVariant?.sku || producto.sku) && (
                                    <span className="text-xs text-gray-400">
                                        SKU: {selectedVariant?.sku ?? producto.sku}
                                    </span>
                                )}
                                {(selectedVariant?.barcode || producto.barcode) && (
                                    <span className="text-xs text-gray-400">
                                        Código: {selectedVariant?.barcode ?? producto.barcode}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-lg md:text-2xl font-semibold leading-tight break-words whitespace-normal">
                                {producto.nombre}
                            </h1>

                            {/* Mostrar color solo si NO hay variantes */}
                            {!producto.variants?.length && colorAtributo && (
                                <div className="flex items-center gap-2 text-xs text-gray-700">
                                    {Array.isArray(colorAtributo)
                                        ? colorAtributo.map((c: string) => (
                                            <ColorCircle key={c} color={c} />
                                        ))
                                        : <ColorCircle color={colorAtributo} />}
                                </div>
                            )}

                            {/* Precio y descuento */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl flex items-baseline">
                                        <span className="text-sm mr-1">S/</span>
                                        <span>{precio.toFixed(2)}</span>
                                    </p>

                                    {precioComparativo !== null &&
                                        precioComparativo > precio && (
                                            <span className="bg-black text-white text-xs font-bold px-2 rounded-l-xl">
                                                -{Math.round(((precioComparativo - precio) / precioComparativo) * 100)}%
                                            </span>
                                        )}
                                </div>

                                {precioComparativo !== null &&
                                    precioComparativo > precio && (
                                        <div className="text-gray-400 text-sm">
                                            <span className="line-through">S/ {precioComparativo.toFixed(2)}</span>{" "}
                                            <span>Antes</span>
                                        </div>
                                    )}
                            </div>

                            {/* Stock */}
                            <span
                                className={`text-xs px-2 py-1 ${stock > 0 ? 'text-green-900 bg-green-100' : 'text-red-600 bg-red-100'}`}
                            >
                                {stock > 0 ? `${stock} disponible` : 'Agotado'}
                            </span>
                        </header>

                        {/* Selects de atributos */}
                        {Object.entries(allAttributes).map(([key]) => {
                            const availableValues = getAvailableValues(key);

                            return (
                                <section key={key} className="flex flex-col gap-1 mt-2">
                                    <label className="text-sm font-medium">{key}:</label>

                                    {/* Si el atributo es Color, mostrar círculos */}
                                    {key.toLowerCase() === "color" ? (
                                        <div className="flex items-center gap-3 flex-wrap mt-1">
                                            {availableValues.map(val => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                const selected = selectedAttributes[key] === val;
                                                return (
                                                    <button
                                                        key={val}
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        title={val}
                                                        className={` px-2 py-1 rounded-md border-2 transition cursor-pointer ${selected ? 'border-gray-800' : 'border-gray-200 hover:border-gray-500'
                                                            } ${outOfStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                                                    >
                                                        <ColorCircle color={val} />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : availableValues.length <= 5 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {availableValues.map(val => {
                                                const outOfStock = isOptionOutOfStock(key, val);
                                                return (
                                                    <Button
                                                        key={val}
                                                        variant={selectedAttributes[key] === val ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => !outOfStock && updateSelectedVariant(key, val)}
                                                        disabled={outOfStock}
                                                        className={outOfStock ? "opacity-40 cursor-not-allowed" : ""}
                                                    >
                                                        {val}
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
                                                <SelectValue placeholder={`-- Elige ${key} --`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableValues.map(val => {
                                                    const outOfStock = isOptionOutOfStock(key, val);
                                                    return (
                                                        <SelectItem
                                                            key={val}
                                                            value={val}
                                                            disabled={outOfStock}
                                                            className={outOfStock ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                                                        >
                                                            {val}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    )}
                                </section>
                            );
                        })}

                        {/* Variante seleccionada */}
                        {selectedVariant && (
                            <p className="text-xs mt-2 font-medium text-gray-600">
                                Variante Seleccionada: {selectedVariant.nombre} - S/ {selectedVariant.precio ?? producto.precio}
                            </p>
                        )}

                        {/* Acciones */}
                        <section className="flex justify-between items-center gap-4 mt-4">
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
                    <div className="space-y-3 mt-6 text-gray-700 text-xs">
                        <div className="bg-white p-4 flex items-start gap-3">
                            <Truck className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-800">Entrega</p>
                                <p>
                                    Gratis en Cañete y a todo el Perú mediante{" "}
                                    <span className="font-semibold italic bg-red-600 text-white px-1">SHALOM</span>.
                                </p>
                                <p className="mt-1">
                                    {producto.diasEnvio
                                        ? `Estimado: ${getDeliveryRange(producto.diasEnvio)}`
                                        : "Estimado: 1–3 días hábiles."}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white  p-4 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-800">Compra segura</p>
                                <p>Protección de tus datos y pagos.</p>
                            </div>
                        </div>

                        <div className="bg-white  p-4">
                            <p className="font-medium text-gray-800 mb-2">Medios de pago</p>
                            <div className="flex items-center flex-wrap gap-3">
                                <PaymentMethods />
                            </div>
                        </div>

                        <div className="bg-white  p-4">
                            <p>
                                ¿Tienes dudas? Contáctanos por{" "}
                                <a
                                    href={`https://wa.me/51925054636?text=Hola%2C%20queria%20consultar%20sobre%20${encodeURIComponent(producto.nombre)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline"
                                >
                                    WhatsApp
                                </a>.
                            </p>
                        </div>
                    </div>
                </div>
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
