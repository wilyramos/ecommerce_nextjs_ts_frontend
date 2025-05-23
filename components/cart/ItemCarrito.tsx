import Image from "next/image";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";
import { FiTrash2 } from "react-icons/fi";

export default function ItemCarrito({ item }: { item: CartItem }) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    return (
        <li className="flex items-center gap-2 py-2 first:pt-0 last:pb-0 border-b border-gray-100 last:border-b-0 flex-wrap sm:flex-nowrap">
            {/* Imagen y Detalles del Producto */}
            <div className="flex items-center flex-1 min-w-[150px] gap-2">
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                        src={item.imagenes[0] || "/logo.svg"}
                        alt={item.nombre}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col text-sm">
                    <span className="font-medium text-gray-800 line-clamp-2">{item.nombre}</span>
                    <span className="text-gray-500 mt-0.5">S/. {item.precio.toFixed(2)}</span>
                </div>
            </div>

            {/* Controles de Cantidad y Subtotal (flex wrap en móviles) */}
            <div className="flex items-center justify-between w-full sm:w-auto mt-2 sm:mt-0 gap-4">
                {/* Controles de Cantidad */}
                <div className="flex items-center">
                    <button
                        onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                        -
                    </button>
                    <span className="text-sm font-medium text-gray-800 w-8 text-center">{item.cantidad}</span>
                    <button
                        onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                        className="w-7 h-7 flex items-center justify-center text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                        +
                    </button>
                </div>

                {/* Subtotal */}
                <div className="text-sm font-semibold text-gray-900 min-w-[70px] text-right">
                    <span>S/. {(item.precio * item.cantidad).toFixed(2)}</span>
                </div>

                {/* Botón Eliminar */}
                <div>
                    <button
                        onClick={() => removeFromCart(item._id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                        aria-label={`Eliminar ${item.nombre} del carrito`}
                    >
                        <FiTrash2 size={18} />
                    </button>
                </div>
            </div>
        </li>
    );
}