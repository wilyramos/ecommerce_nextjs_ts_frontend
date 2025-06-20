import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
import ColorCircle from '@/components/ui/ColorCircle';
// import AddProductButton from './AddProductButton';

export default function ProductCard({ product }: { product: Product }) {
    // const imagenUrl = product.imagenes[0];


    // Color
    const color = product.atributos?.Color || null;

    return (
        <div className="group relative flex flex-col rounded-xl bg-white border text-gray-700 ">
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-t-xl">

                    {product.imagenes.length > 0 ? (

                        <div className="relative w-full h-full group-hover:opacity-90 transition-opacity duration-300">
                            <Image
                                src={product.imagenes[0]}
                                alt={product.nombre}
                                fill
                                className={`object-cover transition-opacity duration-300 ${product.imagenes[1] ? 'group-hover:opacity-0' : ''
                                    }`}
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                quality={50}

                            />

                            {product.imagenes[1] && (
                                <Image
                                    src={product.imagenes[1]}
                                    alt={`${product.nombre} hover`}
                                    fill
                                    className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    quality={80}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}
                    {/*Etiquetas */}
                    {/* Etiquetas minimalistas */}
                    {(product.esNuevo || product.esDestacado) && (
                        <div className="absolute top-2 left-2 right-2 flex justify-between px-2 pointer-events-none text-[10px] text-gray-700">
                            {product.esNuevo && (
                                <span className="px-2 py-0.5 border border-blue-500 rounded-full bg-white/90 backdrop-blur-3xl">
                                    Nuevo
                                </span>
                            )}
                            {product.esDestacado && (
                                <span className="px-2 py-0.5 border border-orange-400 rounded-full bg-white/90 backdrop-blur-3xl">
                                    Destacado
                                </span>
                            )}
                        </div>
                    )}

                </div>

                {/* Información del producto */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                    <h3 className="text-xs md:text-sm font-medium line-clamp-3 hover:line-clamp-none">
                        {product.nombre}
                    </h3>

                    {color && (
                        <div className="flex items-center gap-2">
                            <ColorCircle color={color} />
                        </div>
                    )}

                    <div className="flex justify-between items-end">

                        {/* <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div> */}
                        <div className="text-lg font-bold">
                            <span className="text-md">s/. </span>
                            {product.precio.toFixed(2)}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Botón para agregar al carrito (opcional) */}
            {/* <div className="p-3 pt-0">
                <AddProductButton product={product} />
            </div> */}
        </div>
    );
}
