import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
// import AddProductButton from './AddProductButton';

export default function ProductCard({ product }: { product: Product }) {
    const imagenUrl = product.imagenes[0];

    return (
        <div className="group relative flex flex-col rounded-md bg-white shadow-xs hover:shadow-md transition-shadow duration-300">
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
                    <h3 className="text-sm text-gray-800 line-clamp-3 ">
                        {product.nombre}
                    </h3>

                    <span className="flex justify-end text-lg font-bold text-gray-900">
                        <span className='font-light'>s/. </span>{product.precio.toFixed(2)}
                    </span>
                </div>
            </Link>

            {/* <div className="px-3 pb-3">
                <AddProductButton product={product} />
            </div> */}
        </div>
    );
}