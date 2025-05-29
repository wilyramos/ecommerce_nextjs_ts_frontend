"use client";

import { useCartStore } from "@/src/store/cartStore";
import SubmitSaleButton from "./SubmitSaleButton";
import { FaShoppingCart } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import CustomerDniInput from "./CustomerDniInput";

export default function VentaCart() {
    const { cart, updateQuantity, removeFromCart } = useCartStore();
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);
    const dni = useCartStore((s) => s.dni);

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <FaShoppingCart size={56} className="text-gray-400 mb-4" />
                <p className="text-gray-600 text-sm">Tu carrito está vacío.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-50 text-gray-800 border-b text-xs">
                        <tr>
                            <th className="py-2">Producto</th>
                            <th className="py-2 text-center">Cantidad</th>
                            <th className="py-2 text-right">Subtotal</th>
                            <th className="py-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item._id} className="border-b last:border-b-0">
                                <td className="py-2 pr-2">
                                    <div className="flex items-center gap-2">
                                        {item.imagenes?.[0] ? (
                                            <Image
                                                src={item.imagenes[0]}
                                                alt={item.nombre}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 object-cover rounded border"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded text-xs text-gray-500">
                                                Sin imagen
                                            </div>
                                        )}
                                        <span className="truncate max-w-[120px]">{item.nombre}</span>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                                            disabled={item.cantidad <= 1}
                                            className="px-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span>{item.cantidad}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                                            className="px-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="text-right pr-2 text-sm text-gray-800">
                                    S/. {(item.precio * item.cantidad).toFixed(2)}
                                </td>
                                <td className="text-center">
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500 hover:text-red-700"
                                        aria-label={`Eliminar ${item.nombre}`}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CustomerDniInput />
            {dni && (
                <div className="text-sm text-gray-700">
                    DNI del cliente: <span className="font-medium">{dni}</span>
                </div>
            )}

            <div className="text-end">
                <p className="text-sm text-gray-600">Total:</p>
                <p className="text-xl font-bold text-gray-900">S/. {total.toFixed(2)}</p>
            </div>

            <SubmitSaleButton />
        </div>
    );
}
