import Image from "next/image";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FiTrash2 } from "react-icons/fi";
import { MdOutlineImageNotSupported } from "react-icons/md";

export default function ItemCarrito({ item }: { item: CartItem }) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    const productId = item._id;
    const variantId = item.variant?._id;
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];
    const price = item.variant?.precio ?? item.precio ?? 0;
    const subtotal = price * item.cantidad;
    return (
        <li className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-gray-200 last:border-none">
            {/* Imagen + información del producto */}
            <div className="flex items-start gap-4 flex-1">
                {/* Imagen */}
                <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
                    {imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={item.variant?.nombre ?? item.nombre}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                            quality={40}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full ">
                            <MdOutlineImageNotSupported size={18} />

                        </div>
                    )}
                </div>

                {/* Detalles */}
                <div className="flex flex-col flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 ">
                        {item.nombre}
                    </p>

                    {item.variant?.nombre && (
                        <p className="text-xs text-gray-500 mt-0.5">
                            {Object.entries(item.variant.atributos)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(" • ")}
                        </p>
                    )}

                    {/* Controles cantidad + eliminar */}
                    <div className="flex items-center gap-2 mt-2">
                        {/* Cantidad */}
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                                onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
                                disabled={item.cantidad <= 1}
                                className="w-8 h-8 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                -
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-gray-800 select-none">
                                {item.cantidad}
                            </span>
                            <button
                                onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
                                disabled={item.cantidad >= (item.variant?.stock ?? item.stock ?? 0)}
                                className="w-8 h-8 text-gray-600 text-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                +
                            </button>
                        </div>

                        {/* Eliminar */}
                        <button
                            onClick={() => removeFromCart(productId, variantId)}
                            className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label={`Eliminar ${item.nombre}`}
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Precio total */}
            <div className="text-right sm:min-w-[80px]">
                <span className="text-sm font-semibold text-gray-900 block">
                    S/. {subtotal.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                    S/. {price.toFixed(2)} c/u
                </span>
            </div>
        </li>
    );
}
