import { ProductWithCategoryResponse } from "@/src/schemas";
import Image from "next/image";
import AddProductButton from "../home/product/AddProductButton";

export default function ProductCardPOS({ product }: { product: ProductWithCategoryResponse }) {
    const { nombre, precio, imagenes, stock, barcode } = product;

    const agotado = !stock || stock <= 0;

    return (
        <div className="flex items-center gap-3 px-3 py-2 border-2xl my-2 hover:bg-gray-100 transition-colors">
            {/* Imagen */}
            <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                {imagenes?.[0] ? (
                    <Image
                        src={imagenes[0]}
                        alt={nombre}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-[10px] text-gray-400">
                        Sin imagen
                    </div>
                )}
            </div>

            {/* Información */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm truncate">{nombre}</span>
                <div className="text-xs text-gray-500 mt-0.5 flex gap-2">
                    <span>S/ {precio?.toFixed(2)}</span>
                    <span>Cód: {barcode}</span>
                    {stock !== undefined && !agotado && <span>{stock} uds</span>}
                </div>
            </div>

            {/* Acción */}
            <div>
                {agotado ? (
                    <span className="text-xs text-gray-400">Agotado</span>
                ) : (
                    <AddProductButton product={product} />
                )}
            </div>
        </div>
    );
}
