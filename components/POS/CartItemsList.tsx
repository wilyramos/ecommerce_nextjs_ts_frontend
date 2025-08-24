"use client";

import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";

export default function CartItemsList() {
    const { cart, updateQuantity, removeFromCart } = useCartStore();

    if (cart.length === 0) {
        return (
            <p className="text-center text-gray-500 py-6">
                No hay productos en el carrito.
            </p>
        );
    }

    return (
        <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 pr-1 bg-gray-100 rounded-lg p-2">
            {cart.map((item) => (
                <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 bg-white shadow  rounded-xl p-3"
                >
                    {/* Imagen + Nombre */}
                    <div className="flex items-center gap-3 flex-1">
                        {item.imagenes?.[0] ? (
                            <Image
                                src={item.imagenes[0]}
                                alt={item.nombre}
                                width={55}
                                height={55}
                                quality={10}
                                className="w-14 h-14 object-cover rounded-lg border"
                            />
                        ) : (
                            <div className="w-14 h-14 flex items-center justify-center bg-gray-200 rounded-lg text-xs text-gray-500">
                                Sin imagen
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 text-sm truncate max-w-[140px]">
                                {item.nombre}
                            </span>
                            <span className="text-xs text-gray-500">
                                Precio: S/. {item.precio.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                            −
                        </button>
                        <span className="min-w-[32px] text-center font-bold text-lg text-gray-800">
                            {item.cantidad}
                        </span>
                        <button
                            onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                            disabled={item.cantidad >= item.stock}
                            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                            +
                        </button>
                    </div>

                    {/* Subtotal */}
                    <div className="min-w-[80px] text-right">
                        <p className="text-xs text-gray-500">Subtotal</p>
                        <p className="font-bold text-lg text-gray-900">
                            S/. {(item.precio * item.cantidad).toFixed(2)}
                        </p>
                    </div>

                    {/* Eliminar */}
                    <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                        aria-label={`Eliminar ${item.nombre}`}
                    >
                        <FiTrash2 size={20} />
                    </button>
                </div>
            ))}
        </div>
    );
}
