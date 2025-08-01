'use client';

import AddProductToCart from './AddProductToCart';
import ColorCircle from '@/components/ui/ColorCircle';
import ImagenesProductoCarousel from './ImagenesProductoCarousel';
import type { ProductWithCategoryResponse } from '@/src/schemas';
import ShopNowButton from './ShopNowButton';

type Props = {
    producto: ProductWithCategoryResponse;
};

export default function ProductDetails({ producto }: Props) {

    // Color 

    const color = producto.atributos?.Color || null;

    return (
        <>
            <div className="mx-auto px-4 grid gap-6 lg:grid-cols-2 max-w-7xl">
                {/* Imágenes */}
                <div>
                    <ImagenesProductoCarousel images={producto.imagenes || []} />
                </div>

                {/* Detalles */}
                <div className="space-y-6">

                    {/* Título y Precio */}
                    <div className="space-y-2">
                        <div className=''>
                            {producto.sku && (
                                <span className="text-xs text-gray-400">
                                    SKU: {producto.sku} |
                                </span>

                            )}
                            {producto.barcode && (
                                <span className="text-xs text-gray-400">
                                    Código: {producto.barcode}
                                </span>
                            )}
                            <h1 className="text-3xl md:text-3xl font-bold leading-tight">
                                {producto.nombre}
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-2xl text-black font-extrabold">
                                s/ {producto.precio?.toFixed(2)}
                            </span>
                            {producto.stock && (
                                <span className={`text-xs font-medium ${producto.stock > 0 ? 'text-green-800 rounded-2xl bg-green-300' : 'text-red-600 rounded-full bg-red-100'} px-2 py-1 font-semibold`}>
                                    {producto.stock > 0 ? `${producto.stock} en stock` : 'Agotado'}
                                </span>
                            )}

                        </div>
                    </div>

                    {/* Características */}
                    {producto.atributos && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-400 mb-3">Características</h2>
                            <div className="">

                                <table className="w-full text-xs">
                                    <tbody>
                                        {Object.entries(producto.atributos).map(([key, value]) => (
                                            <tr key={key} className="border-b last:border-b-0 even:bg-gray-50">
                                                <td className="px-4 py-2 font-medium text-gray-700">{key}</td>
                                                <td className="px-4 py-2 text-gray-600">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                            </div>
                        </div>
                    )}

                    {/* Color*/}

                    {/* Color individual */}
                    {color && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-400">Color:</span>
                            <ColorCircle color={color} />
                        </div>
                    )}


                    {/* Descripción */}


                    <div className='flex justify-between items-center gap-4'>
                        {/* Botón para escritorio */}
                        <div className="hidden md:block ">
                            <AddProductToCart product={producto} />
                        </div>
                        {/* Botón para "comprar ahora" */}

                        <div className=''>
                            <ShopNowButton product={producto} />
                        </div>

                    </div>

                </div>
            </div>

            {/* Informacion adicional */}

            {producto.descripcion && (

                <div className='p-5 border-1 rounded-2xl border-gray-100 mt-4 max-w-7xl mx-auto'>
                    <h2 className="text-2xl text-gray-600 font-semibold">Informacion adicional</h2>
                    <p className="text-sm whitespace-pre-wrap leading-normal text-gray-500 ">
                        {producto.descripcion}
                    </p>
                </div>
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