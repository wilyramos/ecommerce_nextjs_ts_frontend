"use client";

import { useCartStore } from "@/src/store/cartStore";
import SubmitSaleButton from "./SubmitSaleButton";
import { FaShoppingCart } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import Image from "next/image";
import CustomerDniInput from "./CustomerDniInput";

export default function VentaCart() {
    const { cart, updateQuantity, removeFromCart } = useCartStore();
    const dni = useCartStore((s) => s.dni);
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <FaShoppingCart size={56} className="mb-4" />
                <p className="text-sm">Tu carrito está vacío.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Lista de productos */}
            <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full text-sm text-gray-800">
                    <thead className="bg-gray-100 text-xs sticky top-0 z-10">
                        <tr>
                            <th className="py-2 px-2 text-left">Producto</th>
                            <th className="py-2 text-center">Cantidad</th>
                            <th className="py-2 px-2 text-right">Subtotal</th>
                            <th className="py-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item._id} className="border-b">
                                <td className="py-2 px-2">
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
                                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded text-xs text-gray-500">
                                                Sin imagen
                                            </div>
                                        )}
                                        <span className="truncate max-w-[120px]">{item.nombre}</span>
                                    </div>
                                </td>
                                <td className="text-center text-rose-600 font-extrabold">
                                    <div className="flex items-center justify-center gap-1">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.cantidad - 1)}
                                            disabled={item.cantidad <= 1}
                                            className="w-7 h-7 flex items-center justify-center border-2 border-gray-400 hover:border-gray-800 rounded disabled:opacity-50 cursor-pointer"
                                        >
                                            −
                                        </button>
                                        <span className="px-2">{item.cantidad}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.cantidad + 1)}
                                            disabled={item.cantidad >= item.stock}
                                            className="w-7 h-7 flex items-center justify-center hover:border-gray-800 rounded border-2 border-gray-400 disabled:opacity-50 cursor-pointer"
                                        >
                                            +
                                        </button>

                                    </div>
                                </td>
                                <td className="text-right px-2">
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

            {/* DNI del cliente :TODO:: implementar lógica para manejar el DNI */}
            <div className="space-y-1 rounded-full">
                <CustomerDniInput />
                {dni && (
                    <p className="text-xs text-gray-500">DNI del cliente: <span className="font-semibold">{dni}</span></p>
                )}
            </div>

            {/* Total y botón */}
            <div className="flex flex-col items-end space-y-2">
                <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900">S/. {total.toFixed(2)}</p>
                </div>
                <SubmitSaleButton />
            </div>
        </div>
    );
}
