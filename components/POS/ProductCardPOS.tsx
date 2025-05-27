import { Product } from "@/src/schemas";
import Image from "next/image";
import { FaBox, FaPlus } from "react-icons/fa";
import AddProductButton from "../home/product/AddProductButton";

export default function ProductCardPOS({ product }: { product: Product }) {
    const { nombre, descripcion, precio, imagenes, stock } = product;

    return (
        <div className="bg-white rounded-xl border p-3 flex flex-col gap-2">
            {/* Imagen */}
            <div className="w-full h-36 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                {imagenes?.[0] ? (
                    <Image
                        src={imagenes[0]}
                        alt={nombre}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-medium text-gray-800 truncate">{nombre}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{descripcion}</p>
            </div>

            {/* Precio y stock */}
            <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-primary font-semibold">${precio.toFixed(2)}</span>
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <FaBox className="text-gray-400" /> {stock}
                </span>
            </div>

            {/* Botón */}
            <div className="px-3 pb-3">
                
                <AddProductButton product={product} />
            </div>
        </div>
    );
}
