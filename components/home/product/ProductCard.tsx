import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
// import AddProductButton from './AddProductButton';

export default function ProductCard({ product }: { product: Product }) {
    const imagenUrl = product.imagenes[0];

    return (
        <div className="group relative flex flex-col rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link href={`/productos/${product._id}`} className="flex flex-col h-full">
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
                    {product.imagenes.length > 0 ? (
                        <Image
                            src={imagenUrl}
                            alt={product.nombre}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                            quality={40}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                            Sin imagen
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 p-2">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight">
                        {product.nombre}
                    </h3>

                    <p className="text-red-500 font-semibold text-md md:text-base">
                        <span className="text-xs align-top mr-0.5">S/</span>
                        {product.precio}
                    </p>
                </div>
            </Link>

            {/* <div className="px-3 pb-3">
                <AddProductButton product={product} />
            </div> */}
        </div>
    );
}