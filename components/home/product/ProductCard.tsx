import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import type { ProductType } from '@/src/schemas';

export default function ProductCard({ product }: { product: ProductType }) {

    const imagenUrl = product.imagenes[0] || '/logo.svg';
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
            <Link href={`/productos/${product._id}`} className="block">
                <div className="relative w-full aspect-square bg-gray-50">
                    <Image
                        src={imagenUrl}
                        alt={product.nombre}
                        height={300}
                        width={300}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {product.nombre}
                    </h3>
                    <p className="text-lg font-bold text-blue-600 mt-1">${product.precio}</p>               

                </div>
            </Link>

            {/* Botón "Añadir al carrito" flotante */}
            <button
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700"
                aria-label="Añadir al carrito"
            >
                <FaShoppingCart size={18} />
            </button>
        </div>
    );
}
