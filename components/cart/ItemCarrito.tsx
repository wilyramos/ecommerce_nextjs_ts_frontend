import Image from "next/image";
import type { CartItem } from "@/src/schemas";
import { useCartStore } from "@/src/store/cartStore";

export default function ItemCarrito({ item }: { item: CartItem }) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    return (
        <li className="py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Imagen + info */}
            <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 relative overflow-hidden rounded-md bg-gray-100 flex-shrink-0">
                    <Image
                        src={item.imagenes[0] || "/logo.svg"}
                        alt={item.nombre}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">{item.nombre}</span>
                    <span className="text-xs text-gray-500">S/. {item.precio.toFixed(2)} c/u</span>
                </div>
            </div>

            {/* Controles de cantidad + subtotal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6 w-full md:w-auto">
                {/* Controles de cantidad */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                        disabled={item.cantidad === 1}
                        className="w-8 h-8 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                    >
                        -
                    </button>
                    <span className="text-sm text-gray-700 w-6 text-center">{item.cantidad}</span>
                    <button
                        onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                        className="w-8 h-8 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>

                {/* Subtotal */}
                <div className="text-sm font-semibold text-gray-800 text-right min-w-[80px]">
                    S/. {(item.precio * item.cantidad).toFixed(2)}
                </div>
            </div>
        </li>
    );
}
