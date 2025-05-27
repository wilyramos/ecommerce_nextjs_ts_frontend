"use client";

import { useCartStore } from "@/src/store/cartStore";
import SubmitSaleButton from "./SubmitSaleButton";

export default function VentaCart() {
    const { cart } = useCartStore();

    const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div className="bg-white p-4 rounded-xl shadow-md">

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de venta</h3>
            {cart.length === 0 ? (
                <p className="text-gray-500">No hay productos en el carrito.</p>
            ) : (
                <>
                    <ul className="divide-y divide-gray-200">
                        {cart.map(item => (
                            <li key={item._id} className="py-3 flex justify-between items-center">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-800">{item.nombre}</p>
                                    <p className="text-xs text-gray-500">
                                        ${item.precio.toFixed(2)} x {item.cantidad}
                                    </p>
                                </div>
                                <div className="text-sm font-semibold text-primary">
                                    ${item.subtotal.toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <dl>
                        <div className="flex justify-between">
                            <dt className="font-medium text-gray-700">Descuento:</dt>
                            <dd className="text-gray-900">-${(total * 0.1).toFixed(2)}</dd>
                        </div>
                    </dl>

                    <SubmitSaleButton />
                </>
            )}

            
        </div>
    );
}
