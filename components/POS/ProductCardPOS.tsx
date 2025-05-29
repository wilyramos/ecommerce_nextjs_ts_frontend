import { Product } from "@/src/schemas";
import Image from "next/image";
import { FaBox } from "react-icons/fa";
import AddProductButton from "../home/product/AddProductButton";

export default function ProductCardPOS({ product }: { product: Product }) {
    const { nombre, precio, imagenes, stock } = product;

    return (
        <div className="group flex items-center gap-2 rounded-md border border-gray-200 bg-white p-2 transition-colors hover:border-primary ">
            <div className="relative w-12 h-12 overflow-hidden rounded">
                {imagenes?.[0] ? (
                    <Image
                        src={imagenes[0]}
                        alt={nombre}
                        width={48}
                        height={48}
                        loading="lazy"
                        quality={20}
                        className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400 text-xs">
                        Sin imagen
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-primary">{nombre}</h3>
                <div className="mt-0.5 text-xs text-gray-600">
                    <span className="font-medium">S/. {precio.toFixed(2)}</span>
                    {stock > 0 && (
                        <span className="ml-2 flex items-center gap-1 text-gray-500">
                            <FaBox className="text-gray-400" size={10} /> {stock}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                {stock > 0 ? (
                    <AddProductButton product={product} />
                ) : (
                    <span className="text-xs text-gray-400">Agotado</span>
                )}
            </div>
        </div>
    );
}