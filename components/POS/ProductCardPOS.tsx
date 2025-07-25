import { Product } from "@/src/schemas";
import Image from "next/image";
import { FaBox } from "react-icons/fa";
import AddProductButton from "../home/product/AddProductButton";

export default function ProductCardPOS({ product }: { product: Product }) {
    const { nombre, precio, imagenes, stock, barcode } = product;

    return (
        <div className="group flex items-center gap-2 p-2 transition ">
            {/* Imagen del producto */}
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden ">
                {imagenes?.[0] ? (
                    <Image
                        src={imagenes[0]}
                        alt={nombre}
                        width={56}
                        height={56}
                        loading="lazy"
                        quality={40}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Detalles del producto */}
            <div className="flex flex-1 flex-col min-w-0">
                <h3 className="text-sm md:text-lg font-semibold truncate text-gray-800 group-hover:text-indigo-600">
                    {nombre}
                </h3>

                <div className="mt-1 flex flex-wrap items-center text-xs text-gray-600 gap-x-2">
                    <span className="font-extrabold text-green-600">S/. {precio.toFixed(2)}</span>
                    <span className="text-gray-500 font-mono">Cód: {barcode}</span>
                    {stock > 0 && (
                        <span className="flex items-center gap-1 text-gray-500">
                            <FaBox className="text-gray-400" size={12} />
                            {stock}
                        </span>
                    )}
                </div>
            </div>

            {/* Botón o estado */}
            <div className="ml-2">
                {stock > 0 ? (
                    <AddProductButton product={product} />
                ) : (
                    <span className="text-xs text-red-600 font-semibold">Agotado</span>
                )}
            </div>
        </div>
    );
}
