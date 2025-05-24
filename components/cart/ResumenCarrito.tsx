"use client"

import { useCartStore } from "@/src/store/cartStore"
import ItemCarrito from "./ItemCarrito"
import { useRouter } from "next/navigation";
import { FaShoppingCart } from "react-icons/fa"; // Importa un icono de carrito

export default function ResumenCarrito() {
    const { cart } = useCartStore()
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0)
    const router = useRouter();

    return (
        <div className="p-4">
            {cart.length > 0 ? (
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Resumen del Carrito</h3>
                    <ul className="mt-2 divide-y divide-gray-200">
                        {cart.map(item => (
                            <ItemCarrito key={item._id} item={item} />
                        ))}
                    </ul>
                    <div className="mt-4 text-gray-800 text-end pt-2">
                        Total: S/. <span className="text-xl font-bold text-gray-950">{total.toFixed(2)}</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-8">
                    <FaShoppingCart size={48} className="text-gray-400 mb-4" />
                    <p className="text-gray-600 text-center mb-2">Tu carrito está vacío.</p>
                    <button
                        onClick={() => router.push('/productos')} // Asumiendo que tienes una ruta /productos
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded"
                    >
                        Seguir comprando
                    </button>
                </div>
            )}
        </div>
    )
}