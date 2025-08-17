'use client';

import AddProductToCart from './AddProductToCart';
import ColorCircle from '@/components/ui/ColorCircle';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type Props = {
    producto: ProductWithCategoryResponse;
};

export default function ProductDetails({ producto }: Props) {
    const color = producto.atributos?.Color || null;
    const [showDescripcion, setShowDescripcion] = useState(false);

    return (
        <>
            <article
                className="mx-auto px-4 grid gap-6 lg:grid-cols-2 max-w-7xl"
                itemScope
                itemType="https://schema.org/Product"
            >
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel images={producto.imagenes || []} />
                </div>

                {/* Detalles */}
                <div className="space-y-6">
                    {/* Título y Precio */}
                    <header className="space-y-2">
                        <div>
                            {producto.sku && (
                                <span className="text-xs text-gray-400" itemProp="sku">
                                    SKU: {producto.sku} |
                                </span>
                            )}
                            {producto.barcode && (
                                <span className="text-xs text-gray-400">
                                    Código: {producto.barcode}
                                </span>
                            )}
                            <h1 className="text-2xl md:text-2xl font-semibold leading-tight" itemProp="name">
                                {producto.nombre}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span
                                className="text-2xl text-indigo-600"
                                itemProp="offers"
                                itemScope
                                itemType="https://schema.org/Offer"
                            >
                                <meta itemProp="priceCurrency" content="PEN" />
                                <span itemProp="price">S/ {producto.precio?.toFixed(2)}</span>
                            </span>

                            {producto.stock !== undefined && (
                                <span
                                    className={`text-xs px-2 rounded-2xl font-medium ${producto.stock > 0
                                        ? 'text-green-600 bg-green-200'
                                        : 'text-red-600 bg-red-200'
                                        }`}
                                >
                                    {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                                </span>
                            )}
                        </div>
                    </header>

                    {/* Características */}
                    {producto.atributos && Object.keys(producto.atributos).length > 0 && (
                        <section aria-labelledby="caracteristicas">
                            <h2
                                id="caracteristicas"
                                className="text-sm font-medium text-gray-400 mb-3"
                            >
                                Características
                            </h2>
                            <table className="w-full text-xs">
                                <tbody>
                                    {Object.entries(producto.atributos).map(([key, value]) => (
                                        <tr
                                            key={key}
                                            className="border-b last:border-b-0 even:bg-gray-50"
                                        >
                                            <td className="px-4 py-2 font-medium text-gray-700">{key}</td>
                                            <td className="px-4 py-2 text-gray-600">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}

                    {/* Color */}
                    {color && (
                        <section className="flex items-center gap-2" aria-label="Color del producto">
                            <span className="text-sm font-medium text-gray-400">Color:</span>
                            <ColorCircle color={color} />
                        </section>
                    )}

                    {/* Acciones */}
                    <section
                        className="flex justify-between items-center gap-4"
                        aria-label="Acciones del producto"
                    >
                        <div className="hidden md:block">
                            <AddProductToCart product={producto} />
                        </div>
                        <div>
                            <ShopNowButton product={producto} />
                        </div>
                    </section>
                </div>
            </article>

            {producto.descripcion && (
                <section className="mx-auto py-2" aria-labelledby="descripcion-adicional">
                    <button
                        onClick={() => setShowDescripcion(!showDescripcion)}
                        className="w-full flex justify-between items-center text-left text-xl text-gray-700 font-medium hover:text-indigo-600 transition"
                    >
                        <span id="descripcion-adicional">Información adicional</span>
                        {showDescripcion ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div className="border-b border-gray-200 my-2" />
                    <div
                        className={`transition-all overflow-hidden  text-gray-700 whitespace-pre-wrap duration-300 ease-in-out ${showDescripcion ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <p itemProp="description" className="leading-normal px-1 py-2 text-sm md:text-base">
                            {producto.descripcion}
                        </p>
                    </div>
                </section>
            )}

            {/* Espaciador mobile */}
            <div className="block md:hidden" />

            {/* Botón fijo para móviles */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 shadow z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-center">
                    <AddProductToCart product={producto} />
                </div>
            </div>
        </>
    );
}
