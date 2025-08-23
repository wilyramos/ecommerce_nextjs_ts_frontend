'use client';

import AddProductToCart from './AddProductToCart';
import ColorCircle from '@/components/ui/ColorCircle';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Truck, ShieldCheck } from "lucide-react";


type Props = {
    producto: ProductWithCategoryResponse;
};

export default function ProductDetails({ producto }: Props) {
    const color = producto.atributos?.Color || producto.atributos?.color || producto.atributos?.COLOR || null;
    const [showDescripcion, setShowDescripcion] = useState(false);

    return (
        <>
            <article
                className="mx-auto grid gap-6 md:grid-cols-2 items-start max-w-7xl pb-4"
                itemScope
                itemType="https://schema.org/Product"

            >
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel images={producto.imagenes || []} />
                </div>

                {/* Detalles */}
                <div>
                    <div className=" space-y-6 bg-white rounded-xl p-6 shadow-sm">
                        {/* Título y Precio */}
                        <header className="space-y-2">
                            <div className='flex justify-between uppercase'>
                                {producto.sku && (
                                    <span className="text-xs text-gray-400" itemProp="sku">
                                        SKU: {producto.sku}
                                    </span>
                                )}
                                {producto.barcode && (
                                    <span className="text-xs text-gray-400">
                                        Código: {producto.barcode}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl md:text-4xl font-bold leading-tight break-words whitespace-normal " itemProp="name">
                                {producto.nombre}
                            </h1>

                            <div className="flex items-center gap-4">
                                <span
                                    className="text-3xl text-gray-700"
                                    itemProp="offers"
                                    itemScope
                                    itemType="https://schema.org/Offer"
                                >
                                    <meta itemProp="priceCurrency" content="PEN" />
                                    <p itemProp="price" className='font-extrabold text-gray-600'>
                                        <span className="font-extrabold text-sm">s/</span> {producto.precio?.toFixed(2)}</p>
                                </span>


                            </div>
                            {producto.stock !== undefined && (
                                <span
                                    className={`text-xs px-2 py-1  ${producto.stock > 0
                                        ? 'text-green-900 bg-green-100'
                                        : 'text-red-600 bg-red-100'
                                        }`}
                                >
                                    {producto.stock > 0 ? `${producto.stock} disponible` : 'Agotado'}
                                </span>
                            )}
                        </header>

                        {/* Características */}
                        {producto.atributos && Object.keys(producto.atributos).length > 0 && (
                            <section aria-labelledby="caracteristicas">
                                <h2
                                    id="caracteristicas"
                                    className="hidden"
                                >
                                    Características
                                </h2>
                                <table className="w-full text-sm">
                                    <tbody>
                                        {Object.entries(producto.atributos).map(([key, value]) => (
                                            <tr
                                                key={key}
                                                className="border-b even:bg-gray-50 border-gray-50"
                                            >
                                                <td className="text-gray-700 uppercase font-semibold">{key}</td>
                                                <td className="px-4 py-2 text-gray-700">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        )}

                        {/* Color */}
                        {color && (
                            <section className="flex items-center gap-2" aria-label="Color del producto">
                                <span className="text-sm font-medium text-gray-400"></span>
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

                    <div className="space-y-2 text-center items-center  mt-4">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm text-gray-600">
                            <Truck className="w-5 h-5 text-gray-600" />
                            <span className="text-sm">
                                Envío gratis en Cañete. Envíos a todo el Perú a través de Shalom.                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm text-gray-600">
                            <ShieldCheck className="w-5 h-5 text-gray-600" />
                            <span className="text-sm">Compra segura</span>
                        </div>
                    </div>

                </div>


            </article>

            {producto.descripcion && (
                <section className="mx-auto py-2 bg-white rounded-lg p-6" aria-labelledby="descripcion-adicional">
                    <button
                        onClick={() => setShowDescripcion(!showDescripcion)}
                        className="w-full flex justify-between items-center text-left text-xl text-gray-700 font-medium hover:text-black transition pt-4 cursor-pointer"
                    >
                        <span id="descripcion-adicional" className='text-gray-700 font-semibold'>Información adicional</span>
                        {showDescripcion ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div className="border-b border-gray-200 my-2" />

                    <div
                        className={`transition-all overflow-hidden text-gray-700 whitespace-pre-wrap duration-300 ease-in-out 
                ${showDescripcion ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
                    >
                        <p
                            itemProp="description"
                            className="leading-normal px-1 py-2 text-sm md:text-base break-words"
                        >
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