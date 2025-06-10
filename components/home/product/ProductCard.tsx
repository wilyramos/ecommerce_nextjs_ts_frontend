import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
import { FaStar, FaBolt } from 'react-icons/fa';
// import AddProductButton from './AddProductButton';

export default function ProductCard({ product }: { product: Product }) {
    const imagenUrl = product.imagenes[0];

    return (
        <div className="group relative flex flex-col rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <Link href={`/productos/${product._id}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-t-xl">
                    
                    {product.imagenes.length > 0 ? (
                        <Image
                            src={imagenUrl}
                            alt={product.nombre}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            quality={50}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}
                    {/*Etiquetas */}
                    <div>
                       {product.esDestacado && (
                            <span className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                                <FaStar className="text-xs" />
                                Destacado
                            </span>
                        )}
                        {product.esNuevo && (
                            <span className="absolute top-2 right-2 flex items-center gap-1 bg-indigo-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                                <FaBolt className="text-xs" />
                                Nuevo
                            </span>
                        )}
                    </div>
                </div>

                {/* Información del producto */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                    <h3 className="text-sm font-medium text-gray-950 line-clamp-2">
                        {product.nombre}
                    </h3>

                    <div className="flex justify-between items-end">
                        <div className="text-xs text-gray-600">
                            {product.color}
                        </div>
                        
                        {/* <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div> */}
                        <div className="text-lg font-bold text-gray-900">
                            <span className="text-md  text-indigo-700">s/. </span>
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
