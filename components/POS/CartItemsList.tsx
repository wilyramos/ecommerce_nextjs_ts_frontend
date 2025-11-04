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
            {cart.map((item) => {
                const variant = item.variant;
                const imageSrc =
                    variant?.imagenes?.[0] ??
                    item.imagenes?.[0] ??
                    "/images/placeholder.png";
                const displayName = variant
                    ? `${item.nombre} (${Object.values(variant.atributos).join(" / ")})`
                    : item.nombre;
                const itemId = variant?._id ?? item._id;
                const price = variant?.precio ?? item.precio;
                const stock = variant?.stock ?? item.stock ?? 0;

                return (
                    <div
                        key={itemId}
                        className="flex items-center justify-between gap-4 bg-white shadow rounded-xl p-3"
                    >
                        {/* Imagen + Nombre */}
                        <div className="flex items-center gap-3 flex-1">
                            {imageSrc ? (
                                <Image
                                    src={imageSrc}
                                    alt={displayName}
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
                                    {displayName}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Precio: S/. {price.toFixed(2)}
                                </span>
                                {variant && (
                                    <span className="text-[11px] text-gray-400">
                                        Variante:{" "}
                                        {Object.entries(variant.atributos)
                                            .map(([key, val]) => `${key}: ${val}`)
                                            .join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() =>
                                    updateQuantity(itemId, item.cantidad - 1)
                                }
                                disabled={item.cantidad <= 1}
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                −
                            </button>
                            <span className="min-w-[32px] text-center font-bold text-lg text-gray-800">
                                {item.cantidad}
                            </span>
                            <button
                                onClick={() =>
                                    updateQuantity(itemId, item.cantidad + 1)
                                }
                                disabled={item.cantidad >= stock}
                                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 text-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                +
                            </button>
                        </div>

                        {/* Subtotal */}
                        <div className="min-w-[80px] text-right">
                            <p className="text-xs text-gray-500">Subtotal</p>
                            <p className="font-bold text-lg text-gray-900">
                                S/. {(price * item.cantidad).toFixed(2)}
                            </p>
                        </div>

                        {/* Eliminar */}
                        <button
                            onClick={() => removeFromCart(itemId)}
                            className="text-red-500 hover:text-red-700 p-2"
                            aria-label={`Eliminar ${displayName}`}
                        >
                            <FiTrash2 size={20} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
