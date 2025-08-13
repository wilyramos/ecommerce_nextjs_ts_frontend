import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/src/schemas";
import ColorCircle from "@/components/ui/ColorCircle";
import { FaFireAlt } from "react-icons/fa";

export default function ProductCard({ product }: { product: Product }) {
    const color = product.atributos?.Color || null;

    return (
        <div className="group relative flex flex-col bg-white text-gray-700 rounded-2xl border border-gray-100 shadow-lg transform transition-transform duration-500 hover:scale-[1.03] overflow-visible my-2">
            <Link href={`/productos/${product.slug}`} className="flex flex-col h-full">
                {/* Imagen */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-t-xl">
                    {product.imagenes.length > 0 ? (
                        <div className="relative w-full h-full group-hover:opacity-90 transition-opacity duration-300">
                            <Image
                                src={product.imagenes[0]}
                                alt={product.nombre}
                                fill
                                className={`object-cover transition-opacity duration-300 ${product.imagenes[1] ? "group-hover:opacity-0" : ""
                                    }`}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                quality={50}
                            />
                            {product.imagenes[1] && (
                                <Image
                                    src={product.imagenes[1]}
                                    alt={`${product.nombre} hover`}
                                    fill
                                    className="object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    quality={80}
                                />
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                            Sin imagen
                        </div>
                    )}

                    {/* Etiquetas */}
                    {(product.esNuevo || product.esDestacado) && (
                        <div className="absolute top-5 left-1 right-1 flex justify-between px-2 pointer-events-none text-[14px] font-bold">
                            {product.esNuevo && (
                                <span className="px-1.5 border-2 border-red-500 bg-red-500 rotate-315 text-white text-xs">
                                    Nuevo
                                </span>
                            )}
                            {product.esDestacado && (
                                <span className="px-1.5 text-orange-500 flex items-center">
                                    <FaFireAlt className="inline-block mr-1" />
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 p-3 gap-2">
                    <h3 className="text-xs md:text-sm font-medium text-black line-clamp-3 leading-tight">
                        {product.nombre}
                    </h3>
                    <div className="flex justify-between items-center gap-2 text-md font-base text-gray-600 ">
                        {color && <ColorCircle color={color} />}
                        <div>
                            <span className="text-xs font-bold">s/ </span>
                            {product.precio.toFixed(2)}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
