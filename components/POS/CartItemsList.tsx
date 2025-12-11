//File: frontend 

"use client";

import { useCartStore } from "@/src/store/cartStore";
import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";

export default function CartItemsList() {
    const { cart, updateQuantity, removeFromCart } = useCartStore();

    return (
        <div className="space-y-2 overflow-x-hidden">
            {cart.map((item) => {
                const variant = item.variant;

                const imageSrc =
                    variant?.imagenes?.[0] ??
                    item.imagenes?.[0] ??
                    "/logo.svg";

                const displayName = variant
                    ? `${item.nombre} (${Object.values(variant.atributos).join(" / ")})`
                    : item.nombre;

                const itemId = variant?._id ?? item._id;
                const price = variant?.precio ?? item.precio;
                const stock = variant?.stock ?? item.stock ?? 0;

                return (
                    <div
                        key={itemId}
                        className="
                            flex flex-col gap-3
                            bg-gray-50 border border-gray-200
                            rounded-xl p-4
                            overflow-x-hidden
                        "
                    >
                        {/* Imagen + Nombre */}
                        <div className="flex items-start gap-3 w-full">
                            <Image
                                src={imageSrc}
                                alt={displayName}
                                width={70}
                                height={70}
                                className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                                quality={1}
                            />

                            <div className="flex flex-col gap-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm leading-snug break-words">
                                    {displayName}
                                </p>

                                <p className="text-xs text-gray-600">
                                    Precio: S/. {price.toFixed(2)}
                                </p>

                                {variant && (
                                    <p className="text-xs text-gray-500 leading-relaxed break-words">
                                        {Object.entries(variant.atributos)
                                            .map(([k, v]) => `${k}: ${v}`)
                                            .join(" • ")}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Controles + subtotal */}
                        <div className="flex justify-between items-center w-full">

                            {/* Controles cantidad */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() =>
                                        updateQuantity(itemId, item.cantidad - 1)
                                    }
                                    disabled={item.cantidad <= 1}
                                    className="
                                        w-8 h-8 flex items-center justify-center 
                                        rounded-full bg-white border border-gray-300
                                        text-lg text-gray-700 font-bold
                                        hover:bg-gray-100
                                        disabled:opacity-40
                                    "
                                >
                                    −
                                </button>

                                <span className="min-w-[30px] text-center font-semibold text-gray-800">
                                    {item.cantidad}
                                </span>

                                <button
                                    onClick={() =>
                                        updateQuantity(itemId, item.cantidad + 1)
                                    }
                                    disabled={item.cantidad >= stock}
                                    className="
                                        w-8 h-8 flex items-center justify-center 
                                        rounded-full bg-white border border-gray-300
                                        text-lg text-gray-700 font-bold
                                        hover:bg-gray-100
                                        disabled:opacity-40
                                    "
                                >
                                    +
                                </button>
                            </div>

                            {/* Subtotal */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-xs text-gray-500">Subtotal</p>
                                <p className="font-semibold text-lg text-gray-900">
                                    S/. {(price * item.cantidad).toFixed(2)}
                                </p>
                            </div>

                            {/* Eliminar */}
                            <button
                                onClick={() => removeFromCart(itemId)}
                                className="text-red-500 hover:text-red-700 p-2 flex-shrink-0"
                                aria-label={`Eliminar ${displayName}`}
                            >
                                <FiTrash2 size={20} />
                            </button>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}
