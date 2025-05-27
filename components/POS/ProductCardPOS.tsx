import { Product } from "@/src/schemas";
import Image from "next/image";
import { FaBox } from "react-icons/fa";
import AddProductButton from "../home/product/AddProductButton";

export default function ProductCardPOS({ product }: { product: Product }) {
    const { nombre, precio, imagenes, stock } = product;

    return (
        <div className="flex items-center gap-4 rounded border bg-white p-3 shadow-sm">
            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {imagenes?.[0] ? (
                    <Image
                        src={imagenes[0]}
                        alt={nombre}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                        Sin imagen
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800 truncate">{nombre}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span className="text-primary font-semibold text-sm">${precio.toFixed(2)}</span>
                    <span className="flex items-center gap-1">
                        <FaBox className="text-gray-400" /> {stock}
                    </span>
                </div>
            </div>

            {stock > 0 ? (
                <AddProductButton product={product} />
            ) : (
                <div className="text-xs text-gray-400">Sin stock</div>
            )}
        </div>
    );
}
