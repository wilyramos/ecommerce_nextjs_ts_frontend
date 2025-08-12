import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/src/schemas';
import ColorCircle from '@/components/ui/ColorCircle';
// import AddProductButton from './AddProductButton';
import { FaFireAlt } from 'react-icons/fa';

export default function ProductCard({ product }: { product: Product }) {

    // Color
    const color = product.atributos?.Color || null;

    return (
        <div className="group relative flex flex-col rounded-xl bg-white border border-gray-50 text-gray-800 max-w-xs shadow-xs">
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
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vwzz"
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
                        <div className="absolute top-5 left-1 right-1 flex justify-between px-2 pointer-events-none text-[14px] text-gray-700 font-bold up" >
                            {product.esNuevo && (
                                <span className="px-1.5 border-2 border-red-500  bg-red-500 rotate-315 text-white text-xs">
                                    Nuevo
                                </span>
                            )}
                            {product.esDestacado && (
                                <span className="px-1.5 text-orange-500 text-center justify-center items-center">
                                    <FaFireAlt className="inline-block mr-1" />
                                </span>
                            )}
                        </div>
                    )}

                </div>

                {/* Información del producto */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                    <h3 className="text-xs md:text-sm font-medium text-gray-600 line-clamp-3 leading-tight ">
                        {product.nombre}
                    </h3>

                    <div className="flex justify-between items-center gap-2">
                        <div className="">
                            {color && <ColorCircle color={color} />}
                        </div>

                        <div className="font-semibold text-gray-900">
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
