import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
import { FaStar, FaBolt } from 'react-icons/fa';
// import AddProductButton from './AddProductButton';

export default function ProductCard({ product }: { product: Product }) {
    // const imagenUrl = product.imagenes[0];

    return (
        <div className="group relative flex flex-col rounded-xl bg-white border   hover:bg-black hover:text-white">
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
                    <div className="">
                        {product.esNuevo && (
                            <span className="absolute top-2 left-2 flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow ">
                                <FaBolt className="text-xs" />
                                Nuevo
                            </span>
                        )}
                        {product.esDestacado && (
                            <span className="absolute top-2 right-2 flex items-center gap-1 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                                <FaStar className="text-xs" />
                                <span className="hidden sm:inline">Destacado</span>
                            </span>
                        )}

                    </div>
                </div>

                {/* Información del producto */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                    <h3 className="text-xs md:text-sm font-medium line-clamp-3 hover:line-clamp-none">
                        {product.nombre}
                    </h3>

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
