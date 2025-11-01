'use client';

import AddProductToCart from './AddProductToCart';
import ColorCircle from '@/components/ui/ColorCircle';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';
import { Truck, ShieldCheck } from "lucide-react";
import ProductExpandableSections from './ProductExpandableSections ';
import { getDeliveryRange } from '@/lib/utils';


type Props = {
    producto: ProductWithCategoryResponse;
};

export default function ProductDetails({ producto }: Props) {
    const color = producto.atributos?.Color || producto.atributos?.color || producto.atributos?.COLOR || null;
    const precio = producto.precio ?? 0;
    const precioComparativo = producto.precioComparativo ?? null;
    const descuento = precioComparativo
        ? Math.round(((precioComparativo - precio) / precioComparativo) * 100)
        : null;

    return (
        <>
            <article
                className="mx-auto grid gap-4 md:grid-cols-2 items-start max-w-7xl pb-4"
                itemScope
                itemType="https://schema.org/Product"
            >
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel images={producto.imagenes || []} />
                </div>

                {/* Detalles */}
                <div>
                    <div className=" space-y-6 bg-white rounded-xl p-4 shadow-sm">
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
                            <h1 className="text-lg md:text-2xl font-semibold leading-tight break-words whitespace-normal" itemProp="name">
                                {producto.nombre}
                            </h1>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p
                                        className="text-3xl flex items-baseline"
                                        itemProp="offers"
                                        itemScope
                                        itemType="https://schema.org/Offer"
                                    >
                                        <meta itemProp="priceCurrency" content="PEN" />
                                        <span className="text-sm mr-1">S/</span>
                                        <span itemProp="price">{precio.toFixed(2)}</span>
                                    </p>

                                    {descuento && (
                                        <span className="bg-black text-white text-xs font-bold px-2  rounded-l-xl">
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
                                <table className="w-full text-xs">
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

                    <div className="space-y-2 items-center  mt-4">
                        <div className="flex items-center gap-2 bg-white rounded-lg px-6 py-3 shadow-sm text-gray-600">
                            <Truck className="w-5 h-5 text-gray-600" />
                            <span className="text-sm">
                                Envío gratis en Cañete. Envíos a todo el Perú a través de <span className=' bg-rose-600 text-white uppercase font-bold italic px-1'>Shalom</span></span>
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