import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
import AddProductButton from './AddProductButton'; // Asumo que este componente ya funciona bien.

export default function ProductCard({ product }: { product: Product }) {
    const imagenUrl = product.imagenes[0] || '/logo.svg';

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            <Link href={`/productos/${product._id}`} className="block h-full">
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    <Image
                        src={imagenUrl}
                        alt={product.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        quality={20}
                    />
                    {/* OPTION 1: Enhanced Price Display - Modern & Clean */}
                    <p className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-lg font-bold text-gray-800 shadow-sm select-none">
                        ${product.precio}
                    </p>
                    {/* OPTION 2: New/Sale Tag (Puedes usarlo si tienes productos en oferta o nuevos) */}
                    {/* {product.isNew && (
                        <span className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Nuevo
                        </span>
                    )}
                    {product.onSale && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            Oferta
                        </span>
                    )} */}
                </div>

                <div className="flex flex-col flex-grow p-4">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 truncate mb-1">
                        {product.nombre}
                    </h3>
                    {/* Puedes añadir una descripción corta si la tienes en tu esquema de producto */}
                    {/* {product.descripcionCorta && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {product.descripcionCorta}
                        </p>
                    )} */}
                    {/* Puedes añadir un rating si lo tienes */}
                    {/* <div className="flex items-center text-yellow-500 text-sm mb-2">
                        <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span></span> (4.0)
                    </div> */}
                </div>
            </Link>

            {/* Botón de añadir al carrito fuera del Link para mejor accesibilidad y clickeabilidad */}
            <div className=""> {/* Padding top 0 para acercarlo al contenido */}
                <AddProductButton product={product} />
            </div>
        </div>
    );
}