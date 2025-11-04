import Image from "next/image";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FiTrash2 } from "react-icons/fi";

export default function ItemCarrito({ item }: { item: CartItem }) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    // Identificadores únicos: producto + variante (si existe)
    const productId = item._id;
    const variantId = item.variant?._id;
    const imageSrc = item.variant?.imagenes?.[0] ?? item.imagenes?.[0];

    return (
        <li className="flex flex-wrap sm:flex-nowrap items-center justify-between py-3 border-b last:border-b-0">
            {/* Imagen y nombre */}
            <div className="flex items-center gap-3 min-w-[150px] flex-1">
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-md">
                    {item.variant?.imagenes?.[0] || item.imagenes?.[0] ? (
                        <Image
                            src={imageSrc!}
                            alt={item.variant?.nombre ?? item.nombre}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded text-xs text-gray-500">
                            Sin imagen
                        </div>
                    )}
                </div>

                <div className="text-sm">
                    <p className="font-medium text-gray-800 line-clamp-2">
                        {item.nombre}
                        {item.variant?.nombre && (
                            <span className="text-gray-500 text-xs block">
                                {Object.entries(item.variant.atributos)
                                    .map(([k, v]) => `${k}: ${v}`)
                                    .join(" • ")}
                            </span>
                        )}
                    </p>
                    <p className="text-gray-500 mt-0.5">S/. {item.precio.toFixed(2)}</p>
                </div>
            </div>

            {/* Controles y subtotal */}
            <div className="flex items-center justify-end gap-4 w-full sm:w-auto">
                {/* Controles de cantidad */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => updateQuantity(productId, item.cantidad - 1, variantId)}
                        disabled={item.cantidad <= 1}
                        className="w-7 h-7 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        -
                    </button>

                    <span className="w-8 text-center text-sm font-medium text-gray-800">
                        {item.cantidad}
                    </span>

                    <button
                        onClick={() => updateQuantity(productId, item.cantidad + 1, variantId)}
                        disabled={item.cantidad >= (item.variant?.stock ?? item.stock ?? 0)}
                        className="w-7 h-7 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        +
                    </button>
                </div>

                {/* Subtotal */}
                <div className="min-w-[70px] text-right text-sm font-semibold text-gray-900">
                    S/. {(item.precio * item.cantidad).toFixed(2)}
                </div>

                {/* Botón eliminar */}
                <button
                    onClick={() => removeFromCart(productId, variantId)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={`Eliminar ${item.nombre}`}
                >
                    <FiTrash2 size={18} />
                </button>
            </div>
        </li>
    );
}
