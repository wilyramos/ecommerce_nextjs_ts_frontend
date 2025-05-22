"use client"

import { useCartStore } from "@/src/store/cartStore"
import Image from "next/image"

export default function ResumenFinalCarrito() {
    const { cart } = useCartStore()
    const total = cart.reduce((acc, item) => acc + item.subtotal, 0)

    return (
        <section className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Resumen del Carrito</h2>
            
            <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {cart.map(item => (
                    <li key={item._id} className="flex justify-between items-start border-b pb-4">
                        <div className="flex gap-4">
                           <Image
                                src={item.imagenes[0]}
                                alt={item.nombre}
                                width={100}
                                height={100}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="text-sm">
                                <h3 className="font-semibold text-gray-700">{item.nombre}</h3>
                                <p className="text-gray-500">Cantidad: {item.cantidad}</p>
                                <p className="text-gray-500">Precio unitario: S/. {item.precio.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="text-right text-sm font-semibold text-gray-800">
                            S/. {item.subtotal.toFixed(2)}
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-6 border-t pt-4 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span>S/. {total.toFixed(2)}</span>
            </div>
        </section>
    )
}
