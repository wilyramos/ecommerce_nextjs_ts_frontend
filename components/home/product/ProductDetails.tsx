'use client';

import { useState } from 'react';
import AddProductToCart from './AddProductToCart';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse, TApiVariant } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import { Truck, ShieldCheck } from "lucide-react";
import ProductExpandableSections from './ProductExpandableSections ';
import { getDeliveryRange } from '@/lib/utils';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue    
 } from '@/components/ui/select';

type Props = {
    producto: ProductWithCategoryResponse;
};

export default function ProductDetails({ producto }: Props) {
    const [selectedVariant, setSelectedVariant] = useState<TApiVariant | null>(
        producto.variants?.[0] ?? null
    );

    // Estado para los atributos seleccionados
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(
        selectedVariant?.atributos ?? {}
    );

    // Solo crear selects si el producto tiene variantes
    const allAttributes: Record<string, string[]> = {};
    if (producto.variants && producto.variants.length > 0) {
        producto.variants.forEach((v) => {
            Object.entries(v.atributos).forEach(([key, value]) => {
                if (!allAttributes[key]) allAttributes[key] = [];
                if (!allAttributes[key].includes(value)) allAttributes[key].push(value);
            });
        });
    }

    const updateSelectedVariant = (attrKey: string, attrValue: string) => {
        const newAttributes = { ...selectedAttributes, [attrKey]: attrValue };
        setSelectedAttributes(newAttributes);

        const matchedVariant = producto.variants?.find(v =>
            Object.entries(newAttributes).every(([k, val]) => v.atributos[k] === val)
        ) ?? null;

        setSelectedVariant(matchedVariant);
    };

    const precio = selectedVariant?.precio ?? producto.precio ?? 0;
    const precioComparativo = selectedVariant?.precioComparativo ?? producto.precioComparativo ?? null;
    const descuento = precioComparativo
        ? Math.round(((precioComparativo - precio) / precioComparativo) * 100)
        : null;

    const stock = selectedVariant?.stock ?? producto.stock ?? 0;

    return (
        <>
            <article className="mx-auto grid gap-4 md:grid-cols-2 items-start max-w-7xl pb-4">
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel images={selectedVariant?.imagenes ?? producto.imagenes ?? []} />
                </div>

                {/* Detalles */}
                <div>
                    <div className="space-y-6 bg-white rounded-xl p-4 shadow-sm">
                        {/* Título, SKU, Barcode */}
                        <header className="space-y-2">
                            <div className='flex justify-between uppercase'>
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

                            {/* Precio y descuento */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl flex items-baseline">
                                        <span className="text-sm mr-1">S/</span>
                                        <span>{precio.toFixed(2)}</span>
                                    </p>
                                    {descuento && (
                                        <span className="bg-black text-white text-xs font-bold px-2 rounded-l-xl">
                                            -{descuento}%
                                        </span>
                                    )}
                                </div>
                                {precioComparativo && precioComparativo > precio && (
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

                        {/* Selects de atributos solo si existen variantes */}
                        {/* Selects de atributos solo si existen variantes */}
                        {Object.keys(allAttributes).length > 0 && (
                            <div className="flex flex-col gap-2">
                                {Object.entries(allAttributes).map(([key, values]) => (
                                    <section key={key} className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">{key}:</label>
                                        <Select
                                            value={selectedAttributes[key] || ""}
                                            onValueChange={(value) => updateSelectedVariant(key, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={`-- Elige ${key} --`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {values.map((val) => (
                                                    <SelectItem key={val} value={val}>
                                                        {val}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </section>
                                ))}
                            </div>
                        )}

                        {/* Nombre completo de la variante */}
                        {selectedVariant && (
                            <p className="text-sm mt-2 font-medium">
                                Variante: {selectedVariant.nombre} - S/ {selectedVariant.precio ?? producto.precio}
                            </p>
                        )}


                        {/* Acciones */}
                        <section className="flex justify-between items-center gap-4 mt-4">
                            <div className="hidden md:block">
                                <AddProductToCart product={producto} variant={selectedVariant ?? undefined} />
                            </div>
                            <div>
                                <ShopNowButton product={producto} />
                            </div>
                        </section>
                    </div>

                    {/* Información adicional */}
                    <div className="space-y-2 items-center mt-4">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm text-gray-600">
                            <Truck className="w-5 h-5 text-gray-600" />
                            <span className="text-sm">
                                Envío gratis en Cañete. Envíos a todo el Perú a través de <span className='bg-rose-600 text-white uppercase font-bold italic px-1'>Shalom</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm text-gray-600">
                            <ShieldCheck className="w-5 h-5 text-gray-600" />
                            <span className="text-sm">Compra segura.</span>
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm text-gray-600">
                            <span className="text-sm">
                                {producto.diasEnvio
                                    ? `Entrega estimada: ${getDeliveryRange(producto.diasEnvio)}`
                                    : "Entrega estimada: 1-3 días hábiles."}
                            </span>
                        </div>
                    </div>
                </div>
            </article>

            <section className="mx-auto">
                <ProductExpandableSections producto={producto} />
            </section>

            {/* Botón fijo mobile */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <AddProductToCart product={producto} variant={selectedVariant ?? undefined} />
                </div>
            </div>
        </>
    );
}
