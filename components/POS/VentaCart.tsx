"use client";

import { useCartStore } from "@/src/store/cartStore";
import SubmitSaleButton from "./SubmitSaleButton";
import { FaShoppingCart } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import Image from "next/image";

export default function VentaCart() {
    // Destructure cart, updateQuantity, and removeFromCart directly for cleaner access
    const { cart, updateQuantity, removeFromCart } = useCartStore();

    // Calculate total in a single line, leveraging reduce
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div className="">
            {cart.length === 0 ? (
                // Display empty cart message when no items are present
                <div className="flex flex-col items-center justify-center py-12">
                    <FaShoppingCart size={56} className="text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center text-xs sm:text-md">Tu carrito está vacío.</p>
                </div>
            ) : (
                // Render cart items and total when items are in the cart
                <>
                    <ul className="divide-y divide-gray-200 mb-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                        {cart.map((item) => (
                            <li key={item._id} className="flex items-center justify-between py-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={item.imagenes[0] || "/logo.svg"}
                                        alt={item.nombre}
                                        width={50}
                                        height={50}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div>
                                        <p className="text-gray-800 ">{item.nombre}</p>
                                        <p className="text-gray-500">S/. {item.precio.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <span className="text-gray-800">{item.cantidad}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                    >
                                        +
                                    </button>

                                </div>
                                {/* Display item subtotal clearly */}
                                <span className="text-gray-900 font-semibold">
                                    S/. {(item.precio * item.cantidad).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-500 hover:text-red-700"
                                    aria-label={`Eliminar ${item.nombre}`}
                                >
                                    <FiTrash2 size={20} />
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="text-end text-gray-800 text-base sm:text-lg">
                        Total:{" "}
                        <span className="text-xl font-bold text-gray-950">S/. {total.toFixed(2)}</span>
                    </div>

                    <div className="mt-6">
                        <SubmitSaleButton />
                    </div>
                </>
            )}
        </div>
    );
}